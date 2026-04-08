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

function fallbackContactPageContent(): ContactPageContent {
  return {
    hero: {
      eyebrow: 'Get in touch',
      headline: "<span>Let's build</span><span>something</span><span><i>worth feeling.</i></span>",
      subcopy: "Tell us about your project and we'll get back to you within 24 hours. No obligations, no hard sell - just an honest conversation.",
      email: 'hello@rivuletduo.com',
      phone: '+1 (555) 000-0000',
      responseTime: 'Within 24 hours',
    },
    leftPanel: {
      label: 'Why reach out',
      headline: 'Every great site starts with a <i>conversation</i>',
      desc: "We'd love to hear from you. Whether you have a fully-formed brief or just a rough idea, we're here to help you figure out the path forward - no jargon, no pressure.",
      availText: 'Currently accepting new projects',
    },
    faqs: [
      {
        q: 'How long does a typical project take?',
        a: "It depends on scope, but as a guide: a branding identity takes 2-3 weeks, a marketing site 4-8 weeks, and a full-stack web application 8-16 weeks. After our discovery call, we'll give you a detailed timeline before any work begins.",
      },
      {
        q: "What's your minimum project size?",
        a: "We typically work on projects starting from $2,000. Smaller one-off tasks like logo design or a single landing page can sometimes fall below this - just reach out and we'll let you know if it's a good fit.",
      },
      {
        q: 'Do you work with clients internationally?',
        a: 'Absolutely. Our clients span New Zealand, the US, UK, Australia, and the Middle East. We work asynchronously and schedule calls at mutually convenient times - remote collaboration is second nature to us.',
      },
      {
        q: 'What does the payment structure look like?',
        a: 'We work on a milestone-based payment structure: typically 40% upfront, 40% at design approval, and 20% on final delivery. For larger projects, we can arrange a monthly billing schedule.',
      },
      {
        q: 'Will I own the code and designs after the project?',
        a: 'Yes. Upon final payment, full intellectual property - including all source code, design files, and assets - transfers entirely to you. No licensing fees, no lock-in, no strings attached.',
      },
      {
        q: 'Do you offer maintenance and support after launch?',
        a: 'Every project includes a 30-day post-launch support window at no extra cost. After that, we offer flexible monthly retainer plans for ongoing updates, monitoring, and support.',
      },
    ],
    location: {
      label: 'Where we are',
      headline: 'Based in <i>New Zealand,</i><br />building for the world',
      desc: 'We work remotely with clients across the globe. Our studio is rooted in New Zealand - but our work reaches San Francisco, London, Dubai, and beyond.',
      studio: 'New Zealand',
      hours: 'Monday - Friday, 9am - 6pm NZST',
      mapLabel: 'New Zealand',
      mapCoords: '41.2865° S, 174.7762° E',
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

export type AboutTimelineItem = {
  year: string;
  title: string;
  desc: string;
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
  timeline: AboutTimelineItem[];
  philosophy: AboutPhilosophy;
  stack: AboutStackCategory[];
};

function fallbackAboutContent(): AboutContent {
  return {
    hero: {
      headline: 'Two minds,<br />one <i>vision</i>',
      subheadline: 'We are Rivuletduo — a tight-knit studio where engineering precision meets design intuition. We build the web experiences people remember.',
      stats: [
        { n: '48+', l: 'Projects' },
        { n: '6yr', l: 'Experience' },
        { n: '100%', l: 'Satisfaction' },
      ],
    },
    tickerItems: ['Two Person Studio', 'New Zealand', 'Remote Friendly', 'Founded 2019', 'Open to Collaboration', 'Full-Stack Craft', 'Two Person Studio', 'New Zealand', 'Remote Friendly', 'Founded 2019', 'Open to Collaboration', 'Full-Stack Craft'],
    story: {
      paragraphs: [
        'Rivuletduo was born from a shared obsession — the belief that a website is never just a website. It is a living thing: it breathes, it moves, it speaks before a word is read.',
        'We met building side projects late into the night, each bringing a different half of the equation. One thinking in pixels and space, the other in systems and logic. The result was something neither could build alone.',
        'Since 2019 we have partnered with startups, creative agencies, and ambitious founders who refuse to settle for ordinary. Every project we take on becomes a reflection of that ethos — deliberate, precise, and made to last.'
      ],
      badgeYear: '2019',
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
    team: [
      { role: 'Co-Founder · Design & Frontend', name: 'Aryan Mehta', bio: 'Aryan leads visual direction and frontend architecture. He obsesses over type, motion, and the invisible moments between interactions that make an interface feel alive.', skills: ['Figma', 'React', 'Three.js', 'CSS Animation', 'UI Systems'] },
      { role: 'Co-Founder · Engineering & Strategy', name: 'Rahul Nair', bio: 'Rahul architects the systems that make everything run. He lives in the spaces between database query and rendered pixel — finding the optimisation no-one else thought to look for.', skills: ['Next.js', 'Node.js', 'PostgreSQL', 'GraphQL', 'DevOps'] }
    ],
    timeline: [
      { year: '2019', title: 'The beginning', desc: 'Two developers, one shared Notion doc, and a stubborn conviction that small studios could outperform large agencies. Rivuletduo takes its first client project.' },
      { year: '2020', title: 'Going fully remote', desc: 'We formalise a fully remote workflow and onboard our first international clients. The studio doubles its project count in twelve months.' },
      { year: '2021', title: 'First e-commerce milestone', desc: 'Verdant Goods launches — our most ambitious Shopify build to date. Conversion rates jump 40% within the first quarter, setting a new benchmark for our e-commerce practice.' },
      { year: '2022', title: 'Three.js & immersive web', desc: 'We invest deeply in WebGL and immersive interfaces. FlowMetrics launches with a fully 3D data dashboard — a project featured in three design publications.' },
      { year: '2024', title: '48 projects shipped', desc: 'We reach 48 shipped projects, zero compromised deadlines, and a client satisfaction rate we are quietly proud of. Every one of those clients has our direct number.' }
    ],
    philosophy: {
      quote: "The web is the most intimate canvas ever invented. It can see you, respond to you, change for you. We think that demands more than most studios are willing to give.",
      attr: "Aryan & Rahul — Rivuletduo"
    },
    stack: [
      { cat: 'Design', items: ['Figma', 'Framer', 'Adobe Illustrator', 'Lottie / Rive', 'Spline'] },
      { cat: 'Frontend', items: ['React / Next.js', 'Three.js / GSAP', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { cat: 'Backend', items: ['Node.js / Express', 'PostgreSQL', 'GraphQL', 'Prisma ORM', 'Supabase'] },
      { cat: 'CMS & Infra', items: ['Sanity.io', 'Contentful', 'Vercel / Netlify', 'Shopify / WooCommerce', 'AWS S3 / CloudFront'] }
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
      timeline: Array.isArray(data.timeline) && data.timeline.length > 0 ? data.timeline : fallback.timeline,
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
