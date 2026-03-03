import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Portfolio</title>
        <link rel="stylesheet" href="/app/globals.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
