import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Dumbbell, Home, Info, Calendar, Settings, LogOut, User, Menu, X, TrendingUp, CreditCard, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useGetDashboardStats, useLogout } from "@workspace/api-client-react";
import { getUser, clearAuthToken, clearUser } from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";

const statusColors: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  cancelled: "bg-red-500/20 text-red-400",
};

function DashboardContent() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const { toast } = useToast();
  const logoutMutation = useLogout();
  const { data: stats, isLoading } = useGetDashboardStats();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        clearAuthToken();
        clearUser();
        setLocation("/login");
        toast({ title: "Logged out successfully" });
      },
    });
  };

  const menuItems = [
    { icon: <Home size={18} />, label: "Home", href: "/" },
    { icon: <Info size={18} />, label: "About", href: "/about" },
    { icon: <Calendar size={18} />, label: "Booking", href: "/booking" },
    { icon: <Settings size={18} />, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
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
              <p className="font-semibold text-sm leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
            </div>
          </div>
          {user?.membershipStatus && (
            <Badge className="mt-3 text-xs capitalize">{user.membershipStatus} Member</Badge>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="font-display font-bold text-lg uppercase tracking-wide">Dashboard</h1>
          <Link href="/booking">
            <Button size="sm" className="uppercase font-bold text-xs tracking-wider">Book Now</Button>
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h2 className="text-3xl font-display font-bold uppercase mb-1">Welcome back, {user?.name?.split(" ")[0]}!</h2>
            <p className="text-muted-foreground">Your fitness journey at a glance.</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { label: "Total Bookings", value: stats?.totalBookings ?? "—", icon: <Calendar className="text-primary" size={22} />, color: "primary" },
              { label: "Active Sessions", value: stats?.activeMembers ?? "—", icon: <TrendingUp className="text-green-400" size={22} />, color: "green" },
              { label: "Total Spent", value: stats?.totalSpent ? `₹${stats.totalSpent.toLocaleString()}` : "₹0", icon: <CreditCard className="text-blue-400" size={22} />, color: "blue" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">{stat.icon}</div>
                <div>
                  <p className="text-2xl font-display font-bold">{isLoading ? "..." : stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Membership Status */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-bold uppercase text-sm tracking-wider text-muted-foreground mb-5">Membership Status</h3>
              {user?.membershipStatus ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="text-green-400" size={24} />
                    <div>
                      <p className="font-semibold capitalize">{user.membershipStatus} Membership — Active</p>
                      {user.membershipExpiry && <p className="text-xs text-muted-foreground">Expires: {new Date(user.membershipExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>}
                    </div>
                  </div>
                  <Link href="/booking">
                    <Button variant="outline" size="sm" className="uppercase text-xs font-bold tracking-wider">Renew / Upgrade</Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You don't have an active membership yet.</p>
                  <Link href="/membership">
                    <Button className="uppercase text-xs font-bold tracking-wider">View Plans</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Payments */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-bold uppercase text-sm tracking-wider text-muted-foreground mb-5">Payment History</h3>
              {isLoading ? (
                <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}</div>
              ) : stats?.recentPayments?.length ? (
                <div className="space-y-3">
                  {stats.recentPayments.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium capitalize">{p.method.replace("_", " ")}</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{p.amount.toLocaleString()}</p>
                        <Badge variant="secondary" className={`text-xs ${statusColors[p.status] || ""}`}>{p.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">No payments yet.</p>
              )}
            </div>

            {/* Upcoming Bookings */}
            <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
              <h3 className="font-display font-bold uppercase text-sm tracking-wider text-muted-foreground mb-5">Upcoming Bookings</h3>
              {isLoading ? (
                <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>
              ) : stats?.upcomingBookings?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.upcomingBookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-primary" />
                        <div>
                          <p className="font-medium capitalize">{b.membershipType} membership</p>
                          <p className="text-xs text-muted-foreground">Code: <span className="font-mono text-primary">{b.confirmationCode}</span></p>
                        </div>
                      </div>
                      <Badge className={`text-xs ${statusColors[b.status]}`}>{b.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No bookings yet.</p>
                  <Link href="/booking">
                    <Button className="uppercase text-xs font-bold tracking-wider">Book Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
