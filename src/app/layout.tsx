import type { Metadata } from "next";
import { Merriweather, Lora } from "next/font/google"; // Using classic fonts
import "./globals.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: "300"
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medicine AI Assistant", // Updated title for clarity
  description: "A Generative AI for Medicine Information", // Corrected description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${lora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
