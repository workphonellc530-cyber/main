'use client';

import { useState, useEffect } from 'react';
import {
  Bot, Plus, Search, MoreVertical, MessageSquare, Target, PenTool,
  Database, TrendingUp, Code, Trash2, Edit, Play, Pause, Eye,
  Zap, Settings,
} from 'lucide-react';
import { api } from '@/lib/api';

const AGENT_TYPE_META: Record<string, { icon: any; color: string; label: string }> = {
  customer_support: { icon: MessageSquare, color: 'from-blue-500 to-cyan-500', label: 'Customer Support' },
  lead_generation: { icon: Target, color: 'from-green-500 to-emerald-500', label: 'Lead Generation' },
  content_creator: { icon: PenTool, color: 'from-purple-500 to-pink-500', label: 'Content Creator' },
  data_analyst: { icon: Database, color: 'from-orange-500 to-amber-500', label: 'Data Analyst' },
  sales_assistant: { icon: TrendingUp, color: 'from-red-500 to-rose-500', label: 'Sales Assistant' },
  custom: { icon: Code, color: 'from-indigo-500 to-violet-500', label: 'Custom Agent' },
};

const STATUS_BADGES: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  draft: 'bg-gray-50 text-gray-600 border-gray-200',
  paused: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  archived: 'bg-red-50 text-red-600 border-red-200',
};

interface CreateAgentModalProps {
  onClose: () => void;
  onCreate: (data: any) => void;
}

function CreateAgentModal({ onClose, onCreate }: CreateAgentModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [agentType, setAgentType] = useState('customer_support');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await onCreate({
        name,
        description,
        agent_type: agentType,
        system_prompt: systemPrompt || undefined,
        llm_model: model,
      });
      onClose();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">Create New Agent</h2>
          <p className="text-sm text-gray-500 mt-1">Step {step} of 2</p>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(AGENT_TYPE_META).map(([key, meta]) => (
                    <button key={key} onClick={() => setAgentType(key)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        agentType === key ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200'
                      }`}>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${meta.color} flex items-center justify-center`}>
                        <meta.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium">{meta.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Agent Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="input" placeholder="e.g., Support Bot, Lead Qualifier" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  className="input min-h-[80px]" placeholder="What does this agent do?" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">AI Model</label>
                <select value={model} onChange={(e) => setModel(e.target.value)} className="input">
                  <option value="gpt-4o">GPT-4o (Recommended)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                  <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Faster)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Custom System Prompt <span className="text-gray-400">(optional)</span>
                </label>
                <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)}
                  className="input min-h-[150px] font-mono text-sm"
                  placeholder="Leave blank to use the optimized default prompt for this agent type..." />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <div className="flex gap-3">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="btn-secondary">Back</button>}
            {step < 2 ? (
              <button onClick={() => setStep(2)} disabled={!name} className="btn-primary">
                Next <Zap className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button onClick={handleCreate} disabled={loading || !name} className="btn-primary">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Agent'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAgents = () => {
    api.getAgents()
      .then((data) => setAgents(data.agents || []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleCreate = async (data: any) => {
    await api.createAgent(data);
    fetchAgents();
  };

  const handleToggleStatus = async (agent: any) => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    await api.updateAgent(agent.id, { status: newStatus });
    fetchAgents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    await api.deleteAgent(id);
    fetchAgents();
  };

  const filtered = agents.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Agents</h1>
          <p className="text-gray-500 mt-1">Create, manage, and deploy your AI agents</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" /> New Agent
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          className="input pl-11" placeholder="Search agents..." />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first AI agent to start automating conversations and driving revenue.</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" /> Create Your First Agent
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agent) => {
            const meta = AGENT_TYPE_META[agent.agent_type] || AGENT_TYPE_META.custom;
            return (
              <div key={agent.id} className="card p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${meta.color} flex items-center justify-center`}>
                    <meta.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${STATUS_BADGES[agent.status] || STATUS_BADGES.draft}`}>
                    {agent.status}
                  </span>
                </div>

                <h3 className="font-semibold mb-1">{agent.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{agent.description || meta.label}</p>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-gray-50 rounded-lg py-2">
                    <div className="text-sm font-semibold">{agent.total_messages?.toLocaleString() || 0}</div>
                    <div className="text-[10px] text-gray-500">Messages</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2">
                    <div className="text-sm font-semibold">{agent.total_conversations || 0}</div>
                    <div className="text-[10px] text-gray-500">Convos</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2">
                    <div className="text-sm font-semibold">{(agent.avg_satisfaction || 0).toFixed(1)}</div>
                    <div className="text-[10px] text-gray-500">Rating</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => handleToggleStatus(agent)}
                    className="flex-1 btn-ghost text-xs gap-1.5 justify-center">
                    {agent.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {agent.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button className="btn-ghost text-xs gap-1.5 px-3">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(agent.id)}
                    className="btn-ghost text-xs gap-1.5 px-3 text-red-500 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && <CreateAgentModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}
