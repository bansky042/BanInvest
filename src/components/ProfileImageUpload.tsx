"use client";

import { useState } from "react";
import { supabase } from "@/lib/createclient";
import Image from "next/image";
import { toast } from "sonner";

interface ProfileImageUploadProps {
  userId: string;
  currentImage?: string | null;
  onUploadComplete?: (url: string) => void;
}

export default function ProfileImageUpload({
  userId,
  currentImage,
  onUploadComplete,
}: ProfileImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // ✅ Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      // ✅ Get public URL
      const { data } = supabase.storage
        .from("profile_images")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // ✅ Update user's profile image in DB
      const { error: dbError } = await supabase
        .from("users")
        .update({ profile_image: publicUrl })
        .eq("id", userId);

      if (dbError) throw new Error(dbError.message);

      setImageUrl(publicUrl);
      onUploadComplete?.(publicUrl);
      toast.success("✅ Profile image updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("❌ Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-teal-400">
        <Image
          src={imageUrl || "/default-avatar.png"}
          alt="Profile"
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <label className="text-xs text-teal-400 cursor-pointer hover:underline">
        {uploading ? "Uploading..." : "Change"}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
