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

## Key Decisions

- **All interactive components** use `'use client'` — Three.js and browser APIs can't run on the server.
- **Three.js** is dynamically imported inside `useEffect` (`await import('three')`) so it's never bundled into the server-side render, avoiding SSR errors.
- **Global particle `burst()` function** is attached to `window` from `GlobalParticles.tsx` and called by `Process.tsx` — same pattern as the original HTML.
- **CSS** is a faithful 1:1 port of the original `<style>` block into `globals.css`; no Tailwind is used so all visual fidelity is preserved exactly.
- **Testimonials** are fully React state-driven; no DOM manipulation needed.
- **SVG draw animations** on the service cards and work cards are triggered by `IntersectionObserver` inside `useEffect`, matching the original behaviour.
# rivuletduo-next
