// This is the root layout for the Next.js App Router application.
// The design goal is to create a clean, minimalist, and premium Apple-esque user interface.
// Use beautiful, professional typography and high-quality icons and images.
// The entire application must be fully mobile-responsive.

// Implement a dark/light mode toggle. The theme preference should be stored
// and managed here, affecting the entire application.

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/*
          Copilot, please generate the main layout structure for this application.
          It should include a header with a site title and the dark/light mode toggle.
          The design should be very clean and use Tailwind CSS for all styling.
          The `children` prop should be rendered within a main content container.
        */}
        {children}
      </body>
    </html>
  );
}
