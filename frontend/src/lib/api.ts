const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}/api/v1${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || 'Request failed');
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  // Auth
  async register(data: { email: string; password: string; full_name: string; company_name?: string }) {
    return this.request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  async login(data: { email: string; password: string }) {
    return this.request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Agents
  async getAgents() {
    return this.request<any>('/agents/');
  }

  async createAgent(data: any) {
    return this.request<any>('/agents/', { method: 'POST', body: JSON.stringify(data) });
  }

  async getAgent(id: string) {
    return this.request<any>(`/agents/${id}`);
  }

  async updateAgent(id: string, data: any) {
    return this.request<any>(`/agents/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteAgent(id: string) {
    return this.request<void>(`/agents/${id}`, { method: 'DELETE' });
  }

  async chatWithAgent(agentId: string, message: string, conversationId?: string) {
    return this.request<any>(`/agents/${agentId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
  }

  // Analytics
  async getDashboardStats() {
    return this.request<any>('/analytics/dashboard');
  }

  async getAgentAnalytics(agentId: string) {
    return this.request<any>(`/analytics/agents/${agentId}`);
  }

  // Billing
  async getPlans() {
    return this.request<any>('/billing/plans');
  }

  async createCheckout(plan: string) {
    return this.request<any>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async getSubscription() {
    return this.request<any>('/billing/subscription');
  }

  async getInvoices() {
    return this.request<any>('/billing/invoices');
  }

  async cancelSubscription() {
    return this.request<any>('/billing/cancel', { method: 'POST' });
  }
}

export const api = new ApiClient(API_URL);
