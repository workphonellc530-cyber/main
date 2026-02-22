'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bot, MessageSquare, Users, TrendingUp, Clock, ArrowUpRight,
  ArrowDownRight, DollarSign, Zap, Target, BarChart3, Plus,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Stats {
  total_agents: number;
  active_agents: number;
  total_conversations: number;
  total_messages: number;
  avg_satisfaction: number;
  resolution_rate: number;
  messages_today: number;
  conversations_today: number;
  revenue_saved_estimate: number;
  response_time_avg_ms: number;
}

const STAT_CARDS = [
  { key: 'total_messages', label: 'Total Messages', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%', up: true },
  { key: 'total_conversations', label: 'Conversations', icon: Users, color: 'text-green-600', bg: 'bg-green-50', trend: '+8.2%', up: true },
  { key: 'avg_satisfaction', label: 'Satisfaction', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+3.1%', up: true, suffix: '/5' },
  { key: 'revenue_saved_estimate', label: 'Revenue Saved', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+24%', up: true, prefix: '$', format: true },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch(() => {
        setStats({
          total_agents: 0, active_agents: 0, total_conversations: 0,
          total_messages: 0, avg_satisfaction: 0, resolution_rate: 0,
          messages_today: 0, conversations_today: 0, revenue_saved_estimate: 0,
          response_time_avg_ms: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const formatValue = (card: typeof STAT_CARDS[0], value: number) => {
    const prefix = card.prefix || '';
    const suffix = card.suffix || '';
    if (card.format) return `${prefix}${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}${suffix}`;
    return `${prefix}${typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value.toLocaleString()}${suffix}`;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your AI agents performance</p>
        </div>
        <Link href="/dashboard/agents" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" /> New Agent
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className={`flex items-center text-xs font-medium ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {card.trend}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {stats ? formatValue(card, (stats as any)[card.key]) : '—'}
            </div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Agent Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Bot, title: 'Create Support Agent', desc: 'Deploy a customer support chatbot', href: '/dashboard/agents', color: 'from-blue-500 to-cyan-500' },
              { icon: Target, title: 'Create Lead Gen Agent', desc: 'Qualify and capture leads 24/7', href: '/dashboard/agents', color: 'from-green-500 to-emerald-500' },
              { icon: BarChart3, title: 'View Analytics', desc: 'Track agent performance and ROI', href: '/dashboard/analytics', color: 'from-purple-500 to-pink-500' },
              { icon: Zap, title: 'API Integration', desc: 'Connect via REST API or SDK', href: '/dashboard/agents', color: 'from-orange-500 to-amber-500' },
            ].map((action) => (
              <Link key={action.title} href={action.href}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all group">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Agent Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Agents</span>
              <span className="text-lg font-bold">{stats?.total_agents || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-lg font-bold text-green-600">{stats?.active_agents || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Resolution Rate</span>
              <span className="text-lg font-bold">{stats?.resolution_rate || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Response</span>
              <span className="text-lg font-bold">{stats?.response_time_avg_ms || 0}ms</span>
            </div>
            <hr className="border-gray-100" />
            <div className="bg-gradient-to-r from-brand-50 to-purple-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Estimated Cost Savings</div>
              <div className="text-2xl font-bold gradient-text">
                ${(stats?.revenue_saved_estimate || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Based on $0.15/message replaced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
