'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot, Zap, BarChart3, Shield, Globe, MessageSquare,
  ArrowRight, Check, Star, Users, TrendingUp, Clock,
  ChevronDown, Menu, X, Sparkles, Target, PenTool,
  Database, Mail, Code,
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'Agents', href: '#agents' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Testimonials', href: '#testimonials' },
];

const AGENT_TYPES = [
  {
    icon: MessageSquare,
    name: 'Customer Support',
    desc: 'Resolve 80% of tickets instantly with AI that understands context, sentiment, and your knowledge base.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Target,
    name: 'Lead Generation',
    desc: 'Qualify leads 24/7 with BANT methodology, book demos, and capture contacts automatically.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: PenTool,
    name: 'Content Creator',
    desc: 'Generate blog posts, social media, email campaigns, and ad copy at scale.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Database,
    name: 'Data Analyst',
    desc: 'Transform raw data into actionable insights with natural language queries.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: TrendingUp,
    name: 'Sales Assistant',
    desc: 'Prep for meetings, draft outreach, generate proposals, and close deals faster.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Code,
    name: 'Custom Agent',
    desc: 'Build any agent with your own prompts, tools, and integrations via our SDK.',
    color: 'from-indigo-500 to-violet-500',
  },
];

const FEATURES = [
  { icon: Zap, title: 'Deploy in 5 Minutes', desc: 'No code required. Configure, customize, and launch your AI agent with our intuitive builder.' },
  { icon: Globe, title: 'Omnichannel', desc: 'Web widget, API, Slack, WhatsApp, email — your agents work everywhere your customers are.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track conversations, satisfaction, resolution rates, and ROI with beautiful dashboards.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 compliant, encrypted data, SSO/SAML, role-based access. Your data stays yours.' },
  { icon: Bot, title: 'Multi-Model AI', desc: 'GPT-4o, Claude, or your own models. Switch providers without changing a single line of code.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Invite your team, assign roles, share agents, and review conversations together.' },
];

