import { createContext, useContext, useEffect, useState } from "react"; import { supabase } from "./supabase";
const Ctx = createContext(null); export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [roles, setRoles] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    if (!userId) return;
    const { data: rolesData } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    setRoles((rolesData || []).map(r => r.role));

    const { data: profData } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (profData) setProfile(profData);
  };

  useEffect(() => {
    if (!session?.user) {
      setRoles([]);
      setProfile(null);
      return;
    }
    fetchProfile(session.user.id);
  }, [session]);

  const updateProfile = async (updates) => {
    if (!session?.user) return { error: "Not logged in" };
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.user.id)
      .select()
      .single();
    if (!error && data) setProfile(data);
    return { data, error };
  };

  return (
    <Ctx.Provider
      value={{
        session,
        user: session?.user,
        profile,
        roles,
        updateProfile,
        refreshProfile: () => session?.user && fetchProfile(session.user.id),
        signOut: () => supabase.auth.signOut()
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
