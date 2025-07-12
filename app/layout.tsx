import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";

export const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});


export const metadata: Metadata = {
  title: "Raporto Punedhënësin",
  description: "Një platformë anonime dhe e sigurt për të raportuar padrejtësitë dhe shkeljet nga punëdhënësit, duke mbrojtur të drejtat e punonjësve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <QueryProvider>
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
