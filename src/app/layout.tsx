import type { Metadata } from "next";
import { Inter, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { SimilarityProvider } from '@/contexts/similarityContext';
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Farmix",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${poppins.className} ${roboto.className}`}>
        <NextUIProvider>
          <SimilarityProvider>
            <Providers>
              {children}
            </Providers>
          </SimilarityProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
