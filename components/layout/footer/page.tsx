// components/MainFooter.js
import Link from "next/link";
import React from "react";

export default function MainFooter() {
  return (
    <footer className="mt-auto w-full bg-gray-300 text-center p-5" id="Section_Footer">
      <div>
        &copy; {new Date().getFullYear()} Copyright:{" "}
        <Link href="/" passHref>
          <span style={{ color: "red", textDecoration: "none" }}>
            ByteNinjaSmits Team
          </span>
        </Link>
      </div>
    </footer>
  );
}
