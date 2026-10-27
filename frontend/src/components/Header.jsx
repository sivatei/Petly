import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  PawPrint,
  Menu,
  X,
  MessageCircle,
  Bell,
  Heart,
  User,
  LogOut,
  ChevronDown,
  ShoppingBag,
  Shield
} from "lucide-react";
import { useAuth } from "../lib/auth";

const links = [
  ["/", "Home"],
  ["/shop", "Pet Shop"],
  ["/marketplace", "Marketplace"],
  ["/vet", "Vet Centre"]
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const nav = useNavigate();

  const { user, profile, roles, signOut } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    nav("/");
  };

  const navLinks = links.map(([to, label]) => (
    <NavLink
      key={to}
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-full font-medium transition ${
          isActive
            ? "bg-leaf-100 text-leaf-700 font-bold"
            : "text-gray-700 hover:bg-leaf-50 hover:text-leaf-800"
        }`
      }
    >
      {label}
    </NavLink>
  ));

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/95 shadow-xs backdrop-blur border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-leaf-700 transition hover:opacity-90">
          <PawPrint className="text-leaf-600" /> Petly
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-1 flex-1">{navLinks}</nav>

        {/* Right Action Icons & User Account */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3 text-gray-700">
          {user ? (
            <>
              {/* Messages Link */}
              <Link
                to="/messages"
                className="relative rounded-full p-2 text-gray-600 transition hover:bg-leaf-50 hover:text-leaf-700"
                aria-label="Messages"
                title="Messages & Chat"
              >
                <MessageCircle size={20} />
              </Link>

              {/* Notifications Link */}
              <Link
                to="/notifications"
                className="relative rounded-full p-2 text-gray-600 transition hover:bg-leaf-50 hover:text-leaf-700"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-leaf-600" />
              </Link>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative rounded-full p-2 text-gray-600 transition hover:bg-leaf-50 hover:text-leaf-700"
                aria-label="Wishlist"
                title="My Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* User Account Menu (Interactive Dropdown) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-2 pr-3 text-sm font-semibold transition hover:border-leaf-300 hover:bg-leaf-50 focus:outline-none"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-leaf-600 text-xs font-bold text-white shadow-xs">
                    {userInitials}
                  </div>
                  <span className="max-w-[110px] truncate text-gray-800">{displayName}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Account Dropdown Popover */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 z-50">
                    {/* User Summary Header */}
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-bold text-gray-900">{displayName}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                      {roles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {roles.map(r => (
                            <span key={r} className="rounded-md bg-leaf-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-leaf-800">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Menu Navigation Links */}
                    <div className="py-1 text-sm text-gray-700">
                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-leaf-50 hover:text-leaf-800"
                      >
                        <User size={16} className="text-leaf-600" />
                        <span>My Account & Profile</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-leaf-50 hover:text-leaf-800"
                      >
                        <Heart size={16} className="text-red-500" />
                        <span>Saved Wishlist</span>
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-leaf-50 hover:text-leaf-800"
                      >
                        <Bell size={16} className="text-blue-500" />
                        <span>Notifications</span>
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-leaf-50 hover:text-leaf-800"
                      >
                        <MessageCircle size={16} className="text-green-600" />
                        <span>Messages</span>
                      </Link>
                    </div>

                    {/* Divider & Separate Sign Out Button */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn text-sm">
              Login / Register
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-3 md:hidden space-y-1">
          {navLinks}
          {user && (
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-leaf-50 rounded-lg"
              >
                <User size={16} /> My Account
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-leaf-50 rounded-lg"
              >
                <Heart size={16} /> Wishlist
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-leaf-50 rounded-lg"
              >
                <Bell size={16} /> Notifications
              </Link>
              <Link
                to="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-leaf-50 rounded-lg"
              >
                <MessageCircle size={16} /> Messages
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
