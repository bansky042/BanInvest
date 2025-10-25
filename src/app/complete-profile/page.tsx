"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/createclient";
import { toast } from "sonner";

export default function CompleteProfile() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    country: "",
  });
  const router = useRouter();

  // ✅ Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    getUser();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return toast.error("User not found");

    try {
      // ✅ Update existing user instead of inserting a new one
      const { error } = await supabase
        .from("users")
        .update({
          username: form.username,
          phone: form.phone,
          country: form.country,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile completed successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Update error:", err.message);
      toast.error(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0018]">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1a0033] p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Complete Your Profile
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Just a few details to finish setting up your account.
        </p>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border dark:bg-transparent"
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border dark:bg-transparent"
        />
        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border dark:bg-transparent"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Save and Continue
        </button>
      </form>
    </main>
  );
}