const PLANS = [
  {
    name: 'Starter',
    price: 499,
    period: '/mo',
    desc: 'Perfect for growing businesses',
    features: ['3 AI Agents', '10,000 messages/mo', 'Advanced analytics', 'Email support', 'Custom branding', 'API access', 'Webhook integrations'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Growth',
    price: 1499,
    period: '/mo',
    desc: 'For scaling companies',
    features: ['25 AI Agents', '100,000 messages/mo', 'Full analytics suite', 'Priority support', 'All integrations', 'Knowledge base (RAG)', 'Multi-language', 'Team collaboration'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 4999,
    period: '/mo',
    desc: 'For large organizations',
    features: ['Unlimited agents', '10M+ messages/mo', 'Dedicated account manager', 'White-label solution', 'Full SDK access', 'SSO / SAML', 'SLA guarantee', 'Custom fine-tuning', 'On-premise option'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'VP of Customer Success, TechFlow',
    text: 'AgentForge reduced our ticket volume by 73% in the first month. Our CSAT went up 18 points. The ROI was immediate and massive.',
    avatar: 'SC',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Growth, ScaleUp',
    text: 'The lead gen agent books 40+ qualified demos per week on autopilot. It paid for itself in 3 days. Best investment we\'ve ever made.',
    avatar: 'MJ',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'CMO, ContentBridge',
    text: 'We produce 10x more content now. Blog posts, social media, email sequences — all on brand, all high quality. Our team focuses on strategy now.',
    avatar: 'ER',
    rating: 5,
  },
];

const STATS = [
  { value: '2,500+', label: 'Companies Trust Us' },
  { value: '45M+', label: 'Messages Processed' },
  { value: '73%', label: 'Avg Ticket Reduction' },
  { value: '4.9/5', label: 'Customer Rating' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AgentForge<span className="text-brand-600">.ai</span></span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                  {link.name}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth" className="btn-ghost">Sign In</Link>
              <Link href="/auth" className="btn-primary">Get Started Free</Link>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            {NAV_LINKS.map((link) => (
              <a key={link.name} href={link.href} className="block py-2 text-gray-600 font-medium">{link.name}</a>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/auth" className="btn-secondary text-center">Sign In</Link>
              <Link href="/auth" className="btn-primary text-center">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full text-sm font-medium text-brand-700 mb-8 border border-brand-100">
              <Sparkles className="w-4 h-4" />
              <span>Powered by GPT-4o & Claude — Deploy AI agents in minutes</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              AI Agents That{' '}
              <span className="gradient-text">Actually Drive</span>{' '}
              Revenue
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Deploy intelligent AI agents for customer support, lead generation, content creation, and data analysis.
              No code. No complexity. Just results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/auth" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                Start Free — No Credit Card
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#demo" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                Watch 2-Min Demo
              </a>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="card p-2 max-w-5xl mx-auto">
              <div className="bg-gray-900 rounded-xl p-6 aspect-[16/9] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-gray-400 text-xs">agentforge.ai/dashboard</span>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className="col-span-1 bg-gray-800/50 rounded-lg p-3 space-y-3">
                    <div className="h-3 bg-brand-500/30 rounded w-3/4" />
                    <div className="h-2 bg-gray-700 rounded w-full" />
                    <div className="h-2 bg-gray-700 rounded w-5/6" />
                    <div className="h-2 bg-gray-700 rounded w-2/3" />
                    <div className="h-2 bg-brand-500/20 rounded w-full mt-6" />
                    <div className="h-2 bg-gray-700 rounded w-4/5" />
                    <div className="h-2 bg-gray-700 rounded w-full" />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {['Messages', 'Conversations', 'Satisfaction', 'Resolution'].map((label) => (
                        <div key={label} className="bg-gray-800/50 rounded-lg p-3">
                          <div className="text-[10px] text-gray-500 mb-1">{label}</div>
                          <div className="text-lg font-bold text-white">
                            {label === 'Messages' ? '24.5K' : label === 'Conversations' ? '3,241' : label === 'Satisfaction' ? '4.8/5' : '94%'}
                          </div>
                          <div className="text-[10px] text-green-400 mt-1">+12% vs last week</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-gray-400">Message Volume (7 days)</div>
                        <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-brand-500" />
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                        </div>
                      </div>
                      <div className="flex items-end gap-1 h-24">
                        {[40, 55, 45, 70, 65, 80, 90].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
                            <div className="w-full bg-brand-500/50 rounded-t" style={{ height: `${h}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section id="agents" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">6 Agent Types. Infinite Possibilities.</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Each agent is purpose-built for its domain, with specialized prompts, tools, and workflows.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENT_TYPES.map((agent) => (
              <div key={agent.name} className="card p-6 group hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${agent.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <agent.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Scale. Designed for Speed.</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to deploy, manage, and optimize AI agents at enterprise scale.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Start free. Scale as you grow. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`card p-8 relative ${plan.popular ? 'border-brand-500 border-2 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">${plan.price.toLocaleString()}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <Link href="/auth" className={plan.popular ? 'btn-primary w-full mb-6' : 'btn-secondary w-full mb-6'}>
                  {plan.cta}
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600">See how companies are transforming their operations with AgentForge.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.name} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Deploy Your First AI Agent?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Join 2,500+ companies using AgentForge to automate support, generate leads, and create content at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-brand-700 bg-white rounded-xl hover:bg-brand-50 transition-all shadow-xl w-full sm:w-auto">
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a href="#pricing" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all w-full sm:w-auto">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">AgentForge<span className="text-brand-400">.ai</span></span>
              </div>
              <p className="text-sm leading-relaxed">Enterprise AI Agent Platform. Deploy intelligent agents in minutes.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#agents" className="hover:text-white transition-colors">Agent Types</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2026 AgentForge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
