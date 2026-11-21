export const company = {
  name: 'Prime Stallion Construction and Development Inc.',
  tagline: 'Building Strength. Creating Legacy.',
  messenger: 'https://m.me/61565507044439',
  facebook: 'https://www.facebook.com/profile.php?id=61565507044439',
};

export const services = [
  { id: 'build', number: '01', name: 'Build', title: 'New home construction', summary: 'Build a new home from the ground up, whether you already have plans or need design and construction together.', scope: ['Ground-up construction', 'Design and build with signed and sealed plans'], points: ['Lot location and approximate size', 'Rooms and features your household needs', 'Whether you already have plans'], cta: 'Discuss a Build', inquiry: 'We’re planning a new home on [approximate lot size]. Our plans are [ready / not yet ready].' },
  { id: 'renovate', number: '02', name: 'Renovate', title: 'Property renovations', summary: 'Renovate a house or condo, or improve outdoor areas with gates, fencing and hardscape work.', scope: ['Home renovations', 'Condo renovations', 'Gates and fences', 'Hardscaping'], points: ['Property type and areas you want to change', 'What you want to keep or improve', 'Any condo or association restrictions you already know'], cta: 'Discuss a Renovation', inquiry: 'We want to renovate [home or condo] or improve [gates, fencing, or outdoor areas].' },
  { id: 'develop', number: '03', name: 'Develop', title: 'Housing and site development', summary: 'Discuss the scope of a housing development or site infrastructure project.', scope: ['Housing development', 'Roads and gutters', 'Stormwater drainage'], points: ['Site location and intended use', 'Housing, road, gutter or drainage work you need', 'Whether site plans are available'], cta: 'Discuss a Development Project', inquiry: 'We’re planning [housing or site development, road, gutter, or drainage work]. Site plans are [available / not yet available].' },
] as const;

export type Service = (typeof services)[number];

export const navigation = [
  { href: '/about', label: 'About' }, { href: '/services', label: 'Services' }, { href: '/projects', label: 'Projects' }, { href: '/contact', label: 'Contact' },
];

export const siteOrigin = process.env.SITE_URL?.replace(/\/$/, '');
export const canIndex = Boolean(siteOrigin && process.env.SITE_INDEXABLE === 'true' && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'));
