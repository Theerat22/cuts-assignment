import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
});

export const metadata: Metadata = {
  title: "Speaker Management | ระบบจัดการวิทยากร",
  description: "ระบบจัดการวิทยากรสำหรับทีมฝ่าย Activity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} font-[family-name:var(--font-noto-sans-thai)] antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-noto-sans-thai), sans-serif",
              borderRadius: "12px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
