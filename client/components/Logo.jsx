import React from "react";
import Image from "next/image";
import FordhamLogo from "@/public/assets/FordhamLogo.svg";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      {/* <Image
        src={FordhamLogo}
        alt="Fordham Logo"
        width={200} // Adjust this value as needed
        height={100} // Adjust this value as needed
      /> */}
      <h3 className="h4 text-primary">RAMResume</h3>
    </Link>
  );
}
