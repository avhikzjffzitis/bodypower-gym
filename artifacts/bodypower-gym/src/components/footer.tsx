import { Link } from "wouter";
import { Dumbbell, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Dumbbell size={28} strokeWidth={2.5} className="text-primary" />
              <span className="font-display font-bold text-xl text-foreground uppercase tracking-wider">
                Body<span className="text-primary">power</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2">
              The premier training facility in New Delhi. Where serious athletes and fitness enthusiasts come to build their ultimate physique.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/membership", label: "Membership Plans" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Members */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6 uppercase tracking-wider">Members</h3>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/login", label: "Member Login" },
                { href: "/register", label: "Join Now" },
                { href: "/booking", label: "Book a Session" },
                { href: "/dashboard", label: "My Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6 uppercase tracking-wider">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">L.S.P Chowk, New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a href="tel:9431259993" className="text-muted-foreground hover:text-primary transition-colors text-sm">9431259993</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <a href="mailto:awhikgoat@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">awhikgoat@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Bodypower Gym. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-muted-foreground text-xs">Privacy Policy</span>
            <span className="text-muted-foreground text-xs">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
