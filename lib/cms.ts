import { SITE, yearsInBusiness } from '@/lib/site';

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
  image?: string;
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
  liveUrl?: string;
  overviewHeading?: [string, string, string?];
  overview?: string[];
  showcase?: { label: string; text: string; image?: string }[];
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
  return (
    process.env.WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    process.env.WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    ''
  );
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
  let items: string[] = [];
  if (typeof value === 'string') {
    items = value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  } else if (Array.isArray(value)) {
    items = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }
  return items.length > 0 ? items : fallback;
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
      client: asString(acf.client, shortName),
      year: asString(acf.year, item.date?.slice(0, 4) || '2026'),
      duration: asString(acf.duration),
      role: asString(acf.role, 'Design + Development'),
      industry: asString(acf.industry),
      tags,
      metrics: asStringArray(acf.metrics).slice(0, 4),
      mLabels: asStringArray(acf.metric_labels).slice(0, 4),
      mChanges: asStringArray(acf.metric_changes).slice(0, 4),
      testQuote: asString(acf.testimonial_quote),
      testAv: asString(acf.testimonial_avatar),
      testName: asString(acf.testimonial_name),
      testRole: asString(acf.testimonial_role),
    };
  });
}

function fallbackHomeContent(): HomeContent {
  return {
    banner: {
      badge: `Est. ${SITE.foundedYear} · Software Development · New Zealand`,
      headlineLine1: 'We Build',
      headlineEmphasis: 'Software',
      headlineLine3: 'That Scales',
      subcopy: 'Rivuletduo is a New Zealand software development company. We design, build and grow custom software, websites, mobile apps and online stores — with SEO and performance built in from day one.',
      tickerItems: [
        'Custom Software',
        'Web Applications',
        'Website Development',
        'Mobile Apps',
        'E-Commerce',
        'SEO & Analytics',
        'UI / UX Design',
        'Cloud & API Integration',
        'Maintenance & Support',
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
        title: 'Launch & Grow',
        desc: 'Deployment, SEO setup, analytics and training, with ongoing support baked into every engagement. We stay long after go-live to help you grow.',
        tags: ['Deploy', 'SEO', 'Support'],
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
        text: 'A complex dashboard in two weeks, on budget, zero compromise on quality. Genuinely impressive team.',
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
      testimonials: (Array.isArray(data.testimonials) && data.testimonials.length > 0 ? data.testimonials : fallback.testimonials).slice(0, 8).map((item, idx) => ({
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

export type ContactFaq = {
  q: string;
  a: string;
};

export type ContactPageContent = {
  hero: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    email: string;
    phone: string;
    responseTime: string;
  };
  leftPanel: {
    label: string;
    headline: string;
    desc: string;
    availText: string;
  };
  faqs: ContactFaq[];
  location: {
    label: string;
    headline: string;
    desc: string;
    studio: string;
    hours: string;
    mapLabel: string;
    mapCoords: string;
  };
};

export const CONTACT_FAQS: ContactFaq[] = [
  {
    q: 'How long does a typical project take?',
    a: "It depends on scope, but as a guide: a branding identity takes 2–3 weeks, a marketing website 4–8 weeks and a custom web application 8–16 weeks. Mobile apps and larger software platforms vary more. After our discovery call, we'll give you a detailed timeline before any work begins.",
  },
  {
    q: 'Do you work with clients outside New Zealand?',
    a: "Absolutely. We're based in Auckland and build software, websites and apps for clients in the US, UK, Australia and around the world. We schedule calls at times that suit your time zone — remote collaboration is second nature to us.",
  },
  {
    q: 'Can you work on an existing website or app?',
    a: 'Yes. We can audit, fix, improve or extend existing websites, apps and software — including performance and SEO problems — or recommend a rebuild when that makes more sense.',
  },
  {
    q: 'Will I own the code and designs after the project?',
    a: 'Yes. Upon final payment, full intellectual property — including all source code, design files and assets — transfers entirely to you. No licensing fees, no lock-in, no strings attached.',
  },
  {
    q: 'Do you offer maintenance and support after launch?',
    a: 'Yes. We offer ongoing support and maintenance plans covering updates, security, monitoring, improvements and SEO, so your website or software keeps performing long after launch.',
  },
  {
    q: 'What happens after I send an enquiry?',
    a: "We'll reply within 24 hours to arrange a short discovery call. After that, we'll send a clear proposal outlining scope, approach and timeline — with no obligation to go ahead.",
  },
];

function fallbackContactPageContent(): ContactPageContent {
  return {
    hero: {
      eyebrow: 'Get in touch',
      headline: "<span>Let's talk about</span><span>your next</span><span><i>project.</i></span>",
      subcopy: "Tell us about your project and we'll get back to you within 24 hours. No obligations, no hard sell — just an honest conversation.",
      email: SITE.email,
      phone: SITE.phone,
      responseTime: 'Within 24 hours',
    },
    leftPanel: {
      label: 'Why reach out',
      headline: 'Every great project starts with a <i>conversation</i>',
      desc: "We'd love to hear from you. Whether you have a detailed brief or just a rough idea, we'll help you work out the best path forward — no jargon, no pressure.",
      availText: 'Currently accepting new projects',
    },
    faqs: CONTACT_FAQS,
    location: {
      label: 'Where we are',
      headline: 'Based in <i>Auckland,</i><br />building for the world',
      desc: 'Our team is rooted in Auckland, New Zealand, and our work reaches clients across New Zealand, the US, the UK, Australia and beyond. We collaborate remotely, wherever you are.',
      studio: SITE.location,
      hours: 'Monday – Friday, 9am – 6pm NZT',
      mapLabel: 'Auckland, NZ',
      mapCoords: '36.8485° S, 174.7633° E',
    },
  };
}

function asContactFaqs(value: unknown, fallback: ContactFaq[]) {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const q = asString((item as { q?: unknown })?.q);
      const a = asString((item as { a?: unknown })?.a);
      if (!q || !a) return null;
      return { q, a };
    })
    .filter((item): item is ContactFaq => Boolean(item));
  return normalized.length ? normalized : fallback;
}

export async function getContactPageData(): Promise<ContactPageContent> {
  const fallback = fallbackContactPageContent();
  const rootApi = getWordPressRootApiUrl();
  if (!rootApi) return fallback;

  try {
    const response = await fetch(`${rootApi}/rivulet/v1/contact-page`, { cache: 'no-store' });
    if (!response.ok) return fallback;
    const data = (await response.json()) as Partial<ContactPageContent> | null;
    if (!data) return fallback;

    return {
      hero: {
        eyebrow: asString(data.hero?.eyebrow, fallback.hero.eyebrow),
        headline: asString(data.hero?.headline, fallback.hero.headline),
        subcopy: asString(data.hero?.subcopy, fallback.hero.subcopy),
        email: asString(data.hero?.email, fallback.hero.email),
        phone: asString(data.hero?.phone, fallback.hero.phone),
        responseTime: asString(data.hero?.responseTime, fallback.hero.responseTime),
      },
      leftPanel: {
        label: asString(data.leftPanel?.label, fallback.leftPanel.label),
        headline: asString(data.leftPanel?.headline, fallback.leftPanel.headline),
        desc: asString(data.leftPanel?.desc, fallback.leftPanel.desc),
        availText: asString(data.leftPanel?.availText, fallback.leftPanel.availText),
      },
      faqs: asContactFaqs(data.faqs, fallback.faqs),
      location: {
        label: asString(data.location?.label, fallback.location.label),
        headline: asString(data.location?.headline, fallback.location.headline),
        desc: asString(data.location?.desc, fallback.location.desc),
        studio: asString(data.location?.studio, fallback.location.studio),
        hours: asString(data.location?.hours, fallback.location.hours),
        mapLabel: asString(data.location?.mapLabel, fallback.location.mapLabel),
        mapCoords: asString(data.location?.mapCoords, fallback.location.mapCoords),
      },
    };
  } catch {
    return fallback;
  }
}

export type AboutHero = {
  headline: string;
  subheadline: string;
  stats: { n: string; l: string }[];
};

export type AboutStory = {
  paragraphs: string[];
  badgeYear: string;
  badgeLabel: string;
};

export type AboutValue = {
  title: string;
  desc: string;
};

export type AboutTeamMember = {
  role: string;
  name: string;
  bio: string;
  skills: string[];
};

export type AboutPhilosophy = {
  quote: string;
  attr: string;
};

export type AboutStackCategory = {
  cat: string;
  items: string[];
};

export type AboutContent = {
  hero: AboutHero;
  tickerItems: string[];
  story: AboutStory;
  values: AboutValue[];
  team: AboutTeamMember[];
  philosophy: AboutPhilosophy;
  stack: AboutStackCategory[];
};

function fallbackAboutContent(): AboutContent {
  return {
    hero: {
      headline: 'Built in New Zealand,<br />trusted <i>worldwide</i>',
      subheadline: 'Rivuletduo is a New Zealand software development company. Since 2021 we have helped businesses in New Zealand, the US, the UK and Australia design, build and grow custom software, websites, mobile apps and online stores.',
      stats: [
        { n: `${yearsInBusiness()}yr`, l: 'Experience' },
        { n: '4+', l: 'Countries Served' },
        { n: 'NZ', l: 'Based' },
      ],
    },
    tickerItems: ['Software Development', 'Based in New Zealand', `Founded ${SITE.foundedYear}`, 'Clients Worldwide', 'Web · Mobile · E-Commerce', 'SEO Built In'],
    story: {
      paragraphs: [
        `Rivuletduo started in New Zealand in ${SITE.foundedYear} with a simple belief: businesses deserve software that is built properly — fast, reliable, easy to use and designed around how they actually work.`,
        'Since then we have grown into a full-service software development company, designing and building custom web applications, websites, mobile apps and online stores for startups, small businesses and established organisations.',
        'Our home is New Zealand, but our clients are not limited by geography. We work with businesses across New Zealand, the US, the UK and Australia — and every project gets the same care, whether it is a first website or a complex software platform.',
      ],
      badgeYear: String(SITE.foundedYear),
      badgeLabel: 'Founded',
    },
    values: [
      { title: 'Craft over speed', desc: 'We would rather take an extra day and deliver something extraordinary than rush a mediocre product. Quality is non-negotiable — every line of code, every spacing decision earns its place.' },
      { title: 'Radical transparency', desc: 'No black boxes, no magic tricks. We communicate every decision, every constraint, every trade-off — so you always know exactly where your project stands and why.' },
      { title: 'Performance is design', desc: 'A slow website is a broken website. We treat Core Web Vitals and load time as design constraints from day one — not an afterthought patched on before launch.' },
      { title: 'Data-informed decisions', desc: 'Every layout choice, every CTA placement, every interaction is grounded in real user behaviour and business metrics. We design with purpose, not guesswork.' },
      { title: 'Long-term thinking', desc: 'We build for the next five years, not the next sprint. Scalable architecture, clean handoffs, and comprehensive documentation are not optional extras — they are our standard.' },
      { title: 'Partnership, not service', desc: 'We do not hand you a finished file and disappear. We become embedded in your product\'s story — advisors, builders, and advocates for the long haul.' }
    ],
    team: [],
    philosophy: {
      quote: 'Good software disappears into the work it supports. Our job is to make technology feel effortless for the people who use it — and dependable for the businesses that rely on it.',
      attr: 'Rivuletduo'
    },
    stack: [
      { cat: 'Design', items: ['Figma', 'Framer', 'Adobe Illustrator', 'Lottie / Rive', 'Storybook'] },
      { cat: 'Web & Mobile', items: ['React / Next.js', 'React Native', 'TypeScript', 'Tailwind CSS', 'Three.js / GSAP'] },
      { cat: 'Backend & Cloud', items: ['Node.js / Express', 'PostgreSQL', 'GraphQL / REST', 'Supabase', 'AWS / Vercel'] },
      { cat: 'CMS, Commerce & SEO', items: ['WordPress', 'Sanity / Contentful', 'Shopify / WooCommerce', 'Stripe', 'Search Console / GA4'] }
    ]
  };
}

export async function getAboutContentData(): Promise<AboutContent> {
  const fallback = fallbackAboutContent();
  const rootApi = getWordPressRootApiUrl();
  if (!rootApi) return fallback;

  try {
    const response = await fetch(`${rootApi}/rivulet/v1/about`, { next: { revalidate: 120 } });
    if (!response.ok) return fallback;
    const data = (await response.json()) as Partial<AboutContent> | null;
    if (!data) return fallback;

    return {
      hero: {
        headline: asString(data.hero?.headline, fallback.hero.headline),
        subheadline: asString(data.hero?.subheadline, fallback.hero.subheadline),
        stats: Array.isArray(data.hero?.stats) && data.hero?.stats.length > 0 ? data.hero.stats : fallback.hero.stats,
      },
      tickerItems: asStringArray(data.tickerItems, fallback.tickerItems),
      story: {
        paragraphs: asStringArray(data.story?.paragraphs, fallback.story.paragraphs),
        badgeYear: asString(data.story?.badgeYear, fallback.story.badgeYear),
        badgeLabel: asString(data.story?.badgeLabel, fallback.story.badgeLabel),
      },
      values: Array.isArray(data.values) && data.values.length > 0 ? data.values : fallback.values,
      team: Array.isArray(data.team) && data.team.length > 0 ? data.team : fallback.team,
      philosophy: {
        quote: asString(data.philosophy?.quote, fallback.philosophy.quote),
        attr: asString(data.philosophy?.attr, fallback.philosophy.attr),
      },
      stack: Array.isArray(data.stack) && data.stack.length > 0 ? data.stack : fallback.stack,
    };
  } catch {
    return fallback;
  }
}
