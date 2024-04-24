"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import defaultProfileImage from "../user/profile/assets/teddyProfile.jpg";

function Navbar() {
  const { setTheme } = useTheme();
  const { data: session } = useSession();
  const user = useSelector((state: RootState) => state.user.user);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.profilePictureUrl || "");

  useEffect(() => {
    if (user?.profilePictureUrl) {
      setImageUrl(user.profilePictureUrl);
    } else {
      setImageUrl(defaultProfileImage);
      setImageLoaded(true);
    }
  }, [user]);

  function handleLogout() {
    signOut({ callbackUrl: process.env.NEXTAUTH_URL });
  }

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
            {session && (
              <Link className="hover:underline" href="/app">
                Dashboard
              </Link>
            )}
            {!session && (
              <>
                <Link className="hover:underline" href="/auth/signIn">
                  Sign In
                </Link>
                <Link className="hover:underline" href="/auth/signUp">
                  Sign Up
                </Link>
              </>
            )}
            {session && (
              <>
                <Link
                  href="#"
                  onClick={handleLogout}
                  className="text-white hover:underline"
                >
                  Logout
                </Link>
                <Link href="/user/profile">
                  {!imageLoaded && (
                    <div className="w-8 h-8 rounded-full bg-primary-foreground"></div>
                  )}
                  <Image
                    className={`w-8 h-8 rounded-full ${
                      imageLoaded ? "" : "hidden"
                    }`}
                    src={imageUrl}
                    alt="Profile Picture"
                    width={32}
                    height={32}
                    onLoad={() => setImageLoaded(true)}
                  />
                </Link>
              </>
            )}
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
