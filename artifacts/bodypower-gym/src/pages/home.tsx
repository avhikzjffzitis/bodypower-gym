import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Activity, Users, Trophy, Star, Dumbbell, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { id: 1, label: "Active Members", value: "2,500+", icon: <Users size={22} /> },
  { id: 2, label: "Expert Trainers", value: "20+", icon: <Star size={22} /> },
  { id: 3, label: "Modern Equipment", value: "150+", icon: <Activity size={22} /> },
  { id: 4, label: "Awards Won", value: "12", icon: <Trophy size={22} /> },
];

const features = [
  { icon: <Dumbbell size={28} />, title: "World-Class Equipment", desc: "500+ machines from top global brands, maintained to perfection." },
  { icon: <Zap size={28} />, title: "Elite Training Programs", desc: "Strength, HIIT, functional fitness, and sport-specific conditioning." },
  { icon: <Heart size={28} />, title: "Holistic Wellness", desc: "Nutrition coaching, recovery suites, and mental fitness guidance." },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="Bodypower Gym training"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold uppercase tracking-widest mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              New Delhi's #1 Gym
            </motion.div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight text-white mb-6 leading-[0.9]">
              Forged in{" "}
              <span className="text-primary block">Iron & Sweat</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Step into New Delhi's premier strength and conditioning facility. No gimmicks, just pure results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-base h-14 px-8 uppercase font-bold tracking-wider"
                onClick={() => navigate("/membership")}
              >
                Start Training
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base h-14 px-8 uppercase font-bold tracking-wider bg-transparent text-white border-white/40 hover:bg-white hover:text-black transition-all"
                onClick={() => navigate("/about")}
              >
                Explore Facility
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold uppercase mb-4"
            >
              Why Choose <span className="text-primary">Bodypower?</span>
            </motion.h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to build the physique you've always wanted.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-xl uppercase mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary" />
        <div className="absolute inset-0 opacity-10 bg-[url('/images/gym-1.png')] bg-center bg-cover mix-blend-overlay" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase text-white leading-tight mb-8">
              "Pain is weakness<br />leaving the body."
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6" />
            <p className="text-lg text-gray-400 font-medium uppercase tracking-widest">The Bodypower Philosophy</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-card p-10 md:p-16 rounded-2xl border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-5">Ready to transform?</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Join Bodypower Gym today. World-class equipment, elite trainers, and a community of champions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base uppercase tracking-wider font-bold group"
                  onClick={() => navigate("/membership")}
                >
                  View Memberships
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base uppercase tracking-wider font-bold"
                  onClick={() => navigate("/booking")}
                >
                  Book a Demo
                </Button>
              </div>
            </div>
            <div className="relative z-10 hidden md:block flex-shrink-0">
              <img
                src="/images/trainer-1.png"
                alt="Elite trainer at Bodypower Gym"
                className="w-56 h-72 object-cover rounded-xl border border-border shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
