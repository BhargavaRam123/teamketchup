import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId="801064546104-59ceuepf5flhunktpf3f5876og9jlqrg.apps.googleusercontent.com">
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </GoogleOAuthProvider>
  );
}