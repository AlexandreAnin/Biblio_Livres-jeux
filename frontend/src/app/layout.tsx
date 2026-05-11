import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Livres-Jeux - Aventures Interactives',
  description: 'Vivez des aventures épiques dans des univers fantastiques',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2a1810',
              color: '#f0e68c',
              border: '2px solid #8b6914',
            },
            success: {
              iconTheme: {
                primary: '#90ee90',
                secondary: '#2a1810',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff6b6b',
                secondary: '#2a1810',
              },
            },
          }}
        />
      </body>
    </html>
  );
}