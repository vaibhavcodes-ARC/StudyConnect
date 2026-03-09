"use client";

import dynamic from "next/dynamic";

// Dynamically import the actual Navbar without SSR to avoid hydration mismatches
const Navbar = dynamic(() => import("./Navbar"), { ssr: false });

export default Navbar;
