import type { Metadata } from "next";
import { Archivo_Black, DM_Serif_Display, Space_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/components/cart-context";
import Nav from "@/components/Nav";
import CartDrawer from "@/components/CartDrawer";
import Grain from "@/components/Grain";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";
import "lenis/dist/lenis.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STARVLT — ST8R",
  description: "ST8R streetwear. Order yours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`lenis ${archivoBlack.variable} ${dmSerif.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SmoothScroll>
            <Nav />
            <main>{children}</main>
            <CartDrawer />
          </SmoothScroll>
          <Grain />
          <CustomCursor />
        </CartProvider>
      </body>
    </html>
  );
}
