import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialization - only create when needed
let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set');
    }
    
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  
  return razorpayInstance;
}

export interface CreateRazorpayOrderParams {
  amount: number; // in paise (smallest unit)
  currency: string;
  planId: string;
  userId: string;
  userEmail: string;
}

// Create Razorpay order
export async function createRazorpayOrder(
  params: CreateRazorpayOrderParams
): Promise<{ orderId: string; amount: number; currency: string }> {
  const razorpay = getRazorpayInstance();
  
  const order = await razorpay.orders.create({
    amount: params.amount, // Amount in paise
    currency: params.currency,
    receipt: `receipt_${params.userId}_${Date.now()}`,
    notes: {
      userId: params.userId,
      planId: params.planId,
      userEmail: params.userEmail,
    },
  });

  return {
    orderId: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

// Verify Razorpay payment signature
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const text = `${orderId}|${paymentId}`;
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex');

  return expectedSignature === signature;
}

// Verify Razorpay webhook signature
export function verifyRazorpayWebhook(
  payload: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not set');
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}

// Fetch payment details
export async function fetchRazorpayPayment(paymentId: string) {
  const razorpay = getRazorpayInstance();
  return await razorpay.payments.fetch(paymentId);
}
