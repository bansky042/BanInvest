import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// 🔐 Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("❌ Missing Supabase URL or Service Role Key in environment variables.");
}

// 🧠 Create Supabase client using the service role key (server-side only)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@yourdomain.com";
  const password = process.env.ADMIN_PASSWORD || "StrongPassword123!";
  const username = process.env.ADMIN_NAME || "Site Admin";

  console.log(`🧩 Checking for existing admin account...`);

  // 1️⃣ Check if an admin user already exists
  const { data: existingAdmin, error: checkError } = await supabase
    .from("users")
    .select("*")
    .eq("role", "admin")
    .maybeSingle();

  if (checkError) {
    console.error("❌ Error checking for existing admin:", checkError.message);
    return;
  }

  if (existingAdmin) {
    console.log(`⚠️ Admin already exists: ${existingAdmin.email}`);
    return;
  }

  console.log(`🪄 Creating admin user: ${email}`);

  // 2️⃣ Create the admin in Supabase Auth
  const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, role: "admin" },
  });

  if (createError) {
    console.error("❌ Error creating admin user:", createError.message);
    return;
  }

  const userId = authUser.user?.id;

  // 3️⃣ Insert matching profile in your "users" table
  const { error: profileError } = await supabase.from("users").insert({
    id: userId,
    email,
    username,
    role: "admin",
    created_at: new Date(),
  });

  if (profileError) {
    console.error("❌ Error inserting admin into 'users' table:", profileError.message);
    return;
  }

  console.log("✅ Admin user seeded successfully!");
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
}

seedAdmin();
