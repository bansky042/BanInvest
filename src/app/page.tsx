"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/createclient";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Plans from "@/components/Plans";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CryptoMarketTable from "@/components/CryptoChart";
import Loader from "@/components/Loader";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 🧩 Get Supabase user session
  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    }

    getSession();

    // 🔁 Listen for auth state changes (sign in/out)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <Loader />;

  return (
    <main className="bg-gradient-to-b from-[#0a0118] to-[#03000b] text-white font-sans overflow-x-hidden">
      <section className="pt-16">
        <Hero user={user} />
        <CryptoMarketTable />
      </section>
      <Features />
      <Plans user={user} />
      <Testimonials />
      <FAQ />
    </main>
  );
}
