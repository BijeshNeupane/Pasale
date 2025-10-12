import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import ProgressBar from "@/components/ProgressBar";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "GoCart. - Shop smarter",
  description: "GoCart. - Shop smarter",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased`}>
          <StoreProvider>
            <ProgressBar />
            <Toaster />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
