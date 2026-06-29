import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Dumbbell, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRegister } from "@workspace/api-client-react";
import { setAuthToken, setUser } from "@/lib/auth";

export default function Register() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const registerMutation = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { data: form },
      {
        onSuccess: (data) => {
          setAuthToken(data.token);
          setUser(data.user);
          toast({ title: "Account created!", description: "Welcome to Bodypower Gym!" });
          setLocation("/dashboard");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error || "Registration failed";
          toast({ title: "Error", description: msg, variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-primary/20 to-secondary" />
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
              Become a<br /><span className="text-primary">champion.</span>
            </motion.h2>
            <p className="text-gray-400 text-lg">
              Join New Delhi's most elite fitness community. Your transformation begins today.
            </p>
          </div>
          <div className="flex gap-4">
            {["Unlimited Access", "Expert Guidance", "Real Results"].map((t) => (
              <div key={t} className="text-xs text-gray-500 border border-border rounded px-3 py-1">{t}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <Dumbbell size={24} className="text-primary" />
            <span className="font-display font-bold text-xl uppercase tracking-wider">
              Body<span className="text-primary">power</span>
            </span>
          </div>

          <h1 className="text-3xl font-display font-bold uppercase tracking-tight mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-10">Start your fitness journey today.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="h-12 pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-bold uppercase tracking-wider mt-2" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already a member?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
