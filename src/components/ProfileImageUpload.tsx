"use client";

import { useState } from "react";
import { supabase } from "@/lib/createclient";
import Image from "next/image";
import { toast } from "sonner";

export default function ProfileImageUpload({
  userId,
  currentImage,
  onUploadComplete,
}: {
  userId: string;
  currentImage?: string | null;
  onUploadComplete?: (url: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile_images")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      await supabase.from("users").update({ profile_image: publicUrl }).eq("id", userId);

      setImageUrl(publicUrl);
      if (onUploadComplete) onUploadComplete(publicUrl);

      toast.success("Profile image updated!");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
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
