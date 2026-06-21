-- Migration: Add payment provider fields to subscriptions table
-- This adds support for Stripe and Razorpay payment tracking

-- Add new columns if they don't exist
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS payment_provider TEXT,
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS order_id TEXT;

-- Create index for faster payment lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_id ON subscriptions(payment_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_order_id ON subscriptions(order_id);

-- Add comment to document the columns
COMMENT ON COLUMN subscriptions.payment_provider IS 'Payment gateway used: stripe or razorpay';
COMMENT ON COLUMN subscriptions.payment_id IS 'Payment ID from the payment gateway';
COMMENT ON COLUMN subscriptions.order_id IS 'Order/Session ID from the payment gateway';
