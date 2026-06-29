import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

// Components
import { Layout } from "@/components/layout";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Membership from "@/pages/membership";
import Booking from "@/pages/booking";
import Dashboard from "@/pages/dashboard";
import DashboardSettings from "@/pages/settings";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";

function DarkModeEnforcer() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function WrappedHome() {
  return <Layout><Home /></Layout>;
}
function WrappedAbout() {
  return <Layout><About /></Layout>;
}
function WrappedContact() {
  return <Layout><Contact /></Layout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={WrappedHome} />
      <Route path="/about" component={WrappedAbout} />
      <Route path="/contact" component={WrappedContact} />
      <Route path="/membership" component={Membership} />
      <Route path="/booking" component={Booking} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/settings" component={DashboardSettings} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DarkModeEnforcer />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
