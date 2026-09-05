import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/src/components/layout/site-header';
import { SiteFooter } from '@/src/components/layout/site-footer';
import { Geist } from "next/font/google";
import { cn } from "@/src/lib/utils";
import { AppSessionProvider } from '../components/providers/app-session-provider';
import { Toaster } from '../components/ui/toast';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Sky Blip Academy - Modern Tech Programs with AI',
  description:
    'Master fullstack web development, cybersecurity, and AI integration with 100% placement support at Sky Blip Academy.',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col">
        <AppSessionProvider>
           <main className="flex-1">{children}</main>
           <Toaster/>
        </AppSessionProvider>
      </body>
    </html>
  );
}