/**
 * VAPI Custom Chat Widget Wrapper
 * A customizable wrapper for VAPI AI chat functionality
 * Supports custom header, footer, logo, and full styling options
 * 
 * Usage:
 * <script src="https://your-cdn.com/vapi-custom-widget.js" async></script>
 * <vapi-widget
 *   public-key="your-public-key"
 *   assistant-id="your-assistant-id"
 *   header="Chat with Support"
 *   footer="Powered by YourCompany"
 *   logo="https://example.com/logo.png"
 * ></vapi-widget>
 */

(function() {
  'use strict';

  // Default configuration
  const DEFAULTS = {
    theme: 'light',
    position: 'bottom-right',
    size: 'full',
    radius: 'medium',
    accentColor: '#14B8A6',
    baseColor: null,
    buttonBaseColor: '#000000',
    buttonAccentColor: '#FFFFFF',
    mainLabel: 'Chat with AI',
    emptyChatMessage: 'Hi! How can I help you today?',
    header: null,
    footer: null,
    logo: null
  };

  // Radius mappings
  const RADIUS_MAP = {
    none: '0px',
    small: '8px',
    medium: '12px',
    large: '20px'
  };

  // Position mappings
  const POSITION_MAP = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' }
  };

  class VapiCustomWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isOpen = false;
      this.messages = [];
      this.isLoading = false;
      this.previousChatId = null;
      this.consentGiven = false;
    }

    // Observed attributes
    static get observedAttributes() {
      return [
        'public-key', 'assistant-id', 'assistant-overrides',
        'theme', 'position', 'size', 'radius',
        'base-color', 'accent-color', 'button-base-color', 'button-accent-color',
        'main-label', 'empty-chat-message',
        'header', 'footer', 'logo',
        'require-consent', 'terms-content', 'local-storage-key'
      ];
    }

    connectedCallback() {
      this.render();
      this.setupEventListeners();
      this.checkConsent();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }

    // Get attribute with default fallback
    getAttr(name, defaultValue = null) {
      return this.getAttribute(name) || defaultValue;
    }

    // Get boolean attribute
    getBoolAttr(name) {
      return this.hasAttribute(name) && this.getAttribute(name) !== 'false';
    }

    // Get configuration
    getConfig() {
      return {
        publicKey: this.getAttr('public-key'),
        assistantId: this.getAttr('assistant-id'),
        assistantOverrides: this.getAttr('assistant-overrides'),
        theme: this.getAttr('theme', DEFAULTS.theme),
        position: this.getAttr('position', DEFAULTS.position),
        size: this.getAttr('size', DEFAULTS.size),
        radius: this.getAttr('radius', DEFAULTS.radius),
        baseColor: this.getAttr('base-color', DEFAULTS.baseColor),
        accentColor: this.getAttr('accent-color', DEFAULTS.accentColor),
        buttonBaseColor: this.getAttr('button-base-color', DEFAULTS.buttonBaseColor),
        buttonAccentColor: this.getAttr('button-accent-color', DEFAULTS.buttonAccentColor),
        mainLabel: this.getAttr('main-label', DEFAULTS.mainLabel),
        emptyChatMessage: this.getAttr('empty-chat-message', DEFAULTS.emptyChatMessage),
        header: this.getAttr('header', DEFAULTS.header),
        footer: this.getAttr('footer', DEFAULTS.footer),
        logo: this.getAttr('logo', DEFAULTS.logo),
        requireConsent: this.getBoolAttr('require-consent'),
        termsContent: this.getAttr('terms-content', 'By using this chat, you agree to our terms of service.'),
        localStorageKey: this.getAttr('local-storage-key', 'vapi_widget_consent')
      };
    }

    // Check consent status
    checkConsent() {
      const config = this.getConfig();
      if (!config.requireConsent) {
        this.consentGiven = true;
        return;
      }
      try {
        this.consentGiven = localStorage.getItem(config.localStorageKey) === 'true';
      } catch (e) {
        this.consentGiven = false;
      }
    }

    // Give consent
    giveConsent() {
      const config = this.getConfig();
      this.consentGiven = true;
      try {
        localStorage.setItem(config.localStorageKey, 'true');
      } catch (e) {
        console.warn('Could not save consent to localStorage');
      }
      this.render();
    }

    // Generate styles
    generateStyles() {
      const config = this.getConfig();
      const isDark = config.theme === 'dark';
      const radius = RADIUS_MAP[config.radius] || RADIUS_MAP.medium;
      const position = POSITION_MAP[config.position] || POSITION_MAP['bottom-right'];
      
      // Theme colors
      const bgColor = config.baseColor || (isDark ? '#1a1a1a' : '#ffffff');
      const textColor = isDark ? '#ffffff' : '#1a1a1a';
      const secondaryTextColor = isDark ? '#a0a0a0' : '#666666';
      const borderColor = isDark ? '#333333' : '#e5e5e5';
      const inputBgColor = isDark ? '#2a2a2a' : '#f5f5f5';
      const userMsgBg = config.accentColor;
      const assistantMsgBg = isDark ? '#2a2a2a' : '#f0f0f0';

      return `
        :host {
          --accent-color: ${config.accentColor};
          --bg-color: ${bgColor};
          --text-color: ${textColor};
          --secondary-text-color: ${secondaryTextColor};
          --border-color: ${borderColor};
          --input-bg-color: ${inputBgColor};
          --user-msg-bg: ${userMsgBg};
          --assistant-msg-bg: ${assistantMsgBg};
          --radius: ${radius};
          --button-base-color: ${config.buttonBaseColor};
          --button-accent-color: ${config.buttonAccentColor};
          
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          font-size: 14px;
          line-height: 1.5;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .widget-container {
          position: fixed;
          ${Object.entries(position).map(([k, v]) => `${k}: ${v};`).join('\n')}
          z-index: 999999;
          display: flex;
          flex-direction: column;
          align-items: ${config.position.includes('right') ? 'flex-end' : 'flex-start'};
        }

        /* Floating Button */
        .widget-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--button-base-color);
          color: var(--button-accent-color);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .widget-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .widget-button svg {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }

        .widget-button.open .icon-chat,
        .widget-button:not(.open) .icon-close {
          display: none;
        }

        /* Chat Window */
        .chat-window {
          position: absolute;
          ${config.position.includes('bottom') ? 'bottom: 70px;' : 'top: 70px;'}
          ${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
          width: ${config.size === 'compact' ? '320px' : '380px'};
          height: ${config.size === 'compact' ? '450px' : '550px'};
          background-color: var(--bg-color);
          border-radius: var(--radius);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .chat-window.open {
          display: flex;
          animation: slideIn 0.25s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-color);
          gap: 12px;
        }

        .chat-header-logo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .chat-header-logo-placeholder {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chat-header-logo-placeholder svg {
          width: 20px;
          height: 20px;
          fill: white;
        }

        .chat-header-title {
          flex: 1;
          font-weight: 600;
          font-size: 16px;
          color: var(--text-color);
        }

        .chat-header-close {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary-text-color);
          transition: background-color 0.2s ease;
        }

        .chat-header-close:hover {
          background-color: var(--input-bg-color);
        }

        .chat-header-close svg {
          width: 18px;
          height: 18px;
        }

        /* Messages Container */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
          border-radius: 3px;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          padding: 24px;
          color: var(--secondary-text-color);
        }

        .empty-state-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state-text {
          font-size: 14px;
          max-width: 240px;
        }

        /* Message Bubbles */
        .message {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 16px;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .message.user {
          align-self: flex-end;
          background-color: var(--user-msg-bg);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.assistant {
          align-self: flex-start;
          background-color: var(--assistant-msg-bg);
          color: var(--text-color);
          border-bottom-left-radius: 4px;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background-color: var(--assistant-msg-bg);
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: var(--secondary-text-color);
          border-radius: 50%;
          animation: typing 1.4s ease-in-out infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        /* Input Area */
        .chat-input-container {
          padding: 12px 16px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-color);
        }

        .chat-input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background-color: var(--input-bg-color);
          border-radius: calc(var(--radius) - 2px);
          padding: 8px 12px;
        }

        .chat-input {
          flex: 1;
          border: none;
          background: transparent;
          resize: none;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-color);
          max-height: 120px;
          min-height: 24px;
        }

        .chat-input:focus {
          outline: none;
        }

        .chat-input::placeholder {
          color: var(--secondary-text-color);
        }

        .chat-send-button {
          width: 32px;
          height: 32px;
          border: none;
          background-color: var(--accent-color);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .chat-send-button:hover {
          transform: scale(1.05);
        }

        .chat-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .chat-send-button svg {
          width: 16px;
          height: 16px;
        }

        /* Footer */
        .chat-footer {
          padding: 8px 16px;
          text-align: center;
          font-size: 11px;
          color: var(--secondary-text-color);
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-color);
        }

        /* Consent Screen */
        .consent-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }

        .consent-text {
          font-size: 13px;
          color: var(--secondary-text-color);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .consent-button {
          padding: 12px 24px;
          background-color: var(--accent-color);
          color: white;
          border: none;
          border-radius: calc(var(--radius) - 2px);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: opacity 0.2s ease;
        }

        .consent-button:hover {
          opacity: 0.9;
        }

        /* Error State */
        .error-message {
          background-color: #fee2e2;
          color: #dc2626;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin: 8px 16px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 100px);
            max-height: 600px;
          }
        }
      `;
    }

    // Render the widget
    render() {
      const config = this.getConfig();
      const headerText = config.header || config.mainLabel;

      this.shadowRoot.innerHTML = `
        <style>${this.generateStyles()}</style>
        <div class="widget-container">
          <div class="chat-window ${this.isOpen ? 'open' : ''}">
            <!-- Header -->
            <div class="chat-header">
              ${config.logo 
                ? `<img src="${config.logo}" alt="Logo" class="chat-header-logo" onerror="this.style.display='none'">`
                : `<div class="chat-header-logo-placeholder">
                    <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                  </div>`
              }
              <span class="chat-header-title">${headerText}</span>
              <button class="chat-header-close" aria-label="Close chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Messages or Consent -->
            ${config.requireConsent && !this.consentGiven 
              ? this.renderConsentScreen(config)
              : this.renderChatArea(config)
            }

            <!-- Footer -->
            ${config.footer 
              ? `<div class="chat-footer">${config.footer}</div>`
              : ''
            }
          </div>

          <!-- Floating Button -->
          <button class="widget-button ${this.isOpen ? 'open' : ''}" aria-label="Toggle chat">
            <svg class="icon-chat" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
            <svg class="icon-close" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      `;

      this.setupEventListeners();
      this.scrollToBottom();
    }

    // Render consent screen
    renderConsentScreen(config) {
      return `
        <div class="consent-screen">
          <p class="consent-text">${config.termsContent}</p>
          <button class="consent-button">Accept & Continue</button>
        </div>
      `;
    }

    // Render chat area
    renderChatArea(config) {
      return `
        <div class="chat-messages">
          ${this.messages.length === 0 
            ? `<div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
                <p class="empty-state-text">${config.emptyChatMessage}</p>
              </div>`
            : this.messages.map(msg => `
                <div class="message ${msg.role}">
                  ${this.escapeHtml(msg.content)}
                </div>
              `).join('')
          }
          ${this.isLoading 
            ? `<div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>`
            : ''
          }
        </div>

        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <textarea 
              class="chat-input" 
              placeholder="Type your message..." 
              rows="1"
              ${this.isLoading ? 'disabled' : ''}
            ></textarea>
            <button class="chat-send-button" ${this.isLoading ? 'disabled' : ''} aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }

    // Setup event listeners
    setupEventListeners() {
      const container = this.shadowRoot.querySelector('.widget-container');
      if (!container) return;

      // Toggle button
      const toggleBtn = container.querySelector('.widget-button');
      if (toggleBtn) {
        toggleBtn.onclick = () => this.toggleChat();
      }

      // Close button
      const closeBtn = container.querySelector('.chat-header-close');
      if (closeBtn) {
        closeBtn.onclick = () => this.toggleChat(false);
      }

      // Send button
      const sendBtn = container.querySelector('.chat-send-button');
      if (sendBtn) {
        sendBtn.onclick = () => this.sendMessage();
      }

      // Input field
      const input = container.querySelector('.chat-input');
      if (input) {
        input.onkeydown = (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
          }
        };
        // Auto-resize textarea
        input.oninput = () => {
          input.style.height = 'auto';
          input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        };
      }

      // Consent button
      const consentBtn = container.querySelector('.consent-button');
      if (consentBtn) {
        consentBtn.onclick = () => this.giveConsent();
      }
    }

    // Toggle chat window
    toggleChat(state = null) {
      this.isOpen = state !== null ? state : !this.isOpen;
      this.render();
      
      // Dispatch event
      this.dispatchEvent(new CustomEvent(this.isOpen ? 'chat-open' : 'chat-close', {
        bubbles: true,
        composed: true
      }));

      // Focus input when opening
      if (this.isOpen) {
        setTimeout(() => {
          const input = this.shadowRoot.querySelector('.chat-input');
          if (input) input.focus();
        }, 100);
      }
    }

    // Send message
    async sendMessage() {
      const input = this.shadowRoot.querySelector('.chat-input');
      if (!input) return;

      const message = input.value.trim();
      if (!message || this.isLoading) return;

      const config = this.getConfig();
      
      // Validate configuration
      if (!config.publicKey) {
        console.error('VAPI Widget: public-key is required');
        return;
      }
      if (!config.assistantId) {
        console.error('VAPI Widget: assistant-id is required');
        return;
      }

      // Add user message
      this.messages.push({ role: 'user', content: message });
      input.value = '';
      input.style.height = 'auto';
      this.isLoading = true;
      this.render();

      // Dispatch message event
      this.dispatchEvent(new CustomEvent('message', {
        detail: { role: 'user', content: message },
        bubbles: true,
        composed: true
      }));

      try {
        const response = await this.callVapiAPI(message, config);
        
        if (response) {
          this.messages.push({ role: 'assistant', content: response.content });
          if (response.chatId) {
            this.previousChatId = response.chatId;
          }
          
          // Dispatch response event
          this.dispatchEvent(new CustomEvent('message', {
            detail: { role: 'assistant', content: response.content },
            bubbles: true,
            composed: true
          }));
        }
      } catch (error) {
        console.error('VAPI Widget Error:', error);
        this.messages.push({ 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        });
        
        // Dispatch error event
        this.dispatchEvent(new CustomEvent('error', {
          detail: error,
          bubbles: true,
          composed: true
        }));
      }

      this.isLoading = false;
      this.render();
    }

    // Call VAPI API with streaming
    async callVapiAPI(message, config) {
      const payload = {
        assistantId: config.assistantId,
        input: message,
        stream: true
      };

      // Add previousChatId for context
      if (this.previousChatId) {
        payload.previousChatId = this.previousChatId;
      }

      // Add assistant overrides if provided
      if (config.assistantOverrides) {
        try {
          payload.assistantOverrides = JSON.parse(config.assistantOverrides);
        } catch (e) {
          console.warn('Invalid assistant-overrides JSON');
        }
      }

      const response = await fetch('https://api.vapi.ai/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.publicKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let chatId = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              // Capture chat ID
              if (data.id && !chatId) {
                chatId = data.id;
              }
              
              // Capture content delta
              if (data.delta) {
                fullContent += data.delta;
                this.updateStreamingMessage(fullContent);
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }

      return { content: fullContent, chatId };
    }

    // Update streaming message in real-time
    updateStreamingMessage(content) {
      const messagesContainer = this.shadowRoot.querySelector('.chat-messages');
      if (!messagesContainer) return;

      // Remove typing indicator
      const typingIndicator = messagesContainer.querySelector('.typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }

      // Find or create streaming message
      let streamingMsg = messagesContainer.querySelector('.message.assistant.streaming');
      if (!streamingMsg) {
        streamingMsg = document.createElement('div');
        streamingMsg.className = 'message assistant streaming';
        messagesContainer.appendChild(streamingMsg);
      }
      
      streamingMsg.textContent = content;
      this.scrollToBottom();
    }

    // Scroll to bottom of messages
    scrollToBottom() {
      const messagesContainer = this.shadowRoot.querySelector('.chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Register custom element
  if (!customElements.get('vapi-widget')) {
    customElements.define('vapi-widget', VapiCustomWidget);
  }
})();
