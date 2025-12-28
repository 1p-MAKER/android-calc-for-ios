import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-rounded",
});

export const metadata: Metadata = {
  title: "Calculator",
  description: "iOS Style Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mPlusRounded.className} antialiased`}
        style={{ fontFamily: mPlusRounded.style.fontFamily }}
      >
        {children}
      </body>
    </html>
  );
}
