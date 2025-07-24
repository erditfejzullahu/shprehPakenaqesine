import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import SessionContext from "@/providers/SessionContext";
import { auth } from "../auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="sq-AL">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <SessionContext session={session}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </SessionContext>
      </body>
    </html>
  );
}
