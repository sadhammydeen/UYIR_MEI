import { Inter } from 'next/font/google';
import './globals.css';
import { metadata, viewport } from './metadata';

// Font optimization
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Ensure text is visible during font load
  preload: true,
});

export { metadata, viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to external domains to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/images/logo.svg" as="image" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Instant loading indicator */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const html = document.documentElement;
              html.setAttribute('data-loading', 'true');
              
              window.addEventListener('load', () => {
                html.removeAttribute('data-loading');
              });
            `,
          }}
        />
      </body>
    </html>
  );
} 