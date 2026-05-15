import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Технические средства охраны — ООО ЧОП "Сигма-Профи"',
  description: "Проектирование, монтаж и обслуживание ТСО: систем видеонаблюдения, СКУД, охранной и пожарной сигнализации.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        {/* Inter — better Windows hinting for body text */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
        {/* Original site styles — loaded as static assets */}
        <link rel="stylesheet" href="/css/styles.min.css" />
        <link rel="stylesheet" href="/css/custom.css" />
        <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}
