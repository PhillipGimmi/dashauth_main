(function () {
  'use strict';

  const SCRIPT_VERSION = '1.0.0';
  const HEARTBEAT_INTERVAL = 300000; // 5 minutes

  // Use the same domain as the script for API endpoints
  const SCRIPT_DOMAIN = document.currentScript?.src
    ? new URL(document.currentScript.src).origin
    : 'https://dashauth.com';

  const VERIFY_ENDPOINT = `${SCRIPT_DOMAIN}/api/verify`;
  const HEARTBEAT_ENDPOINT = `${SCRIPT_DOMAIN}/api/heartbeat`;
  const BEACON_ENDPOINT = `${SCRIPT_DOMAIN}/api/beacon`;

  const DashAuth = {
    _scriptElement: null,
    _clientId: null,
    _startTime: Date.now(),
    _maxAttempts: 3,
    _retryInterval: 1000,
    _debug: true,

    // Initialize mutable state BEFORE freezing
    _state: {
      initialized: false,
      verificationAttempts: 0,
      heartbeatInterval: null,
      securityContext: {
        nonce: null,
        lastVerified: null,
        integrityHash: null,
        verificationToken: null,
        https: false,
        protocol: '',
        host: '',
        origin: '',
        environment: 'production',
        timestamp: '',
        userAgent: '',
        secure: false,
      },
    },

    async _validateSecurityContext() {
      const isHttps =
        window.location.protocol === 'https:' || window.location.hostname === 'localhost';

      if (!isHttps) {
        throw new Error('DashAuth requires HTTPS in production');
      }

      try {
        const nonce = await this._generateNonce();
        const integrityHash = await this._calculateIntegrity(this._scriptElement);

        // Update mutable state instead of frozen properties
        this._state.securityContext = {
          ...this._state.securityContext,
          https: isHttps,
          protocol: window.location.protocol,
          host: window.location.host,
          origin: window.location.origin,
          environment: window.location.hostname === 'localhost' ? 'development' : 'production',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          secure: window.isSecureContext,
          nonce,
          integrityHash,
        };

        return true;
      } catch (error) {
        this.logError('Security context validation failed:', error);
        throw new Error(`Failed to validate security context: ${error.message}`);
      }
    },

    async _calculateIntegrity(scriptElement) {
      if (!scriptElement || !scriptElement.src) {
        throw new Error('Invalid script element provided for integrity calculation');
      }

      try {
        const response = await fetch(scriptElement.src);
        if (!response.ok) {
          throw new Error(`Failed to fetch script content: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
          throw new Error('Empty script content received');
        }

        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));

        return Array.from(new Uint8Array(hash))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (error) {
        this.logError('Integrity calculation failed:', error);
        throw new Error(`Failed to calculate script integrity: ${error.message}`);
      }
    },

    async _generateNonce() {
      try {
        const buffer = await crypto.subtle.digest(
          'SHA-256',
          crypto.getRandomValues(new Uint8Array(32))
        );
        return Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (error) {
        this.logError('Nonce generation failed:', error);
        throw new Error(`Failed to generate nonce: ${error.message}`);
      }
    },

    async _verifyWithServer(status = 'verify') {
      this.log(`Attempting ${status} verification...`);
      this.log('Security Context:', this._state.securityContext);

      if (this._state.verificationAttempts >= this._maxAttempts) {
        const error = new Error('Max verification attempts reached');
        this.logWarning(error.message);
        throw error;
      }

      try {
        const endpoint = status === 'heartbeat' ? HEARTBEAT_ENDPOINT : VERIFY_ENDPOINT;
        this.log(`Making request to: ${endpoint}`);

        if (!this._state.securityContext.nonce) {
          throw new Error('Security context nonce is missing');
        }

        const verificationPayload = {
          clientId: this._clientId,
          nonce: this._state.securityContext.nonce,
          timestamp: new Date().toISOString(),
          status: status,
          scriptVersion: SCRIPT_VERSION,
          verificationContext: {
            location: document.currentScript?.parentElement?.tagName.toLowerCase(),
            https: this._state.securityContext.https,
            protocol: this._state.securityContext.protocol,
            origin: this._state.securityContext.origin,
            secure: this._state.securityContext.secure,
            host: this._state.securityContext.host,
            environment: this._state.securityContext.environment,
            integrityHash: this._state.securityContext.integrityHash,
            userAgent: this._state.securityContext.userAgent,
            loadTime: Date.now() - this._startTime,
          },
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-DashAuth-Client': this._clientId,
            'X-DashAuth-Nonce': this._state.securityContext.nonce,
            'X-DashAuth-Version': SCRIPT_VERSION,
          },
          body: JSON.stringify(verificationPayload),
          cache: 'no-store',
          credentials: 'omit',
        });

        if (!response.ok) {
          throw new Error(`Verification request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        this.log('Verification successful:', data);

        // Validate response nonce
        if (!data.nonce || data.nonce !== this._state.securityContext.nonce) {
          throw new Error('Invalid response nonce - potential security breach');
        }

        this._state.securityContext.lastVerified = new Date().toISOString();
        this._state.securityContext.verificationToken = data.verificationToken;

        return data;
      } catch (error) {
        this.logError('Verification failed:', error);
        this._state.verificationAttempts++;

        if (this._state.verificationAttempts < this._maxAttempts) {
          const retryDelay = this._retryInterval * Math.pow(2, this._state.verificationAttempts);
          this.log(`Retrying verification in ${retryDelay}ms...`);

          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return this._verifyWithServer(status);
        }

        throw new Error(
          `Verification failed after ${this._maxAttempts} attempts: ${error.message}`
        );
      }
    },

    async init() {
      this.log('Initializing DashAuth...');

      if (this._state.initialized) {
        this.logWarning('DashAuth is already initialized');
        return true;
      }

      try {
        // Find and validate script element
        this._scriptElement = document.querySelector('script[src*="dashauth.com/secure.js"]');

        if (!this._scriptElement) {
          throw new Error('DashAuth script tag not found on page');
        }

        // Validate client ID
        this._clientId =
          this._scriptElement.getAttribute('data-client-id') || this._scriptElement.id;

        if (!this._clientId?.match(/^[a-f0-9]{64}$/)) {
          throw new Error('Invalid DashAuth client ID format - must be 64 character hex string');
        }

        // Validate security context
        await this._validateSecurityContext();

        // Initial verification
        await this._verifyWithServer('init');

        // Setup heartbeat
        this.log('Setting up heartbeat interval...');
        this._state.heartbeatInterval = setInterval(async () => {
          try {
            this.log('Sending heartbeat...');
            await this._verifyWithServer('heartbeat');
          } catch (error) {
            this.logError('Heartbeat failed:', error);
          }
        }, HEARTBEAT_INTERVAL);

        // Setup unload handler
        window.addEventListener('unload', () => {
          if (navigator.sendBeacon) {
            const unloadData = {
              clientId: this._clientId,
              status: 'unload',
              nonce: this._state.securityContext.nonce,
              timestamp: new Date().toISOString(),
            };

            const blob = new Blob([JSON.stringify(unloadData)], { type: 'application/json' });

            navigator.sendBeacon(BEACON_ENDPOINT, blob);
          }

          // Clear interval on unload
          if (this._state.heartbeatInterval) {
            clearInterval(this._state.heartbeatInterval);
          }
        });

        this._state.initialized = true;
        this.log('DashAuth initialization complete!');
        return true;
      } catch (error) {
        this.logError('DashAuth initialization failed:', error);

        try {
          await this._verifyWithServer('error');
        } catch (verifyError) {
          this.logError('Failed to report initialization error:', verifyError);
        }

        return false;
      }
    },

    log(...args) {
      if (this._debug) {
        console.log('🔒 DashAuth:', ...args);
      }
    },

    logError(...args) {
      console.error('❌ DashAuth:', ...args);
    },

    logWarning(...args) {
      console.warn('⚠️ DashAuth:', ...args);
    },
  };

  // Initialize with error handling
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => DashAuth.init());
    } else {
      DashAuth.init();
    }
  } catch (error) {
    console.error('DashAuth fatal error:', error);
  }

  // Initialize before freezing
  DashAuth._state.verificationAttempts = 0;
  DashAuth._state.initialized = false;

  // Now freeze
  Object.defineProperty(window, 'DashAuth', {
    value: Object.freeze(DashAuth),
    writable: false,
    configurable: false,
  });
})();
