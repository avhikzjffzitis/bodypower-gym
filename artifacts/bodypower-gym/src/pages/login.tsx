import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Dumbbell, Eye, EyeOff, Chrome, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@workspace/api-client-react";
import { setAuthToken, setUser } from "@/lib/auth";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: (data) => {
          setAuthToken(data.token);
          setUser(data.user);
          toast({ title: "Welcome back!", description: `Logged in as ${data.user.name}` });
          setLocation(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
        },
        onError: () => {
          toast({ title: "Login failed", description: "Invalid email or password", variant: "destructive" });
        },
      }
    );
  };

  const handleOAuth = (provider: string) => {
    toast({ title: `${provider} login`, description: "OAuth integration coming soon. Add your API keys to enable.", variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-secondary/60 to-primary/30" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <Dumbbell size={32} className="text-primary" strokeWidth={2.5} />
            <span className="font-display font-bold text-2xl uppercase tracking-wider text-white">
              Body<span className="text-primary">power</span>
            </span>
          </Link>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-display font-bold uppercase text-white leading-tight mb-6"
            >
              Your strength<br />journey<br /><span className="text-primary">starts here.</span>
            </motion.h2>
            <p className="text-gray-400 text-lg">
              New Delhi's most elite training facility. Join thousands of champions who chose Bodypower.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>2,500+ Members</span>
            <span>•</span>
            <span>20+ Expert Trainers</span>
            <span>•</span>
            <span>Since 2010</span>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <Dumbbell size={24} className="text-primary" />
            <span className="font-display font-bold text-xl uppercase tracking-wider text-foreground">
              Body<span className="text-primary">power</span>
            </span>
          </div>

          <h1 className="text-3xl font-display font-bold uppercase tracking-tight mb-2">Sign In</h1>
          <p className="text-muted-foreground mb-10">Welcome back, champion.</p>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" onClick={() => handleOAuth("Google")} className="h-12 gap-2 font-medium">
              <Chrome size={18} /> Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuth("Facebook")} className="h-12 gap-2 font-medium">
              <Facebook size={18} /> Facebook
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold uppercase tracking-wider"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            No account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
