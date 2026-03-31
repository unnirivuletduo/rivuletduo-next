import type { Metadata } from 'next';
import './about.css';
import AboutPage from '@/components/AboutPage';

export const metadata: Metadata = {
  title: 'About — Rivuletduo',
  description: 'Learn about Rivuletduo, our story, principles, and the team behind our web experiences.',
};

export default function AboutRoute() {
  return <AboutPage />;
}
