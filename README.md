# Rivuletduo — Next.js

A full conversion of the Rivuletduo web dev studio site from a single HTML file into a modular Next.js 14 (App Router) project with TypeScript.

## Project Structure

```
rivuletduo/
├── app/
│   ├── globals.css       # All global styles (converted from <style> block)
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Home page — composes all sections
├── components/
│   ├── Cursor.tsx        # Custom cursor + ring with lag
│   ├── Loader.tsx        # Dot-bounce loading screen
│   ├── GlobalParticles.tsx  # Fixed canvas particle burst system
│   ├── Navbar.tsx        # Fixed nav with scroll-stuck behaviour
│   ├── Banner.tsx        # Hero section with Three.js RD particle animation
│   ├── Services.tsx      # 6-card services grid with SVG draw-on animation
│   ├── Work.tsx          # 4-card portfolio grid with tilt + reveal
│   ├── Process.tsx       # 4-step process with cinematic reveal & particles
│   ├── Testimonials.tsx  # Auto-advancing slider with dots & swipe support
│   ├── Contact.tsx       # Contact form + Three.js wave canvas background
│   └── Footer.tsx        # Simple footer
├── package.json
├── tsconfig.json
├── next.config.js
└── .eslintrc.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## WordPress Backend Management

This project now supports WordPress as a content backend for:

- `/` (home banner, process, testimonials)
- `/services`
- `/services/[slug]`
- `/work`
- `/work/[slug]`

The app fetches data on the server from WordPress REST API and falls back to local hardcoded content if WordPress is not configured or unavailable.

### 1) Configure Environment

Copy `.env.example` to `.env.local` and set:

```bash
WORDPRESS_API_URL=https://your-domain.com/wp-json/wp/v2
WORDPRESS_SERVICES_TYPE=services
WORDPRESS_WORK_TYPE=work
```

### 2) Run Local WordPress + ACF in Docker

```bash
cp .env.wordpress.example .env.wordpress
npm run wp:up
```

WordPress admin will be available at:

- Site: `http://localhost:8080`
- Admin: `http://localhost:8080/wp-admin`

The bootstrap script installs and activates **Advanced Custom Fields** automatically.

Stop containers:

```bash
npm run wp:down
```

### 3) Connect Next.js to Local WordPress

In `.env.local`:

```bash
WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2
WORDPRESS_SERVICES_TYPE=services
WORDPRESS_WORK_TYPE=work
```

### 4) WordPress Content Model (Admin-Managed)

Create two REST-enabled post types (or reuse existing ones):

- `services`
- `work`
- `rivulet_home` (single post used for homepage content)

This repo includes a MU plugin at `infra/wordpress/mu-plugins/rivulet-cms.php` that:

- Registers the above post types
- Registers ACF field groups for `services`, `work`, and `rivulet_home`
- Exposes a custom endpoint: `/wp-json/rivulet/v1/home`

Each item can work with only title + excerpt, but ACF fields provide richer control:

- Shared examples: `num`, `tag`, `tags` (array), `short_description`
- Service-focused: `badge`, `title_prefix`, `title_em`, `tagline`, `category`, `category_id`, `category_num`, `category_title`, `category_desc`
- Work-focused: `year`, `services` (array), `featured`, `title_html`, `client`, `duration`, `role`, `industry`, `metrics` (array), `metric_labels` (array), `metric_changes` (array), `testimonial_quote`, `testimonial_avatar`, `testimonial_name`, `testimonial_role`
- Home-focused (`rivulet_home`): banner copy, ticker items, 4 process steps, and up to 6 testimonials

### Git Safety (No WordPress Runtime Files in Push)

- WordPress DB/app runtime are stored in Docker volumes (`wp_db_data`, `wp_app_data`)
- The repo tracks only configuration and integration code
- `.gitignore` excludes `.env.wordpress`, SQL dumps, and local export folders

## Key Decisions

- **All interactive components** use `'use client'` — Three.js and browser APIs can't run on the server.
- **Three.js** is dynamically imported inside `useEffect` (`await import('three')`) so it's never bundled into the server-side render, avoiding SSR errors.
- **Global particle `burst()` function** is attached to `window` from `GlobalParticles.tsx` and called by `Process.tsx` — same pattern as the original HTML.
- **CSS** is a faithful 1:1 port of the original `<style>` block into `globals.css`; no Tailwind is used so all visual fidelity is preserved exactly.
- **Testimonials** are fully React state-driven; no DOM manipulation needed.
- **SVG draw animations** on the service cards and work cards are triggered by `IntersectionObserver` inside `useEffect`, matching the original behaviour.
# rivuletduo-next
