import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Dumbbell, Home, Info, Calendar, Settings, LogOut, User, Menu, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProfile, useChangePassword, useLogout } from "@workspace/api-client-react";
import { getUser, clearAuthToken, clearUser, setUser } from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
];

function SettingsContent() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const { toast } = useToast();
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [profile, setProfile] = useState({ name: user?.name || "", phone: user?.phone || "", language: user?.language || "en" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        clearAuthToken();
        clearUser();
        setLocation("/login");
      },
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      { data: profile },
      {
        onSuccess: (updatedUser) => {
          setUser(updatedUser);
          toast({ title: "Profile updated", description: "Your information has been saved." });
        },
        onError: () => toast({ title: "Error", description: "Failed to update profile", variant: "destructive" }),
      }
    );
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changePasswordMutation.mutate(
      { data: passwordForm },
      {
        onSuccess: () => {
          toast({ title: "Password changed", description: "Your password has been updated." });
          setPasswordForm({ currentPassword: "", newPassword: "" });
        },
        onError: () => toast({ title: "Error", description: "Current password is incorrect", variant: "destructive" }),
      }
    );
  };

  const menuItems = [
    { icon: <Home size={18} />, label: "Home", href: "/" },
    { icon: <Info size={18} />, label: "About", href: "/about" },
    { icon: <Calendar size={18} />, label: "Booking", href: "/booking" },
    { icon: <Settings size={18} />, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-6 border-b border-border">
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            <a className="flex items-center gap-2">
              <Dumbbell size={24} className="text-primary" strokeWidth={2.5} />
              <span className="font-display font-bold text-lg uppercase tracking-wider">Body<span className="text-primary">power</span></span>
            </a>
          </Link>
        </div>
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
              <a className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.href === "/dashboard/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                {item.icon}
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="font-display font-bold text-lg uppercase tracking-wide">Settings</h1>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Profile */}
            <div className="bg-card border border-border rounded-xl p-7">
              <h2 className="font-display font-bold uppercase tracking-wider text-sm text-muted-foreground mb-6">Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit number" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={profile.language} onValueChange={(v) => setProfile(p => ({ ...p, language: v }))}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>{languages.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="h-11 uppercase font-bold tracking-wider" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </div>

            {/* Password */}
            <div className="bg-card border border-border rounded-xl p-7">
              <h2 className="font-display font-bold uppercase tracking-wider text-sm text-muted-foreground mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input type={showCurrent ? "text" : "password"} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} required className="h-11 pr-12" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input type={showNew ? "text" : "password"} value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} className="h-11 pr-12" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" variant="outline" className="h-11 uppercase font-bold tracking-wider" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </div>

            {/* Account */}
            <div className="bg-card border border-border rounded-xl p-7">
              <h2 className="font-display font-bold uppercase tracking-wider text-sm text-muted-foreground mb-6">Account</h2>
              <p className="text-sm text-muted-foreground mb-4">Signed in as <span className="text-foreground font-medium">{user?.email}</span></p>
              <Button variant="destructive" onClick={handleLogout} className="h-11 uppercase font-bold tracking-wider gap-2">
                <LogOut size={16} /> Sign Out
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardSettings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
