import { motion } from "framer-motion";

export default function About() {
  const trainers = [
    {
      name: "Vikram Singh",
      role: "Head Strength Coach",
      image: "/images/trainer-3.png",
      specialty: "Powerlifting & Hypertrophy"
    },
    {
      name: "Arjun Reddy",
      role: "Elite Performance Coach",
      image: "/images/trainer-1.png",
      specialty: "Athletic Conditioning"
    },
    {
      name: "Priya Sharma",
      role: "Functional Fitness Expert",
      image: "/images/trainer-2.png",
      specialty: "HIIT & Mobility"
    }
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 md:px-6 bg-card border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold uppercase mb-6"
          >
            Our <span className="text-primary">Legacy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            Bodypower Gym was built for those who take their training seriously. Since 2018, we've been the premier destination for strength, power, and athletic performance in New Delhi.
          </motion.p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 h-[400px] rounded-xl overflow-hidden"
            >
              <img src="/images/gym-2.png" alt="Gym Floor" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="h-[400px] rounded-xl overflow-hidden"
            >
              <img src="/images/gym-3.png" alt="Cardio Zone" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold uppercase mb-6">The Mission</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                To provide an environment where excuses don't exist. We supply the best equipment, the most knowledgeable coaches, and the intense atmosphere required to push beyond your perceived limits.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We don't care where you're starting from. We only care that you're ready to put in the work.
              </p>
            </div>
            <div className="bg-black/40 p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold uppercase mb-4 text-primary">Core Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <span className="text-gray-300"><strong>Intensity:</strong> Every rep counts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <span className="text-gray-300"><strong>Integrity:</strong> Form before ego.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <span className="text-gray-300"><strong>Community:</strong> Leave your ego at the door. We grow together.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="py-24 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-4">Meet The <span className="text-primary">Coaches</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our coaching staff consists of competitive athletes and certified specialists who practice what they preach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-card border border-border"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold uppercase text-white mb-1">{trainer.name}</h3>
                  <p className="text-primary font-medium mb-2">{trainer.role}</p>
                  <p className="text-gray-400 text-sm">{trainer.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
