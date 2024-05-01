import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import StoreProvider from "@/lib/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <Header />

        <StoreProvider>
          <div className="min-h-screen flex  justify-center">{children}</div>
        </StoreProvider>

        <Footer />
      </body>
    </html>
  );
}
