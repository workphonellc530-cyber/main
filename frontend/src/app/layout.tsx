import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AgentForge AI - Enterprise AI Agent Platform',
  description: 'Deploy intelligent AI agents in minutes. Customer support, lead generation, content creation, and data analysis - all powered by cutting-edge AI.',
  keywords: 'AI agents, customer support bot, lead generation, AI platform, SaaS, automation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
