import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Link from 'next/link'

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Menu, Sparkle, AtSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";

// Configure Inter font
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "UniDash — PYQ Analyzer",
  description: "Analyze & Predict Questions for Your Exams",
};

function DesktopMenu() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="flex space-x-4 items-center">
        <NavigationMenuItem>
          <Link href="/" className="hover:text-[#fc4707] transition-colors p-2">
            <AtSign className="h-6 w-6" />
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="border-purple-200 bg-purple-50 hover:bg-purple-100 hover:text-purple-900 text-purple-700 text-xs px-4 py-1 rounded-full"
          >
            <NavigationMenuLink className="inline-flex items-center" href="https://unidash.mohammedhusamuddin.me/">
              Go Back to UniDash
              <Sparkle className="ml-1 h-3 w-3" />
            </NavigationMenuLink>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <AnimatedShinyText className="text-sm font-medium text-gray-500 whitespace-nowrap flex items-center gap-1">
            ✨This is still being developed
          </AnimatedShinyText>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="md:hidden p-2">
        <Menu className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl">
        <DropdownMenuItem>
          <a href="/" className="w-full inline-flex items-center">
            Home
          </a>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <Button
            asChild 
            variant="outline" 
            className="w-full justify-start rounded-full border-purple-200 bg-purple-50 hover:bg-purple-100 hover:text-purple-900 text-purple-700 my-1"
          >
            <a href="/dashboard" className="inline-flex items-center justify-start w-full">
              Access LMS, ERP, and more
              <Sparkle className="ml-auto h-4 w-4" />
            </a>
          </Button>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body 
        className={`
          antialiased
          ${inter.className}
          selection:bg-purple-100
          selection:text-purple-900
        `}
      >
        <header className="flex justify-between items-center p-4 md:px-8 border-b border-gray-200">
          <nav className="w-full">
            <DesktopMenu />
            <MobileMenu />
          </nav>
        </header>
        <main className="max-w-full px-4 md:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
