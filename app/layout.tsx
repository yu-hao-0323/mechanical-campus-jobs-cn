import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mechanical-campus-jobs-cn.liuy87951.chatgpt.site'),
  title: '机遇引擎｜机械行业校园招聘',
  description: '聚合合肥、江苏、杭州和宁波当前仍可投递的机械工程类校园招聘岗位。',
  openGraph: {
    title: '机遇引擎｜机械行业校园招聘',
    description: '聚合合肥、江苏、杭州和宁波当前仍可投递的机械工程类校园招聘岗位。',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '机遇引擎｜机械行业校园招聘' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '机遇引擎｜机械行业校园招聘',
    description: '聚合合肥、江苏、杭州和宁波当前仍可投递的机械工程类校园招聘岗位。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body></html>;
}
