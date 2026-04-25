import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/lib/query-provider';
import StyledComponentsRegistry from '@/lib/registry';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Digital Vault',
  description: 'High-Integrity Digital Wallet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <Providers>
            {children}
            <Toaster position="top-right" richColors theme="dark" />
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
