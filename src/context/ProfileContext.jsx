import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase-client";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // No profile yet → create one
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({ id: userId })
        .select()
        .single();
      setProfile(newProfile);
    } else if (!error) {
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) fetchProfile(session.user.id);

      // Listen for auth changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) fetchProfile(session.user.id);
          else setProfile(null);
        }
      );

      return () => listener.subscription.unsubscribe();
    };
    init();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
