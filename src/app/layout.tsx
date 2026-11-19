import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yardclub — rent the gear, not the storage",
    template: "%s · Yardclub",
  },
  description:
    "Rent excavators, cinema kits, trailers, generators and more from verified owners across Dhaka and Chattogram. Pay by the day, week or month.",
  applicationName: "Yardclub",
  authors: [{ name: "Yardclub" }],
  keywords: [
    "equipment rental",
    "construction equipment",
    "camera rental",
    "Dhaka",
    "Bangladesh",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f1ed" },
    { media: "(prefers-color-scheme: dark)", color: "#060605" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-mode="light"
      suppressHydrationWarning
      className={cn(archivo.variable, martianMono.variable)}
    >
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');if(!('IntersectionObserver' in window)){document.documentElement.classList.remove('js')}",
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
