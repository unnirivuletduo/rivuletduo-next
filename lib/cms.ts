export type ServiceCard = {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  href: string;
};

export type ServiceCategory = {
  id: string;
  num: string;
  titlePrefix: string;
  titleEm: string;
  desc: string;
  services: ServiceCard[];
};

export type ServiceDetail = {
  slug: string;
  title: string;
  titleEm: string;
  badge: string;
  num: string;
  tagline: string;
};

export type WorkListItem = {
  id: string;
  href: string;
  num: string;
  year: string;
  tag: string;
  title: string;
  desc: string;
  services: string[];
  category: string;
  featured?: boolean;
  canvasId: string;
  visualType: 'ecommerce' | 'dashboard' | 'brand' | 'webapp' | 'landing' | 'platform';
};

export type WorkDetail = {
  slug: string;
  titleHtml: string;
  shortName: string;
  tag: string;
  num: string;
  tagline: string;
  client: string;
  year: string;
  duration: string;
  role: string;
  industry: string;
  tags: string[];
  metrics: string[];
  mLabels: string[];
  mChanges: string[];
  testQuote: string;
  testAv: string;
  testName: string;
  testRole: string;
};

export type HomeBannerContent = {
  badge: string;
  headlineLine1: string;
  headlineEmphasis: string;
  headlineLine3: string;
  subcopy: string;
  tickerItems: string[];
};

export type HomeProcessStep = {
  n: string;
  title: string;
  desc: string;
  tags: string[];
};

export type HomeTestimonial = {
  initials: string;
  text: string;
  name: string;
  role: string;
};

export type HomeContent = {
  banner: HomeBannerContent;
  process: HomeProcessStep[];
  testimonials: HomeTestimonial[];
};

type WpEntity = {
  slug?: string;
  date?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  acf?: Record<string, unknown>;
};

function getWordPressBaseUrl() {
  return process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
}

function getWordPressRootApiUrl() {
  const base = getWordPressBaseUrl().replace(/\/$/, '');
  if (!base) return '';
  return base.endsWith('/wp/v2') ? base.slice(0, -6) : base;
}

function getWpType(name: 'services' | 'work') {
  if (name === 'services') {
    return process.env.WORDPRESS_SERVICES_TYPE || 'services';
  }
  return process.env.WORDPRESS_WORK_TYPE || 'work';
}

function toPath(slug: string, type: 'services' | 'work') {
  return `/${type}/${slug}`;
}

function stripHtml(input: unknown) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []) {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function firstWords(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return { title: words[0] || 'Service', titleEm: 'Detail' };
  }
  return {
    title: words.slice(0, Math.ceil(words.length / 2)).join(' '),
    titleEm: words.slice(Math.ceil(words.length / 2)).join(' '),
  };
}

function visualTypeFor(category: string): WorkListItem['visualType'] {
  const value = category.toLowerCase();
  if (value.includes('commerce') || value.includes('shop')) return 'ecommerce';
  if (value.includes('saas') || value.includes('dashboard')) return 'dashboard';
  if (value.includes('brand')) return 'brand';
  if (value.includes('landing') || value.includes('marketing') || value.includes('fintech')) return 'landing';
  if (value.includes('platform')) return 'platform';
  return 'webapp';
}

