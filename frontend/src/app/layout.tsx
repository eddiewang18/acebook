import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Acebook',
  description: 'Next.js + Django 全棧項目',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        {/* 可以在這裡添加導航欄等全局元素 */}
        <main>{children}</main>
      </body>
    </html>
  );
}