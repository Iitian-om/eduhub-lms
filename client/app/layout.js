// Import necessary modules and components
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/UserContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduHub LMS - A Modern Learning Platform",
  description: "Learn, grow, and achieve your goals with EduHub.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <UserProvider>
          <Toaster position="bottom-right" />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
