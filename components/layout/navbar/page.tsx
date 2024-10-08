"use client";
import React, { useState,useEffect } from "react";
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
import { useSession } from "@/app/store/session";

export default function MainNavabar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData,logout, isLoggedIn } = useSession();
  const currentPath = usePathname();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // This effect runs when `isLoggedIn` changes
    if (isLoggedIn) {
      // Call an API or take any action to refresh user data
      setUserId(userData?._id);
      console.log('User is logged in, refreshing user data...');
      // You can implement logic to refresh user here, e.g.:
      // fetchUserData();
    }
  }, [isLoggedIn,userData])


  const menuItems = [
    { name: "Home", href: "/" },
    ...(isLoggedIn
      ? [
          { name: "Profile", href: `/${userId}/edit-profile` },
          { name: "Dashboard", href: `/client/${userId}/dashboard` },
          { name: "Help & Feedback", href: "/contact" },
          { name: "FAQ", href: "/faq" },
          { name: "Log Out", onClick: logout },
        ]
      : []),
    !isLoggedIn && { name: "Help & Feedback", href: "/contact" },
    !isLoggedIn && { name: "FAQ", href: "/faq" },
    !isLoggedIn && { name: "Rules", href: "/rule-regulations" },
    ...(isLoggedIn ? [] : [{ name: "Log In", href: "/login" }]), // For when not logged in
  ].filter(Boolean); // filter to remove falsey values

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" color="foreground">
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
          {isLoggedIn && (
            <Link
              href={`/client/${userId}/dashboard`} // Correctly formatted user dashboard URL
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
              currentPath === "/rule-regulations"
                ? "font-bold text-blue-500"
                : ""
            }`}
          >
            Rules
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {isLoggedIn ? (
            <Button as={Link} color="danger" onClick={logout} variant="flat">
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
