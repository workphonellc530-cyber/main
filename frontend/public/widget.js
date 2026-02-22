(function() {
  'use strict';

  const WIDGET_ID = 'agentforge-chat-widget';
  const API_BASE = window.AGENTFORGE_API_URL || 'https://api.agentforge.ai';

  function AgentForgeWidget(config) {
    this.config = Object.assign({
      agentId: null,
      token: null,
      position: 'bottom-right',
      primaryColor: '#4f46e5',
      title: 'Chat with us',
      subtitle: 'AI-powered support',
      placeholder: 'Type a message...',
      welcomeMessage: 'Hi! How can I help you today?',
    }, config);

    this.isOpen = false;
    this.messages = [];
    this.conversationId = null;
    this.init();
  }

  AgentForgeWidget.prototype.init = function() {
    this.injectStyles();
    this.createElements();
    this.bindEvents();
    if (this.config.welcomeMessage) {
      this.addMessage('assistant', this.config.welcomeMessage);
    }
  };

  AgentForgeWidget.prototype.injectStyles = function() {
    var style = document.createElement('style');
    style.textContent = [
      '#' + WIDGET_ID + '-bubble{position:fixed;z-index:99999;width:60px;height:60px;border-radius:50%;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;}',
      '#' + WIDGET_ID + '-bubble:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(0,0,0,0.2);}',
      '#' + WIDGET_ID + '-bubble svg{width:28px;height:28px;fill:white;}',
      '#' + WIDGET_ID + '-container{position:fixed;z-index:99999;width:380px;height:550px;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.15);display:none;flex-direction:column;background:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
      '#' + WIDGET_ID + '-container.open{display:flex;}',
      '#' + WIDGET_ID + '-header{padding:16px 20px;color:#fff;display:flex;align-items:center;gap:12px;}',
      '#' + WIDGET_ID + '-header h3{margin:0;font-size:16px;font-weight:600;}',
      '#' + WIDGET_ID + '-header p{margin:2px 0 0;font-size:12px;opacity:0.85;}',
      '#' + WIDGET_ID + '-close{margin-left:auto;background:none;border:none;color:#fff;cursor:pointer;padding:4px;opacity:0.8;}',
      '#' + WIDGET_ID + '-close:hover{opacity:1;}',
      '#' + WIDGET_ID + '-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;}',
      '.' + WIDGET_ID + '-msg{max-width:85%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.5;word-wrap:break-word;}',
      '.' + WIDGET_ID + '-msg.user{align-self:flex-end;color:#fff;border-bottom-right-radius:4px;}',
      '.' + WIDGET_ID + '-msg.assistant{align-self:flex-start;background:#f3f4f6;color:#1f2937;border-bottom-left-radius:4px;}',
      '#' + WIDGET_ID + '-input-area{padding:12px 16px;border-top:1px solid #e5e7eb;display:flex;gap:8px;align-items:center;}',
      '#' + WIDGET_ID + '-input{flex:1;border:1px solid #e5e7eb;border-radius:24px;padding:10px 16px;font-size:14px;outline:none;transition:border-color 0.2s;}',
      '#' + WIDGET_ID + '-input:focus{border-color:' + this.config.primaryColor + ';}',
      '#' + WIDGET_ID + '-send{width:36px;height:36px;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:opacity 0.2s;}',
      '#' + WIDGET_ID + '-send:hover{opacity:0.85;}',
      '#' + WIDGET_ID + '-send svg{width:18px;height:18px;fill:#fff;}',
      '.' + WIDGET_ID + '-typing{display:flex;gap:4px;padding:10px 14px;}',
      '.' + WIDGET_ID + '-typing span{width:6px;height:6px;background:#9ca3af;border-radius:50%;animation:af-bounce 1.4s infinite;}',
      '.' + WIDGET_ID + '-typing span:nth-child(2){animation-delay:0.2s;}',
      '.' + WIDGET_ID + '-typing span:nth-child(3){animation-delay:0.4s;}',
      '@keyframes af-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}',
      '#' + WIDGET_ID + '-powered{text-align:center;padding:6px;font-size:11px;color:#9ca3af;}',
      '#' + WIDGET_ID + '-powered a{color:#6366f1;text-decoration:none;}',
    ].join('\n');

    var pos = this.config.position === 'bottom-left' ? 'bottom:20px;left:20px;' : 'bottom:20px;right:20px;';
    var containerPos = this.config.position === 'bottom-left' ? 'bottom:90px;left:20px;' : 'bottom:90px;right:20px;';
    style.textContent += '#' + WIDGET_ID + '-bubble{' + pos + 'background:' + this.config.primaryColor + ';}';
    style.textContent += '#' + WIDGET_ID + '-container{' + containerPos + '}';

    document.head.appendChild(style);
  };

  AgentForgeWidget.prototype.createElements = function() {
    var bubble = document.createElement('div');
    bubble.id = WIDGET_ID + '-bubble';
    bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
    document.body.appendChild(bubble);
    this.bubble = bubble;

    var container = document.createElement('div');
    container.id = WIDGET_ID + '-container';
    container.innerHTML = [
      '<div id="' + WIDGET_ID + '-header" style="background:' + this.config.primaryColor + '">',
      '  <div><h3>' + this.config.title + '</h3><p>' + this.config.subtitle + '</p></div>',
      '  <button id="' + WIDGET_ID + '-close">&times;</button>',
      '</div>',
      '<div id="' + WIDGET_ID + '-messages"></div>',
      '<div id="' + WIDGET_ID + '-input-area">',
      '  <input id="' + WIDGET_ID + '-input" placeholder="' + this.config.placeholder + '" />',
      '  <button id="' + WIDGET_ID + '-send" style="background:' + this.config.primaryColor + '">',
      '    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
      '  </button>',
      '</div>',
      '<div id="' + WIDGET_ID + '-powered">Powered by <a href="https://agentforge.ai" target="_blank">AgentForge AI</a></div>',
    ].join('');
    document.body.appendChild(container);
    this.container = container;
    this.messagesEl = container.querySelector('#' + WIDGET_ID + '-messages');
    this.inputEl = container.querySelector('#' + WIDGET_ID + '-input');
  };

  AgentForgeWidget.prototype.bindEvents = function() {
    var self = this;
    this.bubble.addEventListener('click', function() { self.toggle(); });
    document.getElementById(WIDGET_ID + '-close').addEventListener('click', function() { self.toggle(); });
    document.getElementById(WIDGET_ID + '-send').addEventListener('click', function() { self.sendMessage(); });
    this.inputEl.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') self.sendMessage();
    });
  };

  AgentForgeWidget.prototype.toggle = function() {
    this.isOpen = !this.isOpen;
    this.container.classList.toggle('open', this.isOpen);
    this.bubble.style.display = this.isOpen ? 'none' : 'flex';
    if (this.isOpen) this.inputEl.focus();
  };

  AgentForgeWidget.prototype.addMessage = function(role, content) {
    var div = document.createElement('div');
    div.className = WIDGET_ID + '-msg ' + role;
    if (role === 'user') div.style.background = this.config.primaryColor;
    div.textContent = content;
    this.messagesEl.appendChild(div);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    this.messages.push({ role: role, content: content });
  };

  AgentForgeWidget.prototype.showTyping = function() {
    var div = document.createElement('div');
    div.className = WIDGET_ID + '-typing';
    div.id = WIDGET_ID + '-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    this.messagesEl.appendChild(div);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  };

  AgentForgeWidget.prototype.hideTyping = function() {
    var el = document.getElementById(WIDGET_ID + '-typing-indicator');
    if (el) el.remove();
  };

  AgentForgeWidget.prototype.sendMessage = function() {
    var text = this.inputEl.value.trim();
    if (!text) return;

    this.addMessage('user', text);
    this.inputEl.value = '';
    this.showTyping();

    var self = this;
    fetch(API_BASE + '/api/v1/agents/' + this.config.agentId + '/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.config.token,
      },
      body: JSON.stringify({
        message: text,
        conversation_id: self.conversationId,
        visitor_id: self.getVisitorId(),
      }),
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      self.hideTyping();
      self.conversationId = data.conversation_id;
      self.addMessage('assistant', data.response);
    })
    .catch(function() {
      self.hideTyping();
      self.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    });
  };

  AgentForgeWidget.prototype.getVisitorId = function() {
    var key = 'agentforge_visitor_id';
    var id = localStorage.getItem(key);
    if (!id) {
      id = 'v_' + Math.random().toString(36).substr(2, 12);
      localStorage.setItem(key, id);
    }
    return id;
  };

  window.AgentForge = AgentForgeWidget;
})();
