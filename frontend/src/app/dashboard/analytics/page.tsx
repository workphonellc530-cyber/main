'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, MessageSquare, Users, Clock, Zap } from 'lucide-react';
import { api } from '@/lib/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

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
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-500 mt-1">Track performance, ROI, and usage across all agents</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                period === p ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: MessageSquare, label: 'Total Messages', value: stats?.total_messages?.toLocaleString() || '0', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Users, label: 'Conversations', value: stats?.total_conversations?.toLocaleString() || '0', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: TrendingUp, label: 'Satisfaction', value: `${stats?.avg_satisfaction?.toFixed(1) || '0'}/5`, color: 'text-purple-600', bg: 'bg-purple-50' },
          { icon: Clock, label: 'Avg Response', value: `${stats?.response_time_avg_ms || 0}ms`, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((metric) => (
          <div key={metric.label} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg ${metric.bg} flex items-center justify-center`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <span className="text-sm text-gray-500">{metric.label}</span>
            </div>
            <div className="text-2xl font-bold">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Message Volume</h3>
          <div className="h-48 flex items-end gap-2">
            {[35, 52, 48, 61, 55, 70, 82, 78, 90, 85, 95, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-brand-500 rounded-t-md transition-all hover:bg-brand-600"
                  style={{ height: `${h}%` }} />
                <span className="text-[9px] text-gray-400">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Resolution Rate</h3>
          <div className="h-48 flex items-end gap-2">
            {[60, 65, 68, 72, 75, 78, 82, 85, 88, 90, 92, 94].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-green-500 rounded-t-md transition-all hover:bg-green-600"
                  style={{ height: `${h}%` }} />
                <span className="text-[9px] text-gray-400">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="card p-6 bg-gradient-to-r from-brand-50 to-purple-50">
        <h3 className="font-semibold mb-4">ROI Summary</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Messages Automated</div>
            <div className="text-3xl font-bold">{(stats?.total_messages || 0).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Est. Cost per Human Agent</div>
            <div className="text-3xl font-bold">$0.85<span className="text-sm text-gray-400">/msg</span></div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Savings</div>
            <div className="text-3xl font-bold gradient-text">
              ${((stats?.total_messages || 0) * 0.85).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
