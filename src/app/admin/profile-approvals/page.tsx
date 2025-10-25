"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/createclient";
import { motion } from "framer-motion";

export default function ProfileApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("approval_status", "pending");
      if (error) {
        console.error("❌ Error fetching pending users:", error);
      } else {
        setPendingUsers(data || []);
      }
      setLoading(false);
    };

    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError);
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({
        full_name: user.pending_full_name,
        username: user.pending_username,
        phone_number: user.pending_phone,
        profile_image: user.pending_profile_image,
        approval_status: "approved",
        pending_full_name: null,
        pending_username: null,
        pending_phone: null,
        pending_profile_image: null,
      })
      .eq("id", id);

    if (error) {
      console.error("Error approving user:", error);
      return;
    }

    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    alert("✅ User profile approved successfully!");
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("users")
      .update({
        approval_status: "rejected",
        pending_full_name: null,
        pending_username: null,
        pending_phone: null,
        pending_profile_image: null,
      })
      .eq("id", id);

    if (error) {
      console.error("Error rejecting user:", error);
      return;
    }

    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    alert("❌ User profile rejected.");
  };

  return (
    <main className="min-h-screen p-10 bg-gray-50 dark:bg-[#0A0018] text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">🧾 Profile Approval Requests</h1>

      {loading ? (
        <p>Loading pending users...</p>
      ) : pendingUsers.length === 0 ? (
        <p>No pending profile updates.</p>
      ) : (
        <div className="grid gap-6">
          {pendingUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl border shadow-lg bg-white dark:bg-[#13002A]/60"
            >
              <p><b>Email:</b> {user.email}</p>
              <p><b>Full Name:</b> {user.pending_full_name || "—"}</p>
              <p><b>Username:</b> {user.pending_username || "—"}</p>
              <p><b>Phone:</b> {user.pending_phone || "—"}</p>
              {user.pending_profile_image && (
                <img
                  src={user.pending_profile_image}
                  alt="Pending profile"
                  className="w-24 h-24 rounded-full mt-3 object-cover border"
                />
              )}

              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => handleApprove(user.id)}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user.id)}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
