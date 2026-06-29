import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, paymentsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateBookingBody } from "@workspace/api-zod";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();

function generateConfirmationCode(): string {
  return "BP" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

async function formatBooking(booking: typeof bookingsTable.$inferSelect) {
  const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.bookingId, booking.id)).limit(1);
  return {
    id: booking.id,
    userId: booking.userId,
    fullName: booking.fullName,
    phone: booking.phone,
    age: booking.age,
    email: booking.email,
    membershipType: booking.membershipType,
    status: booking.status,
    confirmationCode: booking.confirmationCode,
    createdAt: booking.createdAt.toISOString(),
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
}

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.userId, req.userId!));
  const formatted = await Promise.all(bookings.map(formatBooking));
  res.json(formatted);
});

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  const { fullName, phone, age, email, membershipType } = parsed.data;
  const confirmationCode = generateConfirmationCode();
  const [booking] = await db
    .insert(bookingsTable)
    .values({
      userId: req.userId!,
      fullName,
      phone,
      age,
      email,
      membershipType,
      status: "pending",
      confirmationCode,
    })
    .returning();

  const formatted = await formatBooking(booking);
  res.status(201).json(formatted);
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(and(eq(bookingsTable.id, id), eq(bookingsTable.userId, req.userId!)))
    .limit(1);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const formatted = await formatBooking(booking);
  res.json(formatted);
});

export default router;
