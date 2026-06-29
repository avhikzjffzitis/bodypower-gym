import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Dumbbell, Users, Calendar, CreditCard, TrendingUp, Trash2, LogOut,
  Shield, MessageSquare, Settings, Star, BarChart3, CheckCircle,
  XCircle, Mail, Globe, Bell, Eye, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  useGetAdminStats, useGetAdminUsers, useGetAdminBookings,
  useGetAdminPayments, useDeleteAdminUser,
} from "@workspace/api-client-react";
import { getGetAdminUsersQueryKey } from "@workspace/api-client-react";
import {
  clearAuthToken, clearUser, clearAdminSession,
  getContactMessages, getWebsiteSettings, saveWebsiteSettings,
} from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const COLORS = ["#e02020", "#2563eb", "#f59e0b", "#10b981"];
const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  success: "bg-green-500/20 text-green-400 border-green-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const MEMBERSHIP_PLANS = [
  { id: "demo", name: "Book Demo", price: 0, duration: "1 Day", active: true, color: "text-yellow-400" },
  { id: "silver", name: "Silver Membership", price: 1300, duration: "Per Month", active: true, color: "text-slate-300" },
  { id: "premium", name: "Premium Membership", price: 2000, duration: "Per Month", active: true, color: "text-primary" },
];

