import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Dumbbell, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, clearAuthToken, clearUser, clearAdminSession, getAdminSession } from "@/lib/auth";
import { useLogout } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = getUser();
  const isAdmin = getAdminSession() && user?.role === "admin";
  const logoutMutation = useLogout();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        clearAuthToken();
        clearUser();
        clearAdminSession();
        setLocation("/login");
      },
    });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Membership", href: "/membership" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity z-50">
          <Dumbbell size={28} strokeWidth={2.5} className="text-primary" />
          <span className="font-display font-bold text-xl text-foreground uppercase tracking-wider">
            Body<span className="text-primary">power</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <User size={16} />
                <span className="max-w-[120px] truncate">{isAdmin ? "Admin Panel" : user.name}</span>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut size={14} /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden lg:block">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-bold uppercase tracking-wide text-xs">Join Now</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground z-50 relative p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-6 flex flex-col gap-6 md:hidden"
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      location === link.href ? "text-primary" : "text-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="h-px w-full bg-border" />
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <button
                      className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted/30 transition-colors w-full"
                      onClick={() => { setMobileMenuOpen(false); setLocation(isAdmin ? "/admin/dashboard" : "/dashboard"); }}
                    >
                      <User size={16} className="text-primary" />
                      {isAdmin ? "Admin Panel" : user.name}
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm font-bold uppercase tracking-wide hover:bg-destructive/20 transition-colors w-full border border-destructive/20"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-4 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted/30 transition-colors w-full"
                      onClick={() => { setMobileMenuOpen(false); setLocation("/login"); }}
                    >
                      Log in
                    </button>
                    <button
                      className="px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors w-full"
                      onClick={() => { setMobileMenuOpen(false); setLocation("/register"); }}
                    >
                      Join Now
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
