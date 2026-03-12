import "./globals.css";
import { Inter } from "next/font/google";
import AppShell from "../components/AppShell";
import Toast from "../components/Toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Employee Management System",
  description: "Manage your employees efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Toast />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
