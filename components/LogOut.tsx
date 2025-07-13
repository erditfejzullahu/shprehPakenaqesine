"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import { MdLogout } from 'react-icons/md'

const LogOut = () => {
  return (
    <MdLogout onClick={() => signOut()} size={24} color="#fb2c36" className="cursor-pointer"/>
  )
}

export default LogOut