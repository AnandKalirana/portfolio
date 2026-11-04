import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anand Kalirana — IoT Engineer & Full-Stack Developer",
  description:
    "Engineering student passionate about IoT, full-stack development, and cybersecurity. Building secure connected systems at the intersection of hardware, software, and security.",
  keywords: [
    "Anand Kalirana",
    "IoT Engineer",
    "Full-Stack Developer",
    "Cybersecurity",
    "Next.js",
    "React",
    "Node.js",
    "Portfolio",
  ],
  authors: [{ name: "Anand Kalirana" }],
  creator: "Anand Kalirana",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anandkalirana.dev",
    siteName: "Anand Kalirana",
    title: "Anand Kalirana — IoT Engineer & Full-Stack Developer",
    description:
      "Engineering student passionate about IoT, full-stack development, and cybersecurity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anand Kalirana — IoT Engineer & Full-Stack Developer",
    description:
      "Engineering student passionate about IoT, full-stack development, and cybersecurity.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
