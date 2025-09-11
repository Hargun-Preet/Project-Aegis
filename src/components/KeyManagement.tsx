import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, X, Zap } from 'lucide-react';
import { CryptoUtils } from '../lib/crypto';
import { StorageUtils } from '../lib/storage';

interface KeyManagementProps {
  onPublicKeyReady: (publicKey: string) => void;
}

export const KeyManagement: React.FC<KeyManagementProps> = ({ onPublicKeyReady }) => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [importPublicKey, setImportPublicKey] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);

  useEffect(() => {
    // Check if public key exists in storage
    const storedPublicKey = StorageUtils.getPublicKey();
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
      onPublicKeyReady(storedPublicKey);
    }
  }, [onPublicKeyReady]);

  const generateKeyPair = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await CryptoUtils.generateRSAKeyPair();
      if (result.success) {
        setPublicKey(result.data.publicKey);
        setPrivateKey(result.data.privateKey);
        setShowGenerated(true);
        setMessage('RSA key pair generated successfully!');
        
        // Store public key
        StorageUtils.storePublicKey(result.data.publicKey);
        onPublicKeyReady(result.data.publicKey);
      } else {
        setMessage(result.error || 'Failed to generate key pair');
      }
    } catch (error) {
      setMessage('Error generating key pair');
    } finally {
      setLoading(false);
    }
  };

  const importPublicKeyHandler = () => {
    if (!importPublicKey.trim()) {
      setMessage('Please enter a public key');
      return;
    }

    try {
      // Basic validation - check if it's a valid hex string
      if (!/^[a-fA-F0-9]+$/.test(importPublicKey.trim())) {
        setMessage('Invalid HEX format for public key');
        return;
      }

      StorageUtils.storePublicKey(importPublicKey.trim());
      setPublicKey(importPublicKey.trim());
      onPublicKeyReady(importPublicKey.trim());
      setImportPublicKey('');
      setMessage('Public key imported successfully!');
    } catch (error) {
      setMessage('Failed to import public key');
    }
  };

  const copyToClipboard = async (text: string, type: 'public' | 'private') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'public') {
        setCopiedPublic(true);
        setTimeout(() => setCopiedPublic(false), 2000);
      } else {
        setCopiedPrivate(true);
        setTimeout(() => setCopiedPrivate(false), 2000);
      }
    } catch (error) {
      setMessage('Failed to copy to clipboard');
    }
  };

  const clearKeys = () => {
    StorageUtils.removePublicKey();
    setPublicKey('');
    setPrivateKey('');
    setShowGenerated(false);
    setMessage('Keys cleared successfully');
    onPublicKeyReady('');
  };

  return (
    <div className="space-y-6">
      {!publicKey ? (
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={generateKeyPair}
              disabled={loading}
              className="w-full glow-button text-black font-bold py-4 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Keys...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generate New Key Pair</span>
                </>
              )}
            </button>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4 neon-text">Import Existing Public Key</h3>
            <div className="space-y-4">
              <textarea
                value={importPublicKey}
                onChange={(e) => setImportPublicKey(e.target.value)}
                placeholder="Paste your RSA public key in HEX format here..."
                className="w-full h-32 p-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                onClick={importPublicKeyHandler}
                className="w-full bg-green-600/20 border border-green-500/30 text-green-400 font-medium py-3 px-4 rounded-lg hover:bg-green-600/30 transition-colors duration-200"
              >
                Import Public Key
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="neon-text-green font-medium">✓ Public Key Active</span>
            <button
              onClick={clearKeys}
              className="text-red-400 hover:text-red-300 font-medium text-sm"
            >
              <X className="w-4 h-4 inline mr-1" />
              Clear Keys
            </button>
          </div>
          
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Public Key (HEX)</label>
              <button
                onClick={() => copyToClipboard(publicKey, 'public')}
                className="neon-text hover:text-cyan-300 text-sm flex items-center"
              >
                {copiedPublic ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-1">{copiedPublic ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-black/50 p-3 rounded text-xs font-mono text-gray-300 break-all max-h-20 overflow-y-auto">
              {publicKey}
            </div>
          </div>
        </div>
      )}

      {showGenerated && privateKey && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-red-400 font-medium">CRITICAL: Save Your Private Key</span>
          </div>
          
          <p className="text-sm text-gray-300 mb-4">
            This is your private key. Save it securely and NEVER share it. It will not be stored by the application.
          </p>
          
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Private Key (HEX)</label>
              <button
                onClick={() => copyToClipboard(privateKey, 'private')}
                className="neon-text hover:text-cyan-300 text-sm flex items-center"
              >
                {copiedPrivate ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-1">{copiedPrivate ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-black/50 p-3 rounded text-xs font-mono text-gray-300 break-all max-h-32 overflow-y-auto">
              {privateKey}
            </div>
          </div>
          
          <button
            onClick={() => setShowGenerated(false)}
            className="mt-4 w-full bg-red-600/20 border border-red-500/30 text-red-400 font-medium py-3 px-4 rounded-lg hover:bg-red-600/30 transition-colors duration-200"
          >
            I've Saved My Private Key
          </button>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.includes('successfully') || message.includes('✓') || message.includes('cleared')
            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
            : 'bg-red-500/10 text-red-400 border border-red-500/30'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};