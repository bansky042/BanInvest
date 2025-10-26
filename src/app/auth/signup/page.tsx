"use client";

import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

function SignupPageContent() {
  return <AuthForm type="signup" />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading signup...</div>}>
      <SignupPageContent />
    </Suspense>
  );
}
