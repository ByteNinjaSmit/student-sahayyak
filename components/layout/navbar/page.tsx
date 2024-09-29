"use client"; 
import React, { useState } from "react";
import { usePathname } from "next/navigation"; 
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { useAuth } from "@/app/store/auth";

export default function MainNavabar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userId, isLoggedIn } = useAuth();
  const currentPath = usePathname(); 

  const menuItems = [
    { name: "Home", href: "/" },
    ...(isLoggedIn
      ? [
          { name: "Profile", href: `/${userId}/profile` },
          { name: "Dashboard", href: `/${userId}/dashboard` },
          { name: "Help & Feedback", href: "/contact" }, 
          { name: "FAQ", href: "/faq" }, 
          { name: "Log Out", href: "/logout" },
        ]
      : []),
    !isLoggedIn && { name: "Help & Feedback", href: "/contact" },
    !isLoggedIn && { name: "FAQ", href: "/faq" },
    !isLoggedIn && { name: "Rules", href: "/rule-regulations" },
    ...(isLoggedIn ? [] : [{ name: "Log In", href: "/login" }]),  // For when not logged in
  ].filter(Boolean); // filter to remove falsey values
  


  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" color="foreground" >
          <AcmeLogo />
          <p className="font-bold text-inherit">Hostellers</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            href="/"
            aria-current="page"
            color="foreground"
            className={`${
              currentPath === "/" ? "font-bold text-blue-500" : ""
            }`}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          {isLoggedIn  && userId && (
            <Link
              href={`/${userId}/dashboard`} // Correctly formatted user dashboard URL
              color="foreground"
              className={`${
                currentPath === `/${userId}/dashboard`
                  ? "font-bold text-blue-500"
                  : ""
              }`}
            >
              Dashboard
            </Link>
          )}
        </NavbarItem>

        <NavbarItem>
          <Link
            href="/contact"
            color="foreground"
            className={`${
              currentPath === "/contact" ? "font-bold text-blue-500" : ""
            }`}
          >
            Help
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/rule-regulations"
            color="foreground"
            className={`${
              currentPath === "/rule-regulations" ? "font-bold text-blue-500" : ""
            }`}
          >
            Rules
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {isLoggedIn ? (
            <Button as={Link} color="danger" href="/logout" variant="flat">
              Logout
            </Button>
          ) : (
            <Button as={Link} color="primary" href="/login" variant="flat">
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              href={item.href}
              className={`w-full ${
                currentPath === item.href ? "font-bold text-blue-500" : ""
              }`}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
