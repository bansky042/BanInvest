import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../createclient";

export default function AdminGuard({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user || !user.user_metadata?.is_admin) {
        navigate("/admin/login");
      }

      setChecking(false);
    }
    verifyAdmin();
  }, []);

  if (checking) return <div className="text-center p-10">Checking admin...</div>;
  return children;
}
