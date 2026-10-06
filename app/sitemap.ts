import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getServiceDetailsData, getWorkDetailsData } from '@/lib/cms';
import { fallbackServiceDetails, fallbackWorkDetails } from '@/lib/details-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([getServiceDetailsData(), getWorkDetailsData()]);
  const serviceSlugs = (services?.length ? services : fallbackServiceDetails).map((s) => `/services/${s.slug}`);
  const workSlugs = (projects?.length ? projects : fallbackWorkDetails).map((p) => `/work/${p.slug}`);

  return ['', '/services', '/work', '/about', '/contact', ...serviceSlugs, ...workSlugs].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : path.split('/').length === 2 ? 0.8 : 0.6,
  }));
}
