import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { usersTable, bookingsTable, paymentsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";
import { adminMiddleware, generateToken, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.post("/login", async (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || user.role !== "admin") {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = generateToken(user.id, user.role);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      membershipStatus: user.membershipStatus,
      membershipExpiry: user.membershipExpiry,
      language: user.language,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.get("/stats", adminMiddleware, async (_req: AuthRequest, res) => {
  const [{ count: totalUsers }] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
  const [{ count: totalBookings }] = await db.select({ count: sql<number>`count(*)::int` }).from(bookingsTable);
  const activeMemberships = await db.select({ count: sql<number>`count(*)::int` }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed"));

  const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.status, "success"));
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  // Bookings by type
  const demoCount = (await db.select({ count: sql<number>`count(*)::int` }).from(bookingsTable).where(eq(bookingsTable.membershipType, "demo")))[0].count;
  const silverCount = (await db.select({ count: sql<number>`count(*)::int` }).from(bookingsTable).where(eq(bookingsTable.membershipType, "silver")))[0].count;
  const premiumCount = (await db.select({ count: sql<number>`count(*)::int` }).from(bookingsTable).where(eq(bookingsTable.membershipType, "premium")))[0].count;

  // Revenue by method
  const upiPayments = payments.filter((p) => p.method === "upi");
  const cardPayments = payments.filter((p) => p.method === "credit_card" || p.method === "debit_card");
  const netBankingPayments = payments.filter((p) => p.method === "net_banking");

  // Monthly revenue (last 6 months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthPayments = payments.filter((p) => {
      const pd = new Date(p.createdAt);
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
    });
    return {
      month: months[d.getMonth()],
      revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
    };
  });

  res.json({
    totalUsers,
    totalBookings,
    totalRevenue,
    activeMemberships: activeMemberships[0].count,
    bookingsByType: [
      { type: "Demo", count: demoCount },
      { type: "Silver", count: silverCount },
      { type: "Premium", count: premiumCount },
    ],
    revenueByMonth,
    paymentsByMethod: [
      { method: "UPI", count: upiPayments.length, total: upiPayments.reduce((s, p) => s + p.amount, 0) },
      { method: "Card", count: cardPayments.length, total: cardPayments.reduce((s, p) => s + p.amount, 0) },
      { method: "Net Banking", count: netBankingPayments.length, total: netBankingPayments.reduce((s, p) => s + p.amount, 0) },
    ],
  });
});

router.get("/users", adminMiddleware, async (_req, res) => {
  const users = await db.select().from(usersTable);
  const result = await Promise.all(
    users.map(async (u) => {
      const userBookings = await db.select().from(bookingsTable).where(eq(bookingsTable.userId, u.id));
      const userPayments: (typeof paymentsTable.$inferSelect)[] = [];
      for (const b of userBookings) {
        const p = await db.select().from(paymentsTable).where(eq(paymentsTable.bookingId, b.id));
        userPayments.push(...p);
      }
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        membershipStatus: u.membershipStatus,
        totalBookings: userBookings.length,
        totalSpent: userPayments.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0),
        createdAt: u.createdAt.toISOString(),
      };
    })
  );
  res.json(result);
});

router.delete("/users/:id", adminMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.json({ message: "User deleted" });
});

router.get("/bookings", adminMiddleware, async (_req, res) => {
  const bookings = await db.select().from(bookingsTable);
  const formatted = await Promise.all(
    bookings.map(async (b) => {
      const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.bookingId, b.id)).limit(1);
      return {
        id: b.id,
        userId: b.userId,
        fullName: b.fullName,
        phone: b.phone,
        age: b.age,
        email: b.email,
        membershipType: b.membershipType,
        status: b.status,
        confirmationCode: b.confirmationCode,
        createdAt: b.createdAt.toISOString(),
        payment: payment
          ? {
              id: payment.id,
              bookingId: payment.bookingId,
              amount: payment.amount,
              method: payment.method,
              status: payment.status,
              transactionId: payment.transactionId,
              createdAt: payment.createdAt.toISOString(),
            }
          : undefined,
      };
    })
  );
  res.json(formatted);
});

router.get("/payments", adminMiddleware, async (_req, res) => {
  const payments = await db.select().from(paymentsTable);
  res.json(
    payments.map((p) => ({
      id: p.id,
      bookingId: p.bookingId,
      amount: p.amount,
      method: p.method,
      status: p.status,
      transactionId: p.transactionId,
      createdAt: p.createdAt.toISOString(),
    }))
  );
});

export default router;
