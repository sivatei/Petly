import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { Bell, CheckCircle2, ShieldAlert, Sparkles, Clock, Check } from "lucide-react";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "welcome-1",
    title: "Welcome to Petly!",
    message: "Explore our verified vet directory, marketplace, and pet shop with trusted seller listings.",
    type: "welcome",
    read_at: null,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "vet-update",
    title: "Verified Clinics Available",
    message: "5 full-service veterinary hospitals are now active in the directory with 24/7 emergency services.",
    type: "info",
    read_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "safety-tip",
    title: "Community Trust & Safety",
    message: "Remember to verify seller reviews and always inspect secondhand equipment before checkout.",
    type: "security",
    read_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

export default function Notifications() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchNotifs = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setList(data);
      } else {
        setList(DEFAULT_NOTIFICATIONS);
      }
      setLoading(false);
    };
    fetchNotifs();
  }, [user]);

  const markAllRead = () => {
    setList(list.map(n => ({ ...n, read_at: new Date().toISOString() })));
  };

  const markOne = (id) => {
    setList(list.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  };

  if (!user) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <Bell className="mx-auto mb-3 text-blue-500" size={36} />
        <h1 className="text-2xl font-bold">Your Notifications</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in to check updates, messages, and order notifications.</p>
        <Link to="/login" className="btn mt-6 inline-block w-full">Sign In / Register</Link>
      </div>
    );
  }

  const unreadCount = list.filter(n => !n.read_at).length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-500">
            {unreadCount > 0 ? `You have ${unreadCount} unread update${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-leaf-700 hover:text-leaf-800 underline"
          >
            <Check size={14} /> Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading notifications…</p>
      ) : list.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Bell className="mx-auto mb-3 text-gray-300" size={42} />
          <p className="font-semibold">No notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(n => {
            const isRead = Boolean(n.read_at);
            return (
              <div
                key={n.id}
                onClick={() => !isRead && markOne(n.id)}
                className={`card flex items-start gap-3.5 p-4 transition ${
                  isRead ? "bg-white opacity-80" : "bg-leaf-50/50 border-l-4 border-leaf-600 shadow-sm"
                }`}
              >
                <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                  n.type === "welcome" ? "bg-green-100 text-green-700" :
                  n.type === "security" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {n.type === "welcome" ? <Sparkles size={18} /> :
                   n.type === "security" ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className={`text-sm ${isRead ? "font-semibold text-gray-800" : "font-bold text-gray-900"}`}>
                      {n.title}
                    </h2>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock size={12} />
                      {new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{n.message}</p>
                </div>

                {!isRead && (
                  <span className="h-2 w-2 rounded-full bg-leaf-600 flex-shrink-0 mt-2" title="Unread" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
