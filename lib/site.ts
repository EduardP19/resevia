// Shared marketing-site constants.

// The live agent sandbox in the resevia-agent app.
export const AGENT_APP_URL = process.env.NEXT_PUBLIC_AGENT_APP_URL || 'https://app.resevia.co.uk';
export const AGENT_SANDBOX_URL = `${AGENT_APP_URL}/sophia-sandbox`;

export const NAV_LINKS = [
  { href: '/#demo', label: 'Live demo' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/industries', label: 'Industries' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];
