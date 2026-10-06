// Company facts shown across the site. Update here, not in individual pages.
export const SITE = {
  name: 'Rivuletduo',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rivuletduo.com',
  foundedYear: 2021,
  email: 'hello@rivuletduo.com',
  // Real NZ number not supplied yet — phone links stay hidden while this is empty.
  phone: '',
  city: 'Auckland',
  location: 'Auckland, New Zealand',
};

export const yearsInBusiness = () => new Date().getFullYear() - SITE.foundedYear;

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;
