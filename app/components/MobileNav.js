"use client";

import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="mobileNav">
      <button
        className="menuButton"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {open && (
        <div className="mobileMenu">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#yaksh" onClick={closeMenu}>आज का यक्ष</a>
          <a href="#journey" onClick={closeMenu}>Journey</a>
          <a href="#media" onClick={closeMenu}>Media</a>
        </div>
      )}
    </div>
  );
}