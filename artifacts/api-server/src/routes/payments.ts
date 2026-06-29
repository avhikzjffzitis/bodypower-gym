import { Router } from "express";
import { db } from "@workspace/db";
import { paymentsTable, bookingsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreatePaymentBody } from "@workspace/api-zod";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();

function generateTransactionId(): string {
  return "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const userBookings = await db.select({ id: bookingsTable.id }).from(bookingsTable).where(eq(bookingsTable.userId, req.userId!));
  const bookingIds = userBookings.map((b) => b.id);
  if (bookingIds.length === 0) {
    res.json([]);
    return;
  }
  const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.bookingId, bookingIds[0]));
  // Get all payments for user's bookings
  const allPayments: (typeof paymentsTable.$inferSelect)[] = [];
  for (const bid of bookingIds) {
    const p = await db.select().from(paymentsTable).where(eq(paymentsTable.bookingId, bid));
    allPayments.push(...p);
  }
  res.json(
    allPayments.map((p) => ({
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

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = CreatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { bookingId, amount, method } = parsed.data;

  // Verify booking belongs to this user
  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(and(eq(bookingsTable.id, bookingId), eq(bookingsTable.userId, req.userId!)))
    .limit(1);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const transactionId = generateTransactionId();
  // Simulate payment - in production, integrate real payment gateway here
  const [payment] = await db
    .insert(paymentsTable)
    .values({
      bookingId,
      amount,
      method,
      status: "success", // Simulated success
      transactionId,
    })
    .returning();

  // Update booking to confirmed
  await db.update(bookingsTable).set({ status: "confirmed" }).where(eq(bookingsTable.id, bookingId));

  // Update user membership status
  const membershipExpiry = new Date();
  membershipExpiry.setMonth(membershipExpiry.getMonth() + 1);

  const { usersTable } = await import("@workspace/db");
  await db
    .update(usersTable)
    .set({
      membershipStatus: booking.membershipType,
      membershipExpiry: membershipExpiry.toISOString().split("T")[0],
    })
    .where(eq(usersTable.id, req.userId!));

  res.status(201).json({
    id: payment.id,
    bookingId: payment.bookingId,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId,
    createdAt: payment.createdAt.toISOString(),
  });
});

export default router;
