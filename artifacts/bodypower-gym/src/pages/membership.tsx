import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetMemberships } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";

const planIcons = { demo: <Zap className="text-yellow-400" size={28} />, silver: <Star className="text-slate-300" size={28} />, premium: <Crown className="text-primary" size={28} /> };

export default function Membership() {
  const { data: plans, isLoading } = useGetMemberships();

  return (
    <Layout>
      <div className="min-h-screen pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 uppercase tracking-widest text-xs font-bold px-4 py-1">Membership Plans</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tight mb-6">
              Choose Your <span className="text-primary">Power Level</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every champion starts somewhere. Pick the plan that matches your ambition.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-card rounded-2xl animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans?.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative flex flex-col bg-card border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    plan.popular ? "border-primary shadow-primary/20 shadow-xl scale-105" : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-xs font-bold uppercase tracking-widest py-2">
                      Most Popular
                    </div>
                  )}
                  <div className={`p-8 ${plan.popular ? "pt-12" : ""}`}>
                    <div className="flex items-center gap-3 mb-6">
                      {planIcons[plan.id as keyof typeof planIcons]}
                      <h3 className="text-xl font-display font-bold uppercase tracking-wide">{plan.name}</h3>
                    </div>
                    <div className="mb-8">
                      {plan.price === 0 ? (
                        <div className="text-5xl font-display font-bold text-foreground">Free</div>
                      ) : (
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-bold text-muted-foreground mt-1">₹</span>
                          <span className="text-5xl font-display font-bold text-foreground">{plan.price.toLocaleString()}</span>
                          <span className="text-muted-foreground mb-2 ml-1">/{plan.duration.toLowerCase()}</span>
                        </div>
                      )}
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 pt-0 mt-auto">
                    <Link href={`/booking?plan=${plan.id}`}>
                      <Button
                        className={`w-full h-12 uppercase font-bold tracking-wider text-sm ${plan.popular ? "" : "variant-outline"}`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.price === 0 ? "Book Free Trial" : "Get Started"}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <p className="text-muted-foreground text-sm">
              Questions? Contact us at <a href="mailto:awhikgoat@gmail.com" className="text-primary hover:underline">awhikgoat@gmail.com</a> or call{" "}
              <a href="tel:9431259993" className="text-primary hover:underline">9431259993</a>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
