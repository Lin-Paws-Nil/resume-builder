#!/bin/bash

# Razorpay Payment System Setup Verification Script
# Run this to check if everything is configured correctly

echo "🔍 Checking Razorpay Payment System Configuration..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found"
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  Please add your Razorpay API keys to .env.local"
    echo ""
    echo "Get your keys from: https://dashboard.razorpay.com/app/keys"
    echo ""
    exit 1
fi

# Function to check if env var is set
check_env_var() {
    local var_name=$1
    local var_value=$(grep "^${var_name}=" .env.local | cut -d '=' -f2)
    
    if [ -z "$var_value" ] || [[ "$var_value" == *"your_"* ]] || [[ "$var_value" == *"xxxxx"* ]] || [[ "$var_value" == *"here"* ]]; then
        echo "❌ $var_name - Not configured"
        return 1
    else
        echo "✅ $var_name - Configured"
        return 0
    fi
}

echo "🇮🇳 Checking Razorpay Configuration:"
check_env_var "RAZORPAY_KEY_ID"
razorpay_key_id=$?
check_env_var "RAZORPAY_KEY_SECRET"
razorpay_secret=$?
check_env_var "NEXT_PUBLIC_RAZORPAY_KEY_ID"
razorpay_public=$?
echo ""

echo "🌐 Checking App Configuration:"
check_env_var "NEXT_PUBLIC_APP_URL"
app_url=$?
echo ""

echo "📦 Checking Dependencies:"
if npm list razorpay > /dev/null 2>&1; then
    echo "✅ razorpay - Installed"
    razorpay_installed=0
else
    echo "❌ razorpay - Not installed"
    razorpay_installed=1
fi
echo ""

echo "📄 Checking Payment Files:"
required_files=(
    "lib/payments/config.ts"
    "lib/payments/razorpay.ts"
    "app/api/payment/razorpay/create-order/route.ts"
    "app/api/payment/razorpay/verify/route.ts"
    "app/api/webhooks/razorpay/route.ts"
    "app/payment/page.tsx"
    "app/payment/success/page.tsx"
    "supabase/migrations/add_payment_fields.sql"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - Missing"
        all_files_exist=false
    fi
done
echo ""

# Check if Stripe files were removed
echo "🗑️  Checking Stripe Cleanup:"
if [ -f "lib/payments/stripe.ts" ]; then
    echo "⚠️  lib/payments/stripe.ts - Still exists (should be removed)"
else
    echo "✅ Stripe files removed"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

razorpay_ready=true
if [ $razorpay_key_id -ne 0 ] || [ $razorpay_secret -ne 0 ] || [ $razorpay_public -ne 0 ]; then
    razorpay_ready=false
fi

if $all_files_exist && [ $razorpay_installed -eq 0 ] && $razorpay_ready; then
    echo "🎉 Payment system is READY!"
    echo ""
    echo "✅ All files present"
    echo "✅ Razorpay installed"
    echo "✅ API keys configured"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Run database migration in Supabase"
    echo "   2. Run: npm run dev"
    echo "   3. Test: http://localhost:3000/subscribe"
    echo ""
    echo "Test credentials:"
    echo "   Card: 4111 1111 1111 1111"
    echo "   UPI:  success@razorpay"
    echo "   OTP:  0000"
elif ! $all_files_exist; then
    echo "⚠️  Some payment files are missing"
    echo ""
    echo "📁 Missing files need to be created"
elif [ $razorpay_installed -ne 0 ]; then
    echo "⚠️  Razorpay package not installed"
    echo ""
    echo "Run: npm install razorpay"
elif ! $razorpay_ready; then
    echo "⏳ Razorpay API keys not configured"
    echo ""
    echo "📝 Add your API keys to .env.local:"
    echo ""
    echo "1. Go to: https://dashboard.razorpay.com/app/keys"
    echo "2. Switch to TEST MODE (top-left toggle)"
    echo "3. Copy Key ID and Key Secret"
    echo "4. Add to .env.local file"
    echo ""
    echo "Quick command:"
    echo "  nano .env.local"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 Documentation:"
echo "   - SETUP_CHECKLIST.md - Your step-by-step guide"
echo "   - RAZORPAY_SETUP_GUIDE.md - Complete Razorpay guide"
echo ""
