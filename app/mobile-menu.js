"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";

export default function MobileMenu({ navigation }) {
  const menu = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);

  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }

  return <details className="mobile-menu d-xl-none" ref={menu}>
    <summary aria-label="Open navigation"><Menu size={21} /><span>Menu</span></summary>
    <nav className="mobile-menu-panel shadow" aria-label="Mobile navigation">
      {navigation.map(({ href, label }) => <Link href={href} key={href} onClick={closeMenu}>{label}<ArrowUpRight size={15} /></Link>)}
      <Link className="mobile-menu-cta" href="/contact" onClick={closeMenu}>Plan a journey <ArrowUpRight size={15} /></Link>
    </nav>
  </details>;
}
