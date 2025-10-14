'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Shield, Crown, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { FAQItem, PricingCard, PricingFeature } from '@/components/pricing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Plans configuration (matches lib/stripe.ts)
const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    interval: 'month',
    description: 'Perfect for getting started with task management',
    features: [
      'Up to 50 tasks',
      'Basic task management',
      '1 project',
      'Email support',
      'Mobile app access',
    ],
    popular: false,
    icon: Sparkles,
    gradient: 'from-gray-500 to-gray-600',
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    interval: 'month',
    description: 'For power users who need advanced features',
    features: [
      'Unlimited tasks',
      'AI-powered insights',
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
      'Custom workflows',
      'API access',
    ],
    popular: true,
    icon: Zap,
    gradient: 'from-blue-600 to-purple-600',
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 29.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    interval: 'month',
    description: 'For teams that need enterprise-grade security',
    features: [
      'Everything in Pro',
      'Custom AI models',
      'Dedicated support',
      'SSO authentication',
      'Advanced security',
      'SLA guarantee',
      'Custom integrations',
      'Unlimited team members',
      'White-label options',
    ],
    popular: false,
    icon: Shield,
    gradient: 'from-purple-600 to-pink-600',
  },
};

const Pricing = () => {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (planKey: string) => {
    if (planKey === 'FREE') {
      toast.info('You are already on the free plan');
      return;
    }

    setIsLoading(planKey);

    try {
      // Call your API to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to start upgrade process. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the cost for you.",
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor, Stripe.',
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer:
        "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.",
    },
    {
      question: 'What happens when I hit the task limit on the free plan?',
      answer:
        "You'll be notified when you're approaching your limit. You can upgrade at any time to get unlimited tasks and additional features.",
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
    },
    {
      question: 'Can I cancel my subscription?',
      answer:
        "Absolutely. You can cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period.",
    },
  ];

  const yearlyDiscount = 0.8; // 20% discount for yearly

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Pricing Plans
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start for free and scale as you grow. All plans include our core
              features with no hidden fees.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <Button
              variant={billingInterval === 'monthly' ? 'default' : 'outline'}
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : ''
              }`}
            >
              Monthly
            </Button>
            <Button
              variant={billingInterval === 'yearly' ? 'default' : 'outline'}
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all relative ${
                billingInterval === 'yearly'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : ''
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-8">
          {Object.entries(PLANS).map(([key, plan]) => {
            const adjustedPrice =
              billingInterval === 'yearly' && plan.price > 0
                ? plan.price * yearlyDiscount
                : plan.price;

            return (
              <PricingCard
                key={key}
                name={plan.name}
                price={adjustedPrice}
                interval={billingInterval === 'yearly' ? 'year' : plan.interval}
                description={plan.description}
                features={plan.features}
                popular={plan.popular}
                icon={plan.icon}
                gradient={plan.gradient}
                planKey={key}
                onUpgrade={handleUpgrade}
                isLoading={isLoading === key}
              />
            );
          })}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white dark:bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              All Plans Include
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Core features available across all subscription tiers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingFeature
              icon={Zap}
              title="Lightning Fast"
              description="Optimized performance for seamless task management"
              gradient="from-blue-600 to-purple-600"
            />
            <PricingFeature
              icon={Shield}
              title="Secure & Private"
              description="Enterprise-grade security for all your data"
              gradient="from-purple-600 to-pink-600"
            />
            <PricingFeature
              icon={Sparkles}
              title="AI-Powered"
              description="Intelligent insights to boost your productivity"
              gradient="from-green-600 to-teal-600"
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about our pricing
          </p>
        </div>

        <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
          <div className="p-2">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="h-16 w-16 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to supercharge your productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already managing their tasks more
            efficiently
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;