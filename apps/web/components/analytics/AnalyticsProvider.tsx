'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsContextType {
  logEvent: (eventType: string, metadata?: any) => Promise<void>;
  stampuser: string | undefined;
}

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
  const searchParams = useSearchParams();

  // Get or create stampuser
  const getStampUser = useCallback(() => {
    let user = Cookies.get('stampuser');
    if (!user) {
      user = uuidv4();
      Cookies.set('stampuser', user, { expires: 365 });
    }
    return user;
  }, []);

  const getUTMs = useCallback(() => {
    return {
      utm_source: searchParams.get('utm_source')?.toUpperCase() || searchParams.get('UTM_SOURCE'),
      utm_medium: searchParams.get('utm_medium')?.toUpperCase() || searchParams.get('UTM_MEDIUM'),
      utm_campaign: searchParams.get('utm_campaign')?.toUpperCase() || searchParams.get('UTM_CAMPAIGN'),
      utm_content: searchParams.get('utm_content')?.toUpperCase() || searchParams.get('UTM_CONTENT'),
      utm_term: searchParams.get('utm_term')?.toUpperCase() || searchParams.get('UTM_TERM'),
    };
  }, [searchParams]);

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
