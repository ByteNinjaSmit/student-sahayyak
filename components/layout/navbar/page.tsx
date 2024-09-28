"use client"; // Ensure this is present for client-side rendering
import React, { useState } from "react";
import { usePathname } from "next/navigation"; // Correct hook for the App Router
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
  const currentPath = usePathname(); // Correct hook to get the current path

  const menuItems = [
    { name: "Profile", href: "/profile" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Settings", href: "/settings" },
    { name: "Help & Feedback", href: "/help" },
    { name: "Log Out", href: "/logout" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">Hostellers</p>
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
