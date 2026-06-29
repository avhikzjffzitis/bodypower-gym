import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, paymentsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/dashboard", authMiddleware, async (req: AuthRequest, res) => {
  const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.userId, req.userId!));

  const allPayments: (typeof paymentsTable.$inferSelect)[] = [];
  for (const b of bookings) {
    const p = await db.select().from(paymentsTable).where(and(eq(paymentsTable.bookingId, b.id), eq(paymentsTable.status, "success")));
    allPayments.push(...p);
  }

  const totalSpent = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed").slice(0, 5);

  const upcomingFormatted = await Promise.all(
    upcomingBookings.map(async (b) => {
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

  res.json({
    totalBookings: bookings.length,
    activeMembers: bookings.filter((b) => b.status === "confirmed").length,
    totalSpent,
    upcomingBookings: upcomingFormatted,
    recentPayments: allPayments.slice(0, 5).map((p) => ({
      id: p.id,
      bookingId: p.bookingId,
      amount: p.amount,
      method: p.method,
      status: p.status,
      transactionId: p.transactionId,
      createdAt: p.createdAt.toISOString(),
    })),
  });
});

export default router;