function AdminDashboardContent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useGetAdminStats();
  const { data: users, isLoading: usersLoading } = useGetAdminUsers();
  const { data: bookings, isLoading: bookingsLoading } = useGetAdminBookings();
  const { data: payments, isLoading: paymentsLoading } = useGetAdminPayments();
  const deleteUserMutation = useDeleteAdminUser();

  const contactMessages = getContactMessages();
  const savedSettings = getWebsiteSettings();

  const defaultSettings = {
    gymName: savedSettings.gymName || "Bodypower Gym",
    tagline: savedSettings.tagline || "Forged in Iron & Sweat",
    email: savedSettings.email || "awhikgoat@gmail.com",
    phone: savedSettings.phone || "9431259993",
    address: savedSettings.address || "L.S.P Chowk, New Delhi, India",
    announcement: savedSettings.announcement || "",
    maintenanceMode: savedSettings.maintenanceMode || "false",
    allowRegistrations: savedSettings.allowRegistrations !== "false" ? "true" : "false",
    showMemberCount: savedSettings.showMemberCount !== "false" ? "true" : "false",
  };

  const [settingsForm, setSettingsForm] = useState(defaultSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  const handleLogout = () => {
    clearAuthToken();
    clearUser();
    clearAdminSession();
    setLocation("/admin");
  };

  const handleDeleteUser = (id: number, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    deleteUserMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() });
          toast({ title: "User deleted", description: `${name} removed successfully.` });
        },
        onError: () => toast({ title: "Error", description: "Failed to delete user", variant: "destructive" }),
      }
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setTimeout(() => {
      saveWebsiteSettings(settingsForm);
      setSavingSettings(false);
      toast({ title: "Settings saved", description: "Website settings updated successfully." });
    }, 600);
  };

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: <Users size={20} className="text-blue-400" />, bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Total Bookings", value: stats?.totalBookings ?? "—", icon: <Calendar size={20} className="text-primary" />, bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Total Revenue", value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : "₹0", icon: <TrendingUp size={20} className="text-green-400" />, bg: "bg-green-500/10", border: "border-green-500/20" },
    { label: "Active Members", value: stats?.activeMemberships ?? "—", icon: <CreditCard size={20} className="text-yellow-400" />, bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { label: "Contact Messages", value: contactMessages.length, icon: <MessageSquare size={20} className="text-purple-400" />, bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Membership Plans", value: MEMBERSHIP_PLANS.length, icon: <Star size={20} className="text-orange-400" />, bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  const tabs = [
    { value: "overview", label: "Overview", icon: <BarChart3 size={15} /> },
    { value: "users", label: "Users", icon: <Users size={15} /> },
    { value: "bookings", label: "Bookings", icon: <Calendar size={15} /> },
    { value: "payments", label: "Payments", icon: <CreditCard size={15} /> },
    { value: "analytics", label: "Analytics", icon: <TrendingUp size={15} /> },
    { value: "memberships", label: "Memberships", icon: <Star size={15} /> },
    { value: "messages", label: "Messages", icon: <MessageSquare size={15} /> },
    { value: "settings", label: "Settings", icon: <Settings size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield size={16} className="text-primary" />
            </div>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Dumbbell size={20} className="text-primary" strokeWidth={2.5} />
              <span className="font-display font-bold text-base uppercase tracking-wider hidden sm:block">
                Body<span className="text-primary">power</span>
                <span className="text-muted-foreground font-normal text-xs ml-2">Admin</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { refetchStats(); toast({ title: "Refreshed" }); }}
              className="gap-1.5 text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <RefreshCw size={14} /> Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-8 max-w-screen-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight mb-1">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">Full control over Bodypower Gym operations.</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-card border ${card.border} rounded-xl p-4 flex flex-col gap-2`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bg}`}>
                {card.icon}
              </div>
              <p className="text-2xl font-display font-bold">
                {statsLoading && typeof card.value === "string" && card.value === "—" ? "..." : card.value}
              </p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide leading-tight">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="flex flex-wrap gap-1 h-auto mb-8 bg-card border border-border p-1 rounded-xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide rounded-lg px-3 py-2"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ─── OVERVIEW ─── */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display font-bold uppercase text-xs tracking-wider text-muted-foreground mb-5">
                  Monthly Revenue (₹)
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats?.revenueByMonth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display font-bold uppercase text-xs tracking-wider text-muted-foreground mb-5">
                  Bookings by Type
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={stats?.bookingsByType || [{ type: "No data", count: 1 }]}
                      cx="50%" cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="type"
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(stats?.bookingsByType || [{ type: "No data", count: 1 }]).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
                <h3 className="font-display font-bold uppercase text-xs tracking-wider text-muted-foreground mb-5">
                  Payment Methods
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats?.paymentsByMethod || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="method" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={80} />
                    <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Total"]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="total" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* ─── USERS ─── */}
          <TabsContent value="users">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-display font-bold uppercase text-sm tracking-wider">All Users ({users?.length ?? 0})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Name / Email", "Role", "Membership", "Bookings", "Total Spent", "Joined", ""].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {usersLoading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-8 bg-muted animate-pulse rounded" /></td></tr>
                      ))
                    ) : users?.length ? users.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className={`text-xs capitalize ${u.role === "admin" ? "border-primary text-primary" : ""}`}>{u.role}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          {u.membershipStatus
                            ? <Badge className="text-xs capitalize bg-green-500/20 text-green-400 border border-green-500/30">{u.membershipStatus}</Badge>
                            : <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                        <td className="px-5 py-4 font-mono text-sm">{u.totalBookings}</td>
                        <td className="px-5 py-4 font-bold">₹{(u.totalSpent ?? 0).toLocaleString()}</td>
                        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4">
                          {u.role !== "admin" && (
                            <button onClick={() => handleDeleteUser(u.id, u.name)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded hover:bg-destructive/10">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No users yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ─── BOOKINGS ─── */}
          <TabsContent value="bookings">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-display font-bold uppercase text-sm tracking-wider">All Bookings ({bookings?.length ?? 0})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Member", "Type", "Age", "Phone", "Status", "Code", "Date"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookingsLoading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-8 bg-muted animate-pulse rounded" /></td></tr>
                      ))
                    ) : bookings?.length ? bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-medium">{b.fullName}</div>
                          <div className="text-xs text-muted-foreground">{b.email}</div>
                        </td>
                        <td className="px-5 py-4 capitalize">{b.membershipType}</td>
                        <td className="px-5 py-4">{b.age}</td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">{b.phone}</td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className={`text-xs capitalize border ${STATUS_COLORS[b.status] || ""}`}>{b.status}</Badge>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-primary">{b.confirmationCode || "—"}</td>
                        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No bookings yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ─── PAYMENTS ─── */}
          <TabsContent value="payments">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-display font-bold uppercase text-sm tracking-wider">All Payments ({payments?.length ?? 0})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Transaction ID", "Method", "Amount", "Status", "Date"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paymentsLoading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-8 bg-muted animate-pulse rounded" /></td></tr>
                      ))
                    ) : payments?.length ? payments.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-primary">{p.transactionId || "—"}</td>
                        <td className="px-5 py-4 capitalize">{p.method.replace("_", " ")}</td>
                        <td className="px-5 py-4 font-bold text-base">₹{p.amount.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className={`text-xs border ${STATUS_COLORS[p.status] || ""}`}>{p.status}</Badge>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No payments yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ─── ANALYTICS ─── */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display font-bold uppercase text-xs tracking-wider text-muted-foreground mb-5">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={stats?.revenueByMonth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display font-bold uppercase text-xs tracking-wider text-muted-foreground mb-5">Booking Distribution</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={stats?.bookingsByType || [{ type: "Demo", count: 0 }, { type: "Silver", count: 0 }, { type: "Premium", count: 0 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="count" nameKey="type">
                      {(stats?.bookingsByType || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {(stats?.bookingsByType || []).map((d, i) => (
                    <div key={d.type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {d.type}: {d.count}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
                <h3 className="font-display font-bold uppercase text-xs tracking-wider text-muted-foreground mb-5">Summary Metrics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Avg Revenue/User", value: stats?.totalUsers ? `₹${Math.round((stats.totalRevenue || 0) / stats.totalUsers).toLocaleString()}` : "₹0" },
                    { label: "Conversion Rate", value: stats?.totalUsers ? `${Math.round(((stats.activeMemberships || 0) / stats.totalUsers) * 100)}%` : "0%" },
                    { label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}` },
                    { label: "Active Members", value: stats?.activeMemberships ?? 0 },
                  ].map((m) => (
                    <div key={m.label} className="bg-muted/40 rounded-xl p-4 text-center">
                      <p className="text-2xl font-display font-bold mb-1">{m.value}</p>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── MEMBERSHIPS ─── */}
          <TabsContent value="memberships">
            <div className="space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold uppercase tracking-wider">Membership Plans</h3>
                <Badge variant="outline" className="text-xs">3 Active Plans</Badge>
              </div>
              {MEMBERSHIP_PLANS.map((plan) => (
                <div key={plan.id} className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Star size={22} className={plan.color} />
                    </div>
                    <div>
                      <p className="font-display font-bold text-lg">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">{plan.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-display font-bold">
                        {plan.price === 0 ? "Free" : `₹${plan.price.toLocaleString()}`}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Price</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-display font-bold text-primary">
                        {bookings?.filter((b) => b.membershipType === plan.id).length ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Bookings</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-sm text-green-400 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-4 bg-muted/30 rounded-lg p-3">
                Membership plan prices and features are configured in the backend. Contact your developer to modify plan details.
              </p>
            </div>
          </TabsContent>

          {/* ─── MESSAGES ─── */}
          <TabsContent value="messages">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold uppercase tracking-wider">
                  Contact Messages
                  {contactMessages.filter((m) => !m.read).length > 0 && (
                    <Badge className="ml-2 text-xs bg-primary">{contactMessages.filter((m) => !m.read).length} new</Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{contactMessages.length} total</p>
              </div>
              {contactMessages.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-16 text-center">
                  <MessageSquare size={40} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No contact messages yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Messages from the Contact page will appear here.</p>
                </div>
              ) : (
                contactMessages.map((msg, idx) => (
                  <div key={msg.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <button
                      className="w-full p-5 flex items-start sm:items-center justify-between gap-4 text-left hover:bg-muted/20 transition-colors"
                      onClick={() => setExpandedMsg(expandedMsg === idx ? null : idx)}
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{msg.name}</p>
                            {!msg.read && <Badge className="text-[10px] py-0 px-1.5 h-4 bg-primary">New</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{msg.email} • {msg.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        {expandedMsg === idx ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                      </div>
                    </button>
                    {expandedMsg === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border p-5 bg-muted/20"
                      >
                        <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
                          <div><span className="text-muted-foreground text-xs uppercase tracking-wide">From</span><p className="font-medium mt-0.5">{msg.name} — {msg.email}</p></div>
                          <div><span className="text-muted-foreground text-xs uppercase tracking-wide">Date</span><p className="font-medium mt-0.5">{new Date(msg.createdAt).toLocaleString("en-IN")}</p></div>
                          <div className="sm:col-span-2"><span className="text-muted-foreground text-xs uppercase tracking-wide">Subject</span><p className="font-medium mt-0.5">{msg.subject}</p></div>
                        </div>
                        <div className="bg-background rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
                          {msg.message}
                        </div>
                        <div className="mt-4 flex gap-3">
                          <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}>
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs uppercase font-bold tracking-wide">
                              <Mail size={13} /> Reply via Email
                            </Button>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* ─── SETTINGS ─── */}
          <TabsContent value="settings">
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="font-display font-bold uppercase text-sm tracking-wider text-muted-foreground flex items-center gap-2">
                  <Globe size={16} /> General Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Gym Name</Label>
                    <Input value={settingsForm.gymName} onChange={(e) => setSettingsForm((p) => ({ ...p, gymName: e.target.value }))} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input value={settingsForm.tagline} onChange={(e) => setSettingsForm((p) => ({ ...p, tagline: e.target.value }))} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm((p) => ({ ...p, email: e.target.value }))} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={settingsForm.phone} onChange={(e) => setSettingsForm((p) => ({ ...p, phone: e.target.value }))} className="h-11" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Address</Label>
                    <Input value={settingsForm.address} onChange={(e) => setSettingsForm((p) => ({ ...p, address: e.target.value }))} className="h-11" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="font-display font-bold uppercase text-sm tracking-wider text-muted-foreground flex items-center gap-2">
                  <Bell size={16} /> Announcement Banner
                </h3>
                <div className="space-y-2">
                  <Label>Announcement (leave blank to hide)</Label>
                  <Textarea
                    value={settingsForm.announcement}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, announcement: e.target.value }))}
                    placeholder="e.g. Holiday hours: Gym closed on Dec 25th"
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="font-display font-bold uppercase text-sm tracking-wider text-muted-foreground flex items-center gap-2">
                  <Eye size={16} /> Display Options
                </h3>
                {[
                  { key: "allowRegistrations", label: "Allow New Registrations", desc: "Enable or disable new user sign-ups" },
                  { key: "showMemberCount", label: "Show Member Count", desc: "Display member count on the homepage" },
                  { key: "maintenanceMode", label: "Maintenance Mode", desc: "Show maintenance page to visitors" },
                ].map((opt) => (
                  <div key={opt.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                    <Switch
                      checked={settingsForm[opt.key as keyof typeof settingsForm] === "true"}
                      onCheckedChange={(v) => setSettingsForm((p) => ({ ...p, [opt.key]: v ? "true" : "false" }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="h-12 px-8 uppercase font-bold tracking-wider gap-2" disabled={savingSettings}>
                  {savingSettings ? (
                    <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle size={16} /> Save Settings</>
                  )}
                </Button>
                <Button type="button" variant="outline" className="h-12 px-8 uppercase font-bold tracking-wider gap-2"
                  onClick={() => { setSettingsForm(defaultSettings); toast({ title: "Settings reset to defaults" }); }}>
                  <XCircle size={16} /> Reset
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
