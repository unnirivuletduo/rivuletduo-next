import type { Metadata } from 'next';
import FontSwitcher from '@/components/FontSwitcher';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rivuletduo — Web Dev Studio',
  description: 'From pixel-perfect interfaces to scalable full-stack systems — we craft web products that feel as good as they perform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <FontSwitcher />
      </body>
    </html>
  );
}
