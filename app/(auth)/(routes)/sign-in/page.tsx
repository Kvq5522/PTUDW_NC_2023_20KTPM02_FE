"use client";

import { SignInForm } from "@/components/Form/AuthForm/SignInForm";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
  const params = useSearchParams();

  useEffect(() => {
    if (!params.get("token") || params.get("token") === "") {
      localStorage.removeItem("access-token");
      return;
    };

    localStorage.setItem("access-token", params.get("token") ?? "");
    window.location.href = "/dashboard";
  }, [params]);

  return (
    <div className="flex justify-center items-center bg-gradient-to-r min-h-screen w-screen from-yellow-500 to-green-300">
      <div className="bg-white p-3 rounded max-[1000px]:w-[90vw] max-[1200px]:w-[70vw] w-[60vw] max-[400px]:h-[90vh] max-[1000px]:h-[80vh] h-[60vh]">
        <SignInForm className="h-full flex justify-center items-center" />
      </div>
    </div>
  );
}
