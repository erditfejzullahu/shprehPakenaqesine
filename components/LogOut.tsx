"use client";

import api from "@/lib/api";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";
import { toast } from "sonner";

export default function LogOut() {
  const handleSignOut = async () => {
    try {
      const response = await api.post('/api/auth/logout')
      if(response.data.success){
        toast.success('Sapo jeni shkycur me sukses!')
      }
    } catch (error) {
      console.error(error);
      toast.error("Dicka shkoi gabim! Ju lutem provoni perseri.")
    }
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
