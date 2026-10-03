'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsContextType {
  logEvent: (eventType: string, metadata?: any) => Promise<void>;
  visitorId: string | undefined;
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
type UtmKey = (typeof UTM_KEYS)[number];
const VISITOR_COOKIE = 'visitor_id';
const LEGACY_VISITOR_COOKIE = 'stampuser';
const UTM_SESSION_COOKIE = 'utm_session';
const UTM_FIRST_COOKIE = 'utm_first';
// Browsers cap cookie lifetime (~400 days), so this is effectively "as long as allowed".
const UTM_FIRST_EXPIRY_DAYS = 3650;
const SESSION_COOKIE = 'session_id';
// A session ends when the browser closes (session cookie) or after 30 min of inactivity,
// since mobile browsers often keep session cookies alive for days.
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  // Get or create the visitor ID. Falls back to the legacy "stampuser" cookie so
  // returning visitors keep their existing ID.
  const getVisitorId = useCallback(() => {
    let id = Cookies.get(VISITOR_COOKIE);
    if (!id) {
      id = Cookies.get(LEGACY_VISITOR_COOKIE) || uuidv4();
      Cookies.set(VISITOR_COOKIE, id, { expires: 365 });
      Cookies.remove(LEGACY_VISITOR_COOKIE);
    }
    return id;
  }, []);

  // Cookie holds "<uuid>.<last activity ms>"; activity is bumped on every event.
  const getSessionId = useCallback(() => {
    const now = Date.now();
    const [id, last] = (Cookies.get(SESSION_COOKIE) || '').split('.');
    const sessionId = id && now - Number(last) < SESSION_TIMEOUT_MS ? id : uuidv4();
    Cookies.set(SESSION_COOKIE, `${sessionId}.${now}`);
    return sessionId;
  }, []);

  // UTMs persist for the browser session (session cookie, no expiry). New UTMs in the URL replace them.
  // utm_first is the first-ever utm_source + utm_campaign (e.g. "source=FB_campaign=GROUPS") and is never overwritten.
  // Read from window.location at event time rather than useSearchParams(): that hook
  // forces the whole tree under this provider to client-side rendering, which strips
  // all page content from the server-rendered HTML (bad for SEO and AI crawlers).
  const getUTMs = useCallback(() => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const fromUrl = Object.fromEntries(
      UTM_KEYS.map((key) => {
        const value = searchParams.get(key) || searchParams.get(key.toUpperCase());
        return [key, value ? value.toUpperCase() : null];
      })
    ) as Record<UtmKey, string | null>;

    let utms = fromUrl;
    if (UTM_KEYS.some((key) => fromUrl[key])) {
      Cookies.set(UTM_SESSION_COOKIE, JSON.stringify(fromUrl));
    } else {
      try {
        utms = { ...fromUrl, ...JSON.parse(Cookies.get(UTM_SESSION_COOKIE) || '{}') };
      } catch {
        // ignore malformed cookie
      }
    }

    let utm_first = Cookies.get(UTM_FIRST_COOKIE) || null;
    if (!utm_first && (utms.utm_source || utms.utm_campaign)) {
      utm_first = [
        utms.utm_source && `source=${utms.utm_source}`,
        utms.utm_campaign && `campaign=${utms.utm_campaign}`,
      ]
        .filter(Boolean)
        .join('_');
      Cookies.set(UTM_FIRST_COOKIE, utm_first, { expires: UTM_FIRST_EXPIRY_DAYS });
    }

    return { ...utms, utm_first };
  }, []);

  const logEvent = useCallback(async (eventType: string, metadata: any = {}) => {
    try {
      const utms = getUTMs();
      const visitor_id = getVisitorId();
      const session_id = getSessionId();
      const url = typeof window !== 'undefined' ? window.location.href : '';

      const { error } = await supabase.from('logs').insert([
        {
          event_type: eventType.toUpperCase(),
          url,
          visitor_id,
          session_id,
          ...utms,
          metadata,
        },
      ]);

      if (error) console.error('Tracking Error:', error);
    } catch (err) {
      console.error('Analytics Error:', err);
    }
  }, [getUTMs, getVisitorId, getSessionId]);

  // Log "Website View" on route change
  useEffect(() => {
    logEvent('WEBSITE_VIEW');
  }, [pathname, logEvent]);

  return (
    <AnalyticsContext.Provider value={{ logEvent, visitorId: Cookies.get(VISITOR_COOKIE) }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
