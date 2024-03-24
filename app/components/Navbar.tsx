"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  const { setTheme } = useTheme();

  return (
    <>
      <div className="bg-primary text-white py-2">
        <div className="flex flex-col sm:flex-row justify-between items-center px-3">
          <div>
            <Link href="/">
              <Image src="/logo.svg" alt="Teddy Travel" width={36} height={0} />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link className="hover:underline" href="/about">
              About
            </Link>
            <Link className="hover:underline" href="/app">
              Dashboard
            </Link>
            <Link className="hover:underline" href="/auth/signIn">
              Sign In
            </Link>
            <Link className="hover:underline" href="/auth/signUp">
              Sign Up
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground"
                  variant="outline"
                  size="icon"
                >
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