async function fetchWordPressCollection(type: 'services' | 'work') {
  const baseUrl = getWordPressBaseUrl();
  if (!baseUrl) return null;

  const postType = getWpType(type);
  const url = `${baseUrl.replace(/\/$/, '')}/${postType}?per_page=100&_embed=1`;

  try {
    const response = await fetch(url, { next: { revalidate: 120 } });
    if (!response.ok) return null;
    const data = (await response.json()) as WpEntity[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function getServicesPageData(): Promise<ServiceCategory[] | null> {
  const items = await fetchWordPressCollection('services');
  if (!items || items.length === 0) return null;

  const grouped = new Map<string, ServiceCategory>();

  items.forEach((item, idx) => {
    const acf = item.acf || {};
    const title = stripHtml(item.title?.rendered) || `Service ${idx + 1}`;
    const categoryId = asString(acf.category_id, 'general');
    const categoryNum = asString(acf.category_num, '01 —');
    const categoryTitle = asString(acf.category_title, 'Services');
    const categoryDesc = asString(acf.category_desc, 'Services managed from WordPress.');
    const [prefix, ...rest] = categoryTitle.split(' ');

    if (!grouped.has(categoryId)) {
      grouped.set(categoryId, {
        id: categoryId,
        num: categoryNum,
        titlePrefix: prefix || 'Services',
        titleEm: rest.join(' ') || 'Overview',
        desc: categoryDesc,
        services: [],
      });
    }

    const category = grouped.get(categoryId);
    if (!category) return;

    category.services.push({
      num: asString(acf.num, `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`),
      title,
      desc: asString(acf.short_description, stripHtml(item.excerpt?.rendered) || 'Service description managed in WordPress.'),
      tags: asStringArray(acf.tags, ['WordPress', 'CMS']),
      href: toPath(asString(item.slug, `service-${idx + 1}`), 'services'),
    });
  });

  return Array.from(grouped.values());
}

export async function getServiceDetailsData(): Promise<ServiceDetail[] | null> {
  const items = await fetchWordPressCollection('services');
  if (!items || items.length === 0) return null;

  return items.map((item, idx) => {
    const acf = item.acf || {};
    const fullTitle = stripHtml(item.title?.rendered) || `Service ${idx + 1}`;
    const split = firstWords(fullTitle);

    return {
      slug: asString(item.slug, `service-${idx + 1}`),
      title: asString(acf.title_prefix, split.title),
      titleEm: asString(acf.title_em, split.titleEm),
      badge: asString(acf.badge, 'WordPress Service'),
      num: asString(acf.num, String(idx + 1).padStart(2, '0')),
      tagline: asString(acf.tagline, stripHtml(item.excerpt?.rendered) || 'Service details managed from WordPress.'),
    };
  });
}

export async function getWorkPageData(): Promise<WorkListItem[] | null> {
  const items = await fetchWordPressCollection('work');
  if (!items || items.length === 0) return null;

  return items.map((item, idx) => {
    const acf = item.acf || {};
    const slug = asString(item.slug, `work-${idx + 1}`);
    const category = asString(acf.category, 'Web App');

    return {
      id: slug,
      href: toPath(slug, 'work'),
      num: asString(acf.num, String(idx + 1).padStart(2, '0')),
      year: asString(acf.year, item.date?.slice(0, 4) || '2026'),
      tag: asString(acf.tag, category),
      title: stripHtml(item.title?.rendered) || `Project ${idx + 1}`,
      desc: asString(acf.short_description, stripHtml(item.excerpt?.rendered) || 'Project details managed in WordPress.'),
      services: asStringArray(acf.services, ['Design', 'Development']),
      category,
      featured: Boolean(acf.featured),
      canvasId: `wc-${slug.replace(/[^a-z0-9-]/gi, '')}`,
      visualType: visualTypeFor(category),
    };
  });
}

export async function getWorkDetailsData(): Promise<WorkDetail[] | null> {
  const items = await fetchWordPressCollection('work');
  if (!items || items.length === 0) return null;

  return items.map((item, idx) => {
    const acf = item.acf || {};
    const shortName = stripHtml(item.title?.rendered) || `Project ${idx + 1}`;
    const split = firstWords(shortName);
    const tags = asStringArray(acf.tags, ['WordPress', 'CMS']);

    return {
      slug: asString(item.slug, `work-${idx + 1}`),
      titleHtml: asString(acf.title_html, `${split.title}<br><i>${split.titleEm}</i>`),
      shortName,
      tag: asString(acf.tag, 'Case Study'),
      num: asString(acf.num, `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`),
      tagline: asString(acf.tagline, stripHtml(item.excerpt?.rendered) || 'Project managed from WordPress.'),
      client: asString(acf.client, 'Client Name'),
      year: asString(acf.year, item.date?.slice(0, 4) || '2026'),
      duration: asString(acf.duration, '8 weeks'),
      role: asString(acf.role, 'Design + Development'),
      industry: asString(acf.industry, 'Technology'),
      tags,
      metrics: asStringArray(acf.metrics, ['+30%', '2.0s', '95', '8wk']).slice(0, 4),
      mLabels: asStringArray(acf.metric_labels, ['Conversion', 'Load Time', 'Lighthouse', 'Timeline']).slice(0, 4),
      mChanges: asStringArray(acf.metric_changes, ['Improved', 'Optimized', 'Performance', 'On schedule']).slice(0, 4),
      testQuote: asString(acf.testimonial_quote, 'Working with Rivuletduo was smooth from kickoff to launch.'),
      testAv: asString(acf.testimonial_avatar, 'RD'),
      testName: asString(acf.testimonial_name, 'Client Team'),
      testRole: asString(acf.testimonial_role, 'Project Lead'),
    };
  }).map((project) => {
    const metrics = project.metrics.length === 4 ? project.metrics : [...project.metrics, '+0%', '2.0s', '95', '8wk'].slice(0, 4);
    const mLabels = project.mLabels.length === 4 ? project.mLabels : [...project.mLabels, 'Conversion', 'Load Time', 'Lighthouse', 'Timeline'].slice(0, 4);
    const mChanges = project.mChanges.length === 4 ? project.mChanges : [...project.mChanges, 'Improved', 'Optimized', 'Performance', 'On schedule'].slice(0, 4);
    return {
      ...project,
      metrics,
      mLabels,
      mChanges,
    };
  });
}

function fallbackHomeContent(): HomeContent {
  return {
    banner: {
      badge: 'Est. 2024 · Web Dev Studio',
      headlineLine1: 'We Build',
      headlineEmphasis: 'Digital',
      headlineLine3: 'Experiences',
      subcopy: 'From pixel-perfect interfaces to scalable full-stack systems — we craft web products that feel as good as they perform.',
      tickerItems: [
        'React & Next.js',
        'Tailwind & Motion',
        'Node & Express',
        'PostgreSQL & Supabase',
        'UI / UX Design',
        'API Architecture',
        'Performance Optimisation',
        'SEO & Analytics',
      ],
    },
    process: [
      {
        n: '01',
        title: 'Discovery',
        desc: 'We listen before we build. Deep dives into goals, audience, and constraints — mapping every variable before a pixel is placed.',
        tags: ['Research', 'Interviews', 'Brief'],
      },
      {
        n: '02',
        title: 'Design',
        desc: 'Wireframes to pixel-perfect mockups. Rapid iteration with you in the loop at every step — nothing moves forward without your sign-off.',
        tags: ['Wireframes', 'Prototypes', 'UI/UX'],
      },
      {
        n: '03',
        title: 'Build',
        desc: "Production-grade code, rigorously tested across every device and edge case. We don't ship half-finished work — quality is non-negotiable.",
        tags: ['Engineering', 'QA', 'Performance'],
      },
      {
        n: '04',
        title: 'Launch & Support',
        desc: 'Smooth handoff, comprehensive training, and ongoing support baked into every engagement. We stay long after go-live — for good.',
        tags: ['Deploy', 'Training', 'Support'],
      },
    ],
    testimonials: [
      {
        initials: 'AR',
        text: 'Rivuletduo transformed our online presence. Beautiful, fast, and our conversions jumped 40% in the first month.',
        name: 'Arjun Rajan',
        role: 'Founder, Verdant Goods',
      },
      {
        initials: 'SM',
        text: 'A complex dashboard in two weeks, on budget, zero compromise on quality. Genuinely impressive duo.',
        name: 'Sofia Mercer',
        role: 'CTO, FlowMetrics',
      },
      {
        initials: 'DK',
        text: 'Felt like having an in-house team. Communication was clear, feedback welcomed, and the result exceeded expectations.',
        name: 'Devika Kumar',
        role: 'Creative Director, Celadon Studio',
      },
      {
        initials: 'JT',
        text: "I've worked with bigger agencies — Rivuletduo care more. It shows in every single detail of the final site.",
        name: 'James Tan',
        role: 'Founder, Heliostack',
      },
    ],
  };
}

export async function getHomeContentData(): Promise<HomeContent> {
  const fallback = fallbackHomeContent();
  const rootApi = getWordPressRootApiUrl();
  if (!rootApi) return fallback;

  try {
    const response = await fetch(`${rootApi}/rivulet/v1/home`, { next: { revalidate: 120 } });
    if (!response.ok) return fallback;
    const data = (await response.json()) as Partial<HomeContent> | null;
    if (!data) return fallback;

    return {
      banner: {
        badge: asString(data.banner?.badge, fallback.banner.badge),
        headlineLine1: asString(data.banner?.headlineLine1, fallback.banner.headlineLine1),
        headlineEmphasis: asString(data.banner?.headlineEmphasis, fallback.banner.headlineEmphasis),
        headlineLine3: asString(data.banner?.headlineLine3, fallback.banner.headlineLine3),
        subcopy: asString(data.banner?.subcopy, fallback.banner.subcopy),
        tickerItems: asStringArray(data.banner?.tickerItems, fallback.banner.tickerItems),
      },
      process: (Array.isArray(data.process) ? data.process : fallback.process).slice(0, 4).map((step, idx) => ({
        n: asString(step?.n, fallback.process[idx]?.n || String(idx + 1).padStart(2, '0')),
        title: asString(step?.title, fallback.process[idx]?.title || `Step ${idx + 1}`),
        desc: asString(step?.desc, fallback.process[idx]?.desc || 'Process step description'),
        tags: asStringArray(step?.tags, fallback.process[idx]?.tags || ['Process']),
      })),
      testimonials: (Array.isArray(data.testimonials) ? data.testimonials : fallback.testimonials).slice(0, 8).map((item, idx) => ({
        initials: asString(item?.initials, fallback.testimonials[idx]?.initials || 'RD'),
        text: asString(item?.text, fallback.testimonials[idx]?.text || 'Great partnership and results.'),
        name: asString(item?.name, fallback.testimonials[idx]?.name || 'Client Name'),
        role: asString(item?.role, fallback.testimonials[idx]?.role || 'Client Role'),
      })),
    };
  } catch {
    return fallback;
  }
}
