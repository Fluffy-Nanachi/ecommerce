// AdminRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import supabase from "../supabase-client";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsAdmin(false);
      } else {
        const role =
          session.user.user_metadata?.role ||
          session.user.raw_user_meta_data?.role;

        setIsAdmin(role === "admin");
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
