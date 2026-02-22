'use client';

import { useState, useEffect } from 'react';
import { Check, CreditCard, ArrowRight, Zap, Shield, Crown } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Zap,
    features: ['1 AI Agent', '500 messages/mo', 'Basic analytics', 'Community support', 'Web widget'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 499,
    icon: Shield,
    features: ['3 AI Agents', '10,000 messages/mo', 'Advanced analytics', 'Email support', 'Custom branding', 'API access', 'Webhook integrations'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 1499,
    icon: Crown,
    popular: true,
    features: ['25 AI Agents', '100,000 messages/mo', 'Full analytics', 'Priority support', 'All integrations', 'Knowledge base (RAG)', 'Multi-language', 'Team collaboration'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    icon: Crown,
    features: ['Unlimited agents', '10M+ messages/mo', 'Dedicated manager', 'White-label', 'Full SDK', 'SSO/SAML', 'SLA guarantee', 'Custom fine-tuning'],
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planId: string) => {
    try {
      const result = await api.createCheckout(planId);
      window.location.href = result.url;
    } catch (err: any) {
      alert(err.message || 'Could not create checkout session. Please configure Stripe keys.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <div className="card p-6 bg-gradient-to-r from-brand-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">Current Plan</div>
            <div className="text-2xl font-bold capitalize">{user?.plan || 'free'}</div>
            <div className="text-sm text-gray-500 mt-1">
              Status: <span className="font-medium capitalize text-green-600">{subscription?.status || 'active'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Usage This Month</div>
            <div className="text-lg font-semibold">{user?.messages_this_month?.toLocaleString() || 0} messages</div>
            <div className="text-sm text-gray-500">{user?.api_calls_this_month?.toLocaleString() || 0} API calls</div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = user?.plan === plan.id;
          return (
            <div key={plan.id} className={`card p-6 relative ${plan.popular ? 'border-brand-500 border-2' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-600 text-white text-xs font-semibold rounded-full">
                  Popular
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <plan.icon className="w-5 h-5 text-brand-600" />
                <h3 className="font-semibold">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-extrabold">${plan.price.toLocaleString()}</span>
                <span className="text-gray-500">/mo</span>
              </div>

              {isCurrent ? (
                <div className="btn-secondary w-full mb-4 cursor-default">Current Plan</div>
              ) : plan.price > 0 ? (
                <button onClick={() => handleUpgrade(plan.id)}
                  className={plan.popular ? 'btn-primary w-full mb-4' : 'btn-secondary w-full mb-4'}>
                  Upgrade <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <div className="btn-ghost w-full mb-4 cursor-default border border-gray-200">Free Forever</div>
              )}

              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
