import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Eye, EyeOff, Shield, AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkAdminCredentials, setAuthToken, setUser, setAdminSession } from "@/lib/auth";

const DB_ADMIN_EMAIL = "admin@bodypowergym.com";
const DB_ADMIN_PASSWORD = "admin@bodypower123";
const ADMIN_DISPLAY_EMAIL = "adminA2@bodygym.com";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkAdminCredentials(email.trim(), password)) {
      setError("Access Denied. Invalid Admin Credentials.");
      return;
    }

    setLoading(true);
    try {
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      const res = await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: DB_ADMIN_EMAIL, password: DB_ADMIN_PASSWORD }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setAuthToken(data.token);
      setUser({ ...data.user, email: ADMIN_DISPLAY_EMAIL });
      setAdminSession();
      setLocation("/admin/dashboard");
    } catch {
      setError("Access Denied. Invalid Admin Credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-secondary/20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Shield size={36} className="text-primary" />
          </motion.div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell size={22} className="text-primary" />
            <span className="font-display font-bold text-xl uppercase tracking-wider">
              Body<span className="text-primary">power</span>
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-tight mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-sm">
            <Lock size={12} className="inline mr-1" />
            Restricted area — authorized personnel only
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6"
              >
                <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="Enter admin email"
                required
                autoComplete="username"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 uppercase font-bold tracking-wider text-sm mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <Lock size={16} className="mr-2" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground/60">
              This admin panel is not listed in site navigation.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
