'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export function ClarityInit() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (projectId) {
      Clarity.init(projectId);
    } else {
      console.warn("Microsoft Clarity Project ID is missing from environment variables.");
    }
  }, []);

  return null;
}
