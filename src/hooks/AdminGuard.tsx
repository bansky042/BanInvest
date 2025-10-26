import { useEffect, useState, type JSX } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/createclient";
import type { User } from "@supabase/supabase-js";

export default function AdminGuard({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true; // ✅ Prevent state updates after unmount

    async function verifyAdmin() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error.message);
          if (isMounted) router.push("/admin/login");
          return;
        }

        const user: User | null = data?.user ?? null;
        const isAdmin = user?.user_metadata?.is_admin === true;

        if (!user || !isAdmin) {
          if (isMounted) router.push("/admin/login");
          return;
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        if (isMounted) router.push("/admin/login");
      } finally {
        if (isMounted) setChecking(false);
      }
    }

    verifyAdmin();

    // ✅ Cleanup
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (checking) {
    return <div className="text-center p-10">Checking admin...</div>;
  }

  return children;
}
