"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import EmpthyState from "@/components/EmpthyState";

const Users = () => {
  return (
   <div className="hidden lg:block lg:pl-80 h-full">
      <EmpthyState />
   </div>
  )
}

export default Users;