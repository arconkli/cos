// app/layout.tsx
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css'; // Ensure this path is correct

// Configure the Inter font.  This is where you customize it.
const inter = Inter({
  subsets: ['latin'],  // MUST have at least one subset
  // weight: ['400', '700'], // Optional: If you need specific weights
  // style: ['normal', 'italic'], // Optional: If you need italic
  variable: '--font-inter', // Optional: Define a CSS variable
  display: 'swap', // Recommended: Controls how the font is displayed during loading
});

export const metadata: Metadata = {
  title: 'Create OS', 
  description: 'Monitize Your Creativity', 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font to the <body> using the generated CSS variable */}
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}