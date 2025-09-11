import type { RSAKeyPair, CryptoResult } from '../types';

export class CryptoUtils {
  // Convert ArrayBuffer to HEX string
  static arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Convert HEX string to ArrayBuffer
  static hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }

  // Generate RSA key pair
  static async generateRSAKeyPair(): Promise<CryptoResult> {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      return {
        success: true,
        data: {
          publicKey: this.arrayBufferToHex(publicKeyBuffer),
          privateKey: this.arrayBufferToHex(privateKeyBuffer)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate RSA key pair: ${error}`
      };
    }
  }

  // Import RSA public key from HEX
  static async importRSAPublicKey(hexKey: string): Promise<CryptoResult> {
    try {
      const keyBuffer = this.hexToArrayBuffer(hexKey);
      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        keyBuffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['encrypt']
      );

      return { success: true, data: publicKey };
    } catch (error) {
      return {
        success: false,
        error: `Failed to import RSA public key: ${error}`
      };
    }
  }

  // Import RSA private key from HEX
  static async importRSAPrivateKey(hexKey: string): Promise<CryptoResult> {
    try {
      const keyBuffer = this.hexToArrayBuffer(hexKey);
      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        keyBuffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['decrypt']
      );

      return { success: true, data: privateKey };
    } catch (error) {
      return {
        success: false,
        error: `Failed to import RSA private key: ${error}`
      };
    }
  }

  // Generate random AES-256 key
  static async generateAESKey(): Promise<CryptoResult> {
    try {
      const aesKey = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );

      return { success: true, data: aesKey };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate AES key: ${error}`
      };
    }
  }

  // Calculate SHA-256 hash of file
  static async calculateSHA256(file: ArrayBuffer): Promise<CryptoResult> {
    try {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', file);
      const hashHex = this.arrayBufferToHex(hashBuffer);
      return { success: true, data: hashHex };
    } catch (error) {
      return {
        success: false,
        error: `Failed to calculate SHA-256: ${error}`
      };
    }
  }

  // Encrypt file content with AES-GCM
  static async encryptFileContent(file: ArrayBuffer, hash: string, aesKey: CryptoKey): Promise<CryptoResult> {
    try {
      // Combine file content with hash
      const hashBytes = new TextEncoder().encode(hash);
      const combined = new Uint8Array(file.byteLength + hashBytes.length + 4);
      
      // Store hash length first (4 bytes)
      const hashLengthView = new DataView(combined.buffer, 0, 4);
      hashLengthView.setUint32(0, hashBytes.length);
      
      // Store hash
      combined.set(hashBytes, 4);
      
      // Store file content
      combined.set(new Uint8Array(file), 4 + hashBytes.length);

      // Generate IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Encrypt
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        aesKey,
        combined
      );

      // Combine IV and encrypted data
      const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      result.set(iv, 0);
      result.set(new Uint8Array(encryptedBuffer), iv.length);

      return { success: true, data: btoa(String.fromCharCode(...result)) };
    } catch (error) {
      return {
        success: false,
        error: `Failed to encrypt file: ${error}`
      };
    }
  }

  // Decrypt file content with AES-GCM
  static async decryptFileContent(encryptedData: string, aesKey: CryptoKey): Promise<CryptoResult> {
    try {
      // Decode base64
      const encryptedBytes = new Uint8Array(
        atob(encryptedData).split('').map(c => c.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = encryptedBytes.slice(0, 12);
      const encrypted = encryptedBytes.slice(12);

      // Decrypt
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        aesKey,
        encrypted
      );

      // Extract hash and file content
      const decrypted = new Uint8Array(decryptedBuffer);
      const hashLengthView = new DataView(decryptedBuffer, 0, 4);
      const hashLength = hashLengthView.getUint32(0);
      
      const hashBytes = decrypted.slice(4, 4 + hashLength);
      const fileContent = decrypted.slice(4 + hashLength);
      
      const hash = new TextDecoder().decode(hashBytes);

      return {
        success: true,
        data: {
          fileContent: fileContent.buffer,
          hash: hash
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to decrypt file: ${error}`
      };
    }
  }

  // Encrypt AES key with RSA public key
  static async encryptAESKey(aesKey: CryptoKey, rsaPublicKey: CryptoKey): Promise<CryptoResult> {
    try {
      const keyBuffer = await window.crypto.subtle.exportKey('raw', aesKey);
      const encryptedKey = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        rsaPublicKey,
        keyBuffer
      );

      return { success: true, data: this.arrayBufferToHex(encryptedKey) };
    } catch (error) {
      return {
        success: false,
        error: `Failed to encrypt AES key: ${error}`
      };
    }
  }

  // Decrypt AES key with RSA private key
  static async decryptAESKey(encryptedKeyHex: string, rsaPrivateKey: CryptoKey): Promise<CryptoResult> {
    try {
      const encryptedKey = this.hexToArrayBuffer(encryptedKeyHex);
      const keyBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        rsaPrivateKey,
        encryptedKey
      );

      const aesKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      return { success: true, data: aesKey };
    } catch (error) {
      return {
        success: false,
        error: `Failed to decrypt AES key: ${error}`
      };
    }
  }
}