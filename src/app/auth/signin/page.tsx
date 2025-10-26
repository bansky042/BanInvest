"use client";

import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

function SigninPageContent() {
  return <AuthForm type="signin" />;
}

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading sign-in...</div>}>
      <SigninPageContent />
    </Suspense>
  );
}
