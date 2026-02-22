'use client'

import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-gradient font-display">ProfitAI</span>
          <div className="flex gap-6">
            <a href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
            <a href="#agents" className="text-slate-300 hover:text-white transition">Agents</a>
            <a href="#marketplace" className="text-slate-300 hover:text-white transition">Marketplace</a>
            <a href="#enterprise" className="text-slate-300 hover:text-white transition">Enterprise</a>
            <a href="#demo" className="bg-profit-500 hover:bg-profit-600 text-white px-5 py-2 rounded-lg font-semibold transition">
              Book Demo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero - Conversion focused */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full glass text-profit-400 text-sm font-medium">
            Target: $200K in 14 Days • Multi-Revenue Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
            AI Agents That
            <span className="text-gradient"> Generate Revenue</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Deploy lead gen, sales, and support agents in 5 minutes. 
            65% lower CAC • 2x quota attainment • 25% shorter cycles.
            Enterprise API from $50K.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@email.com"
              required
              className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-profit-500"
            />
            <button type="submit" className="px-8 py-4 bg-profit-500 hover:bg-profit-600 rounded-xl font-semibold transition glow-profit">
              Start Free Trial
            </button>
          </form>
          {submitted && <p className="text-profit-400">✓ Demo booked! We&apos;ll contact you within 2 hours.</p>}
          
          <div className="flex justify-center gap-12 mt-12 text-slate-500">
            <span>No credit card</span>
            <span>5-min setup</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Revenue metrics - Social proof */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '$2,000', label: 'Revenue per agent/month', sub: 'FTE replacement model' },
              { value: '65%', label: 'CAC reduction', sub: 'AI vs traditional' },
              { value: '25%', label: 'Marketplace commission', sub: 'On every transaction' },
              { value: '$50K+', label: 'Enterprise deals', sub: 'API + white-label' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="text-2xl font-bold text-profit-400">{stat.value}</div>
                <div className="text-slate-300 font-medium mt-1">{stat.label}</div>
                <div className="text-slate-500 text-sm mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent types - Product showcase */}
      <section id="agents" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Revenue-Generating Agents</h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-16">
            Pre-built agents. Deploy in 5 minutes. Start generating pipeline today.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Lead Gen Pro', price: '$1,999/mo', roi: '65% CAC reduction', color: 'profit' },
              { name: 'AI SDR', price: '$2,499/mo', roi: '2x quota attainment', color: 'profit' },
              { name: 'Support+Upsell', price: '$1,499/mo', roi: '15% ticket-to-sale', color: 'profit' },
              { name: 'Enterprise SDR', price: '$4,999/mo', roi: '$50K+ deal acceleration', color: 'premium' },
            ].map((agent, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:border-profit-500/30 transition border border-transparent">
                <div className="text-profit-400 font-semibold mb-2">{agent.name}</div>
                <div className="text-2xl font-bold mb-2">{agent.price}</div>
                <div className="text-slate-500 text-sm mb-4">{agent.roi}</div>
                <a href="#demo" className="text-profit-400 hover:text-profit-300 text-sm font-medium">
                  Deploy now →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Critical for conversion */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Pricing That Scales to $200K</h2>
          <p className="text-slate-400 text-center mb-16">
            Multiple paths to revenue. Choose your model.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8">
              <div className="text-slate-400 font-medium mb-2">Starter</div>
              <div className="text-4xl font-bold mb-1">$99<span className="text-lg font-normal text-slate-500">/mo</span></div>
              <div className="text-slate-500 text-sm mb-6">1 agent, 500 leads/mo</div>
              <ul className="space-y-3 text-slate-400 mb-8">
                <li>✓ Lead Gen Agent</li>
                <li>✓ Basic analytics</li>
                <li>✓ Email support</li>
              </ul>
              <a href="#demo" className="block text-center py-3 rounded-xl border border-white/20 hover:border-profit-500 transition">
                Start Free
              </a>
            </div>

            <div className="glass rounded-2xl p-8 border-2 border-profit-500 glow-profit relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-profit-500 rounded-full text-sm font-medium">
                Best for $200K target
              </div>
              <div className="text-slate-400 font-medium mb-2">Growth</div>
              <div className="text-4xl font-bold mb-1">$1,999<span className="text-lg font-normal text-slate-500">/mo</span></div>
              <div className="text-slate-500 text-sm mb-6">5 agents, unlimited leads</div>
              <ul className="space-y-3 text-slate-400 mb-8">
                <li>✓ All agent types</li>
                <li>✓ Marketplace access</li>
                <li>✓ Revenue attribution</li>
                <li>✓ Priority support</li>
              </ul>
              <a href="#demo" className="block text-center py-3 rounded-xl bg-profit-500 hover:bg-profit-600 transition font-semibold">
                Start Trial
              </a>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="text-slate-400 font-medium mb-2">Enterprise</div>
              <div className="text-4xl font-bold mb-1">$50K+<span className="text-lg font-normal text-slate-500">/year</span></div>
              <div className="text-slate-500 text-sm mb-6">Unlimited everything</div>
              <ul className="space-y-3 text-slate-400 mb-8">
                <li>✓ Full API access</li>
                <li>✓ White-label</li>
                <li>✓ Dedicated success</li>
                <li>✓ Custom agents</li>
              </ul>
              <a href="#demo" className="block text-center py-3 rounded-xl border border-white/20 hover:border-premium-500 transition">
                Book Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Agent Marketplace</h2>
          <p className="text-slate-400 text-center mb-4">
            25% commission on every sale. $2.3B market by 2026.
          </p>
          <p className="text-profit-400 text-center text-sm mb-16">
            Path to $50K: ~200 transactions at $250 avg
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'LinkedIn Outreach Pro', price: '$299', sales: 127, revenue: '$45K' },
              { name: 'Cold Email AI', price: '$199', sales: 312, revenue: '$89K' },
              { name: 'Enterprise Research', price: '$999', sales: 45, revenue: '$125K' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="font-semibold mb-2">{item.name}</div>
                <div className="text-profit-400 text-xl mb-2">{item.price}</div>
                <div className="text-slate-500 text-sm">{item.sales} sales • {item.revenue} GMV</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Enterprise */}
      <section id="enterprise" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">$200K in 14 Days: Enterprise Path</h2>
          <p className="text-slate-400 mb-8">
            2-4 enterprise deals at $50K-100K each. API + white-label + dedicated implementation.
          </p>
          <a href="#demo" className="inline-block px-10 py-4 bg-premium-500 hover:bg-premium-600 rounded-xl font-semibold transition">
            Schedule Enterprise Call
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-slate-500">© 2025 ProfitAI. All rights reserved.</span>
          <div className="flex gap-8 text-slate-500 text-sm">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
