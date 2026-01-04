// Encryption utilities for secure password storage
class CryptoManager {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
    }

    // Generate encryption key from password
    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: this.algorithm, length: this.keyLength },
            false,
            ['encrypt', 'decrypt']
        );
    }

    // Encrypt data
    async encrypt(data, password = 'default-key') {
        const encoder = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.deriveKey(password, salt);

        const encrypted = await crypto.subtle.encrypt(
            { name: this.algorithm, iv: iv },
            key,
            encoder.encode(JSON.stringify(data))
        );

        // Combine salt + iv + encrypted data
        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);

        return btoa(String.fromCharCode(...combined));
    }

    // Decrypt data
    async decrypt(encryptedData, password = 'default-key') {
        try {
            const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
            const salt = combined.slice(0, 16);
            const iv = combined.slice(16, 28);
            const data = combined.slice(28);

            const key = await this.deriveKey(password, salt);
            const decrypted = await crypto.subtle.decrypt(
                { name: this.algorithm, iv: iv },
                key,
                data
            );

            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(decrypted));
        } catch (e) {
            console.error('Decryption failed:', e);
            return null;
        }
    }

    // Generate secure password
    generatePassword(length = 16, options = {}) {
        const {
            uppercase = true,
            lowercase = true,
            numbers = true,
            symbols = true
        } = options;

        let charset = '';
        if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (numbers) charset += '0123456789';
        if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        const array = new Uint8Array(length);
        crypto.getRandomValues(array);

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        return password;
    }

    // Calculate password strength
    calculateStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 20;
        if (password.length >= 16) strength += 10;
        if (/[a-z]/.test(password)) strength += 10;
        if (/[A-Z]/.test(password)) strength += 10;
        if (/[0-9]/.test(password)) strength += 10;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

        return {
            score: Math.min(strength, 100),
            label: strength < 40 ? 'Weak' : strength < 70 ? 'Medium' : 'Strong',
            color: strength < 40 ? 'red' : strength < 70 ? 'yellow' : 'green'
        };
    }
}

// Export singleton instance
window.cryptoManager = new CryptoManager();
