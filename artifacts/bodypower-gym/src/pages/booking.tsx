import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, Smartphone, Landmark, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout";
import { useToast } from "@/hooks/use-toast";
import { useCreateBooking, useCreatePayment } from "@workspace/api-client-react";
import { getUser } from "@/lib/auth";

const membershipPrices: Record<string, number> = { demo: 0, silver: 1300, premium: 2000 };
const membershipNames: Record<string, string> = { demo: "Book Demo (Free)", silver: "Silver Membership", premium: "Premium Membership" };
const paymentMethods = [
  { id: "upi", label: "UPI", icon: <Smartphone size={20} /> },
  { id: "credit_card", label: "Credit Card", icon: <CreditCard size={20} /> },
  { id: "debit_card", label: "Debit Card", icon: <CreditCard size={20} /> },
  { id: "net_banking", label: "Net Banking", icon: <Landmark size={20} /> },
];

const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Kotak Mahindra Bank", "Bank of Baroda"];

export default function Booking() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const planParam = params.get("plan") || "demo";

  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const { toast } = useToast();
  const user = getUser();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || "",
    phone: "",
    age: "",
    email: user?.email || "",
    membershipType: planParam,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "upi",
    upiId: "",
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
    bankName: "",
  });

  const createBookingMutation = useCreateBooking();
  const createPaymentMutation = useCreatePayment();

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(personalInfo.age);
    if (age < 18 || age > 60) {
      toast({ title: "Age invalid", description: "Age must be between 18 and 60 years", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Login required", description: "Please log in to book a membership", variant: "destructive" });
      setLocation("/login");
      return;
    }

    createBookingMutation.mutate(
      {
        data: {
          fullName: personalInfo.fullName,
          phone: personalInfo.phone,
          age,
          email: personalInfo.email,
          membershipType: personalInfo.membershipType as "demo" | "silver" | "premium",
        },
      },
      {
        onSuccess: (booking) => {
          setBookingId(booking.id);
          setConfirmationCode(booking.confirmationCode || "");
          if (membershipPrices[personalInfo.membershipType] === 0) {
            setTransactionId("FREE-" + Date.now());
            setStep(3);
          } else {
            setStep(2);
          }
        },
        onError: () => {
          toast({ title: "Booking failed", description: "Please try again", variant: "destructive" });
        },
      }
    );
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;

    const price = membershipPrices[personalInfo.membershipType];
    createPaymentMutation.mutate(
      {
        data: {
          bookingId,
          amount: price,
          method: paymentInfo.method as "upi" | "credit_card" | "debit_card" | "net_banking",
          upiId: paymentInfo.upiId || null,
          cardNumber: paymentInfo.cardNumber || null,
          cardHolder: paymentInfo.cardHolder || null,
          cardExpiry: paymentInfo.cardExpiry || null,
          cardCvv: paymentInfo.cardCvv || null,
          bankName: paymentInfo.bankName || null,
        },
      },
      {
        onSuccess: (payment) => {
          setTransactionId(payment.transactionId || "");
          setStep(3);
        },
        onError: () => {
          toast({ title: "Payment failed", description: "Please check your details and try again", variant: "destructive" });
        },
      }
    );
  };

  const steps = ["Personal Info", "Payment", "Confirmation"];

  return (
    <Layout>
      <div className="min-h-screen pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h1 className="text-4xl font-display font-bold uppercase tracking-tight mb-2 text-center">Book Your Spot</h1>
          <p className="text-muted-foreground text-center mb-12">Secure your membership at Bodypower Gym</p>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-12 gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step > i + 1 ? "bg-primary/20 text-primary" : step === i + 1 ? "bg-primary text-white" : "bg-card text-muted-foreground"
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    step > i + 1 ? "border-primary bg-primary text-white" : step === i + 1 ? "border-white" : "border-muted"
                  }`}>
                    {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < steps.length - 1 && <ChevronRight size={16} className="text-muted-foreground mx-1" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handlePersonalSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-display font-bold uppercase">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input value={personalInfo.fullName} onChange={(e) => setPersonalInfo(p => ({ ...p, fullName: e.target.value }))} required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input value={personalInfo.phone} onChange={(e) => setPersonalInfo(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit number" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Age (18-60) *</Label>
                      <Input type="number" min={18} max={60} value={personalInfo.age} onChange={(e) => setPersonalInfo(p => ({ ...p, age: e.target.value }))} required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo(p => ({ ...p, email: e.target.value }))} required className="h-11" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Membership Type *</Label>
                    <Select value={personalInfo.membershipType} onValueChange={(v) => setPersonalInfo(p => ({ ...p, membershipType: v }))}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demo">Book Demo (Free)</SelectItem>
                        <SelectItem value="silver">Silver Membership - ₹1,300/month</SelectItem>
                        <SelectItem value="premium">Premium Membership - ₹2,000/month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{membershipNames[personalInfo.membershipType]}</span>
                    <span className="font-display font-bold text-lg">{membershipPrices[personalInfo.membershipType] === 0 ? "FREE" : `₹${membershipPrices[personalInfo.membershipType].toLocaleString()}`}</span>
                  </div>
                  <Button type="submit" className="w-full h-12 uppercase font-bold tracking-wider" disabled={createBookingMutation.isPending}>
                    {createBookingMutation.isPending ? "Processing..." : "Continue to Payment"}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handlePaymentSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-display font-bold uppercase">Payment Details</h2>
                  <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Amount to Pay</span>
                    <span className="font-display font-bold text-2xl text-primary">₹{membershipPrices[personalInfo.membershipType].toLocaleString()}</span>
                  </div>

                  {/* Payment method selector */}
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {paymentMethods.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentInfo(p => ({ ...p, method: m.id }))}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                            paymentInfo.method === m.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {m.icon}
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic fields */}
                  {paymentInfo.method === "upi" && (
                    <div className="space-y-2">
                      <Label>UPI ID *</Label>
                      <Input value={paymentInfo.upiId} onChange={(e) => setPaymentInfo(p => ({ ...p, upiId: e.target.value }))} placeholder="yourname@upi" required className="h-11" />
                    </div>
                  )}

                  {(paymentInfo.method === "credit_card" || paymentInfo.method === "debit_card") && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label>Card Number *</Label>
                        <Input value={paymentInfo.cardNumber} onChange={(e) => setPaymentInfo(p => ({ ...p, cardNumber: e.target.value }))} placeholder="1234 5678 9012 3456" maxLength={19} required className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cardholder Name *</Label>
                        <Input value={paymentInfo.cardHolder} onChange={(e) => setPaymentInfo(p => ({ ...p, cardHolder: e.target.value }))} required className="h-11" />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label>Expiry (MM/YY) *</Label>
                          <Input value={paymentInfo.cardExpiry} onChange={(e) => setPaymentInfo(p => ({ ...p, cardExpiry: e.target.value }))} placeholder="12/27" maxLength={5} required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV *</Label>
                          <Input type="password" value={paymentInfo.cardCvv} onChange={(e) => setPaymentInfo(p => ({ ...p, cardCvv: e.target.value }))} maxLength={4} required className="h-11" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentInfo.method === "net_banking" && (
                    <div className="space-y-2">
                      <Label>Select Bank *</Label>
                      <Select value={paymentInfo.bankName} onValueChange={(v) => setPaymentInfo(p => ({ ...p, bankName: v }))}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Choose your bank" /></SelectTrigger>
                        <SelectContent>{banks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground bg-muted/30 rounded p-3">
                    This is a simulated payment flow. To use real payment gateway, replace the payment processing logic with your Razorpay/Stripe API keys.
                  </p>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>Back</Button>
                    <Button type="submit" className="flex-1 h-12 uppercase font-bold tracking-wider" disabled={createPaymentMutation.isPending}>
                      {createPaymentMutation.isPending ? "Processing..." : "Pay Now"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="bg-card border border-primary/30 rounded-2xl p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={48} className="text-primary" />
                  </motion.div>
                  <h2 className="text-3xl font-display font-bold uppercase mb-3">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mb-8">Your membership has been booked successfully. See you at the gym!</p>

                  <div className="bg-muted/30 rounded-xl p-6 text-left space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Confirmation Code</span>
                      <span className="font-bold font-mono text-primary text-lg">{confirmationCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Membership</span>
                      <span className="font-medium">{membershipNames[personalInfo.membershipType]}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-medium">{personalInfo.fullName}</span>
                    </div>
                    {transactionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Transaction ID</span>
                        <span className="font-mono text-xs">{transactionId}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-12" onClick={() => setLocation("/")}>Back to Home</Button>
                    <Button className="flex-1 h-12 uppercase font-bold" onClick={() => setLocation("/dashboard")}>View Dashboard</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
