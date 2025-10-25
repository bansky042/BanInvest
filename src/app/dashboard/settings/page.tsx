"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/createclient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
     const [saving, setSaving] = useState(false); // add this new state at top
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
    password: "",
  });

  // 🧩 Fetch current user + profile info
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/auth/signin");
        return;
      }

      setUser(user);

      const { data: profile, error } = await supabase
        .from("users")
        .select("full_name, username, phone, profile_image")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      } else {
        setFormData({
          full_name: profile?.full_name || "",
          username: profile?.username || "",
          phone: profile?.phone || "",
          password: "",
        });
        setProfileImage(profile?.profile_image || null);
      }
    };

    fetchUserProfile();
  }, [router]);

  // 🧠 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🖼️ Handle Profile Image Upload (same logic as Dashboard)
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from("profile_images")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      // Update user profile with new image URL
      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image: imageUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfileImage(imageUrl);
      toast.success("Profile image updated!");
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };



  // 💾 Handle profile update
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (saving) return; // prevent double submit
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          username: formData.username,
          phone: formData.phone,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Update password (optional)
      if (formData.password) {
        const { error: passError } = await supabase.auth.updateUser({
          password: formData.password,
        });
        if (passError) throw passError;
      }

      toast.success("Profile updated successfully!");

      // Clear password field
      setFormData((prev) => ({ ...prev, password: "" }));

      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };


  
useEffect(() => {
  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/signin");
    }
  };

  checkUser();
}, [router]);


  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${
        isDark ? "bg-[#0A0018] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-xl mx-auto rounded-2xl p-8 border shadow-lg ${
            isDark
              ? "bg-[#13002A]/70 border-purple-900"
              : "bg-white border-gray-200"
          }`}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-10 text-center"
          >
            ⚙️ Account Settings
          </motion.h1>

          {/* ✅ Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-teal-400">
              <Image
                src={profileImage || "/default-avatar.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <label className="mt-3 text-sm cursor-pointer bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600 transition">
              {uploading ? "Uploading..." : "Change Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {/* 🧾 Settings Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full p-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900 focus:border-teal-400"
                    : "bg-gray-50 border-gray-300 focus:border-teal-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className={`w-full p-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900 focus:border-teal-400"
                    : "bg-gray-50 border-gray-300 focus:border-teal-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 8012345678"
                className={`w-full p-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900 focus:border-teal-400"
                    : "bg-gray-50 border-gray-300 focus:border-teal-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full p-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900 focus:border-teal-400"
                    : "bg-gray-50 border-gray-300 focus:border-teal-500"
                }`}
              />
              <p className="text-xs text-gray-400 mt-1">
                Leave blank if you don’t want to change your password.
              </p>
            </div>

            <button
  type="submit"
  disabled={saving}
  className={`w-full py-3 rounded-lg text-white font-semibold transition ${
    saving
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-purple-600 to-teal-500 hover:opacity-90"
  }`}
>
  {saving ? "Saving..." : "Save Changes"}
</button>

          </form>
        </motion.div>
      </main>
    </div>
  );
}
