"use client";

import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function LogOut() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      aria-label="Log out"
      className="cursor-pointer"
    >
      <MdLogout size={24} color="#fb2c36" />
    </button>
  );
}
