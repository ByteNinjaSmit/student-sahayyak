// components/MainFooter.js
import Link from "next/link";
import React from "react";

export default function MainFooter() {
  const footerStyle = {
    marginTop: 'auto',
    width: '100%',
  };
  return (
    <footer className="mt-auto w-full bg-gray-300 text-center p-5"  style={footerStyle}>
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
