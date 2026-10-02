'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsContextType {
  logEvent: (eventType: string, metadata?: any) => Promise<void>;
  stampuser: string | undefined;
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
type UtmKey = (typeof UTM_KEYS)[number];
const UTM_SESSION_COOKIE = 'utm_session';
const UTM_FIRST_COOKIE = 'utm_first';
// Browsers cap cookie lifetime (~400 days), so this is effectively "as long as allowed".
const UTM_FIRST_EXPIRY_DAYS = 3650;

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

  // Get or create stampuser
  const getStampUser = useCallback(() => {
    let user = Cookies.get('stampuser');
    if (!user) {
      user = uuidv4();
      Cookies.set('stampuser', user, { expires: 365 });
    }
    return user;
  }, []);

  // UTMs persist for the browser session (session cookie, no expiry). New UTMs in the URL replace them.
  // utm_first is the first-ever utm_campaign and is never overwritten.
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
    if (!utm_first && utms.utm_campaign) {
      utm_first = utms.utm_campaign;
      Cookies.set(UTM_FIRST_COOKIE, utm_first, { expires: UTM_FIRST_EXPIRY_DAYS });
    }

    return { ...utms, utm_first };
  }, []);

  const logEvent = useCallback(async (eventType: string, metadata: any = {}) => {
    try {
      const utms = getUTMs();
      const stampuser = getStampUser();
      const url = typeof window !== 'undefined' ? window.location.href : '';

      const { error } = await supabase.from('logs').insert([
        {
          event_type: eventType.toUpperCase(),
          url,
          stampuser,
          ...utms,
          metadata,
        },
      ]);

      if (error) console.error('Tracking Error:', error);
    } catch (err) {
      console.error('Analytics Error:', err);
    }
  }, [getUTMs, getStampUser]);

  // Log "Website View" on route change
  useEffect(() => {
    logEvent('WEBSITE_VIEW');
  }, [pathname, logEvent]);

  return (
    <AnalyticsContext.Provider value={{ logEvent, stampuser: Cookies.get('stampuser') }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
