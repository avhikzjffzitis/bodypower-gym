import { Router } from "express";

const router = Router();

const membershipPlans = [
  {
    id: "demo",
    name: "Book Demo",
    price: 0,
    duration: "1 Day",
    features: [
      "Free trial session",
      "Access to all equipment",
      "Expert trainer guidance",
      "No commitment required",
      "Facility tour included",
    ],
    popular: false,
  },
  {
    id: "silver",
    name: "Silver Membership",
    price: 1300,
    duration: "Per Month",
    features: [
      "Unlimited gym access",
      "Group fitness classes",
      "Locker room access",
      "Basic trainer consultation",
      "Nutrition guidance",
      "Progress tracking",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Membership",
    price: 2000,
    duration: "Per Month",
    features: [
      "Everything in Silver",
      "Personal training sessions (4/month)",
      "Priority equipment access",
      "Diet planning",
      "Body composition analysis",
      "Guest passes (2/month)",
      "Exclusive workshops",
    ],
    popular: false,
  },
];

router.get("/", (_req, res) => {
  res.json(membershipPlans);
});

export default router;
