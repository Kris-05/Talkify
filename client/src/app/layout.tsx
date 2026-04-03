import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/appContext";

export const metadata: Metadata = {
  title: "Chat App",
  description: "Chatting app made with microservices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
