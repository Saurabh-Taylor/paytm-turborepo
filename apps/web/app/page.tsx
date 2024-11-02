"use client";
import { useBalance } from "@repo/store";
import { Appbar } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";

export default function () {
  const balance = useBalance();
  const session = useSession();
  return (
    <>
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} />
      <div>hi there {balance}</div>
    </>
  );
}
