/**
 * VAPI Chat Widget - Custom Wrapper
 * Adds custom logo, header, and footer support to VAPI Chat Widget
 * 
 * Usage:
 * <script
 *   src="vapi-chat-custom.js"
 *   data-public-key="your-public-key"
 *   data-assistant-id="your-assistant-id"
 *   data-mode="chat"
 *   data-theme="light"
 *   data-logo="https://example.com/logo.png"
 *   data-header-title="Chat with Us"
 *   data-footer="Powered by YourCompany © 2025"
 *   data-primary-color="#007bff"
 * ></script>
 */

(function() {
  'use strict';

  // Get current script element to read data attributes
  const currentScript = document.currentScript;
  
  // Configuration from data attributes
  const config = {
    // Required VAPI props
    publicKey: currentScript.getAttribute('data-public-key') || '',
    assistantId: currentScript.getAttribute('data-assistant-id') || '',
    
    // VAPI native options
    mode: currentScript.getAttribute('data-mode') || 'chat',
    theme: currentScript.getAttribute('data-theme') || 'light',
    position: currentScript.getAttribute('data-position') || 'bottom-right',
    size: currentScript.getAttribute('data-size') || 'full',
    radius: currentScript.getAttribute('data-radius') || 'medium',
    
    // VAPI styling
    baseColor: currentScript.getAttribute('data-base-color') || '',
    accentColor: currentScript.getAttribute('data-accent-color') || currentScript.getAttribute('data-primary-color') || '',
    buttonBaseColor: currentScript.getAttribute('data-button-base-color') || '',
    buttonAccentColor: currentScript.getAttribute('data-button-accent-color') || '',
    
    // VAPI labels
    mainLabel: currentScript.getAttribute('data-main-label') || currentScript.getAttribute('data-header-title') || '',
    startButtonText: currentScript.getAttribute('data-start-button-text') || '',
    endButtonText: currentScript.getAttribute('data-end-button-text') || '',
    emptyChatMessage: currentScript.getAttribute('data-empty-chat-message') || currentScript.getAttribute('data-welcome-message') || '',
    emptyVoiceMessage: currentScript.getAttribute('data-empty-voice-message') || '',
    placeholder: currentScript.getAttribute('data-placeholder') || '',
    
    // VAPI advanced
    assistantOverrides: currentScript.getAttribute('data-assistant-overrides') || '',
    requireConsent: currentScript.getAttribute('data-require-consent') || '',
    termsContent: currentScript.getAttribute('data-terms-content') || '',
    showTranscript: currentScript.getAttribute('data-show-transcript') || '',
    
    // Custom options (our additions)
    logo: currentScript.getAttribute('data-logo') || '',
    logoSize: currentScript.getAttribute('data-logo-size') || '32',
    logoAlt: currentScript.getAttribute('data-logo-alt') || 'Logo',
    headerTitle: currentScript.getAttribute('data-header-title') || '',
    footer: currentScript.getAttribute('data-footer') || '',
    footerLink: currentScript.getAttribute('data-footer-link') || '',
    footerLinkText: currentScript.getAttribute('data-footer-link-text') || '',
  };

  // Inject custom CSS
  function injectStyles() {
    const primaryColor = config.accentColor || '#14B8A6';
    const isDark = config.theme === 'dark';
    
    const css = `
      /* Custom VAPI Widget Styles */
      .vapi-custom-header {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 12px 16px !important;
        background: ${isDark ? '#1a1a2e' : '#ffffff'} !important;
        border-bottom: 1px solid ${isDark ? '#2d2d44' : '#e5e7eb'} !important;
      }
      
      .vapi-custom-logo {
        width: ${config.logoSize}px !important;
        height: ${config.logoSize}px !important;
        object-fit: contain !important;
        border-radius: 6px !important;
      }
      
      .vapi-custom-header-title {
        font-size: 16px !important;
        font-weight: 600 !important;
        color: ${isDark ? '#ffffff' : '#1f2937'} !important;
        margin: 0 !important;
        flex: 1 !important;
      }
      
      .vapi-custom-footer {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 8px 16px !important;
        background: ${isDark ? '#1a1a2e' : '#f9fafb'} !important;
        border-top: 1px solid ${isDark ? '#2d2d44' : '#e5e7eb'} !important;
        font-size: 12px !important;
        color: ${isDark ? '#9ca3af' : '#6b7280'} !important;
      }
      
      .vapi-custom-footer a {
        color: ${primaryColor} !important;
        text-decoration: none !important;
        margin-left: 4px !important;
      }
      
      .vapi-custom-footer a:hover {
        text-decoration: underline !important;
      }

      /* Ensure widget container has proper structure */
      vapi-widget {
        --vapi-custom-injected: 1;
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'vapi-custom-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Create VAPI widget element
  function createVapiWidget() {
    const widget = document.createElement('vapi-widget');
    
    // Set required attributes
    widget.setAttribute('public-key', config.publicKey);
    
    if (config.assistantId) {
      widget.setAttribute('assistant-id', config.assistantId);
    }
    
    // Set optional VAPI attributes
    if (config.mode) widget.setAttribute('mode', config.mode);
    if (config.theme) widget.setAttribute('theme', config.theme);
    if (config.position) widget.setAttribute('position', config.position);
    if (config.size) widget.setAttribute('size', config.size);
    if (config.radius) widget.setAttribute('radius', config.radius);
    
    // Styling
    if (config.baseColor) widget.setAttribute('base-color', config.baseColor);
    if (config.accentColor) widget.setAttribute('accent-color', config.accentColor);
    if (config.buttonBaseColor) widget.setAttribute('button-base-color', config.buttonBaseColor);
    if (config.buttonAccentColor) widget.setAttribute('button-accent-color', config.buttonAccentColor);
    
    // Labels
    if (config.mainLabel) widget.setAttribute('main-label', config.mainLabel);
    if (config.startButtonText) widget.setAttribute('start-button-text', config.startButtonText);
    if (config.endButtonText) widget.setAttribute('end-button-text', config.endButtonText);
    if (config.emptyChatMessage) widget.setAttribute('empty-chat-message', config.emptyChatMessage);
    if (config.emptyVoiceMessage) widget.setAttribute('empty-voice-message', config.emptyVoiceMessage);
    if (config.placeholder) widget.setAttribute('placeholder', config.placeholder);
    
    // Advanced
    if (config.assistantOverrides) widget.setAttribute('assistant-overrides', config.assistantOverrides);
    if (config.requireConsent) widget.setAttribute('require-consent', config.requireConsent);
    if (config.termsContent) widget.setAttribute('terms-content', config.termsContent);
    if (config.showTranscript) widget.setAttribute('show-transcript', config.showTranscript);
    
    document.body.appendChild(widget);
    return widget;
  }

  // Inject custom elements into widget
  function injectCustomElements() {
    const hasCustomizations = config.logo || config.footer;
    if (!hasCustomizations) return;

    // Use MutationObserver to wait for widget to render
    const observer = new MutationObserver(function(mutations, obs) {
      // Try to find the widget's shadow root or inner container
      const widget = document.querySelector('vapi-widget');
      if (!widget) return;

      // Check if widget has rendered (has shadow root or children)
      const shadowRoot = widget.shadowRoot;
      
      if (shadowRoot) {
        // Widget uses Shadow DOM
        injectIntoShadowDOM(shadowRoot);
        obs.disconnect();
      } else {
        // Try to find inner elements directly
        const innerContainer = widget.querySelector('[class*="container"], [class*="wrapper"], [class*="chat"]');
        if (innerContainer) {
          injectIntoLightDOM(widget);
          obs.disconnect();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also try after a delay as fallback
    setTimeout(() => {
      observer.disconnect();
      tryInjectCustomElements();
    }, 2000);
  }

  function injectIntoShadowDOM(shadowRoot) {
    // Inject styles into shadow DOM
    const style = document.createElement('style');
    style.textContent = getInlineStyles();
    shadowRoot.appendChild(style);

    // Find header area and inject logo
    if (config.logo) {
      const headerSelectors = [
        '[class*="header"]',
        '[class*="Header"]',
        '[class*="title"]',
        '[class*="top"]'
      ];
      
      for (const selector of headerSelectors) {
        const header = shadowRoot.querySelector(selector);
        if (header) {
          injectLogoIntoHeader(header);
          break;
        }
      }
    }

    // Find or create footer area
    if (config.footer) {
      const containerSelectors = [
        '[class*="container"]',
        '[class*="wrapper"]',
        '[class*="chat"]',
        '[class*="widget"]'
      ];
      
      for (const selector of containerSelectors) {
        const container = shadowRoot.querySelector(selector);
        if (container) {
          injectFooter(container);
          break;
        }
      }
    }
  }

  function injectIntoLightDOM(widget) {
    // For widgets without Shadow DOM
    if (config.logo) {
      const header = widget.querySelector('[class*="header"], [class*="Header"]');
      if (header) {
        injectLogoIntoHeader(header);
      }
    }

    if (config.footer) {
      injectFooter(widget);
    }
  }

  function tryInjectCustomElements() {
    const widget = document.querySelector('vapi-widget');
    if (!widget) return;

    // Try shadow root first
    if (widget.shadowRoot) {
      injectIntoShadowDOM(widget.shadowRoot);
    } else {
      // Fallback: create overlay elements
      createOverlayCustomizations(widget);
    }
  }

  function createOverlayCustomizations(widget) {
    // Create custom header overlay
    if (config.logo || config.headerTitle) {
      // We'll inject after widget is fully loaded
      const checkInterval = setInterval(() => {
        const widgetRect = widget.getBoundingClientRect();
        if (widgetRect.width > 0 && widgetRect.height > 0) {
          clearInterval(checkInterval);
          
          // Widget is visible, try to find and modify its internal structure
          observeWidgetContent(widget);
        }
      }, 100);

      // Clear interval after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);
    }
  }

  function observeWidgetContent(widget) {
    // Deep observation for dynamic content
    const deepObserver = new MutationObserver(() => {
      // Look for any chat container that appears
      const chatContainers = document.querySelectorAll('[class*="chat"], [class*="Chat"], [class*="widget"], [class*="Widget"]');
      
      chatContainers.forEach(container => {
        if (container.closest('vapi-widget') && !container.dataset.customized) {
          container.dataset.customized = 'true';
          
          // Try to inject into this container
          if (config.logo) {
            const header = container.querySelector('[class*="header"], [class*="Header"]');
            if (header && !header.querySelector('.vapi-custom-logo')) {
              injectLogoIntoHeader(header);
            }
          }
          
          if (config.footer && !container.querySelector('.vapi-custom-footer')) {
            injectFooter(container);
          }
        }
      });
    });

    deepObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // Stop observing after 30 seconds
    setTimeout(() => deepObserver.disconnect(), 30000);
  }

  function injectLogoIntoHeader(header) {
    if (!config.logo || header.querySelector('.vapi-custom-logo')) return;

    const logoImg = document.createElement('img');
    logoImg.className = 'vapi-custom-logo';
    logoImg.src = config.logo;
    logoImg.alt = config.logoAlt;
    logoImg.style.cssText = `
      width: ${config.logoSize}px !important;
      height: ${config.logoSize}px !important;
      object-fit: contain !important;
      border-radius: 6px !important;
      margin-right: 8px !important;
    `;

    // Insert logo at the beginning of header
    header.insertBefore(logoImg, header.firstChild);
  }

  function injectFooter(container) {
    if (!config.footer || container.querySelector('.vapi-custom-footer')) return;

    const footer = document.createElement('div');
    footer.className = 'vapi-custom-footer';
    
    const isDark = config.theme === 'dark';
    footer.style.cssText = `
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 8px 16px !important;
      background: ${isDark ? '#1a1a2e' : '#f9fafb'} !important;
      border-top: 1px solid ${isDark ? '#2d2d44' : '#e5e7eb'} !important;
      font-size: 12px !important;
      color: ${isDark ? '#9ca3af' : '#6b7280'} !important;
      position: relative !important;
      z-index: 10 !important;
    `;

    if (config.footerLink && config.footerLinkText) {
      footer.innerHTML = `${config.footer} <a href="${config.footerLink}" target="_blank" rel="noopener">${config.footerLinkText}</a>`;
    } else {
      footer.textContent = config.footer;
    }

    container.appendChild(footer);
  }

  function getInlineStyles() {
    const primaryColor = config.accentColor || '#14B8A6';
    const isDark = config.theme === 'dark';
    
    return `
      .vapi-custom-logo {
        width: ${config.logoSize}px !important;
        height: ${config.logoSize}px !important;
        object-fit: contain !important;
        border-radius: 6px !important;
        margin-right: 8px !important;
      }
      
      .vapi-custom-footer {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 8px 16px !important;
        background: ${isDark ? '#1a1a2e' : '#f9fafb'} !important;
        border-top: 1px solid ${isDark ? '#2d2d44' : '#e5e7eb'} !important;
        font-size: 12px !important;
        color: ${isDark ? '#9ca3af' : '#6b7280'} !important;
      }
      
      .vapi-custom-footer a {
        color: ${primaryColor} !important;
        text-decoration: none !important;
        margin-left: 4px !important;
      }
    `;
  }

  // Load VAPI widget script
  function loadVapiScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Initialize
  async function init() {
    try {
      // Validate required config
      if (!config.publicKey) {
        console.error('VAPI Custom Widget: data-public-key is required');
        return;
      }
      if (!config.assistantId) {
        console.error('VAPI Custom Widget: data-assistant-id is required');
        return;
      }

      // Inject custom styles
      injectStyles();
      
      // Load VAPI script
      await loadVapiScript();
      
      // Wait a bit for VAPI to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create widget
      createVapiWidget();
      
      // Inject custom elements (logo, footer)
      injectCustomElements();
      
      console.log('VAPI Custom Widget initialized');
    } catch (error) {
      console.error('VAPI Custom Widget error:', error);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
