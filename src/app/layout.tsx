// import type { Metadata } from "next";
import { Inter, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"] });

// export const metadata: Metadata = {
//   title: "Farmix",
//   description: "",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${roboto.className}`}>
        <NextUIProvider>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </NextUIProvider>
      </body>
    </html>
  );
}
