import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Shield, Files, Key, Upload, Lock } from 'lucide-react';
import { KeyManagement } from '../components/KeyManagement';
import { FileUpload } from '../components/FileUpload';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [publicKey, setPublicKey] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold neon-text">SecureVault</span>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                to="/files"
                className="flex items-center space-x-2 px-4 py-2 bg-transparent border neon-border rounded-lg hover:bg-cyan-400/10 transition-all duration-300"
              >
                <Files className="w-4 h-4" />
                <span>My Files</span>
              </Link>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <span className="text-sm">Welcome, {user.email}</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card neon-border p-6 rounded-xl">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mr-4">
                  <Lock className="w-6 h-6 neon-text" />
                </div>
                <div>
                  <div className="text-2xl font-bold neon-text">AES-256</div>
                  <div className="text-gray-400 text-sm">File Encryption</div>
                </div>
              </div>
            </div>
            
            <div className="glass-card neon-border-green p-6 rounded-xl">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mr-4">
                  <Key className="w-6 h-6 neon-text-green" />
                </div>
                <div>
                  <div className="text-2xl font-bold neon-text-green">RSA-2048</div>
                  <div className="text-gray-400 text-sm">Key Exchange</div>
                </div>
              </div>
            </div>
            
            <div className="glass-card neon-border-purple p-6 rounded-xl">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 neon-text-purple" />
                </div>
                <div>
                  <div className="text-2xl font-bold neon-text-purple">SHA-256</div>
                  <div className="text-gray-400 text-sm">Integrity Check</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* RSA Key Management */}
            <div className="glass-card neon-border rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <Key className="w-6 h-6 neon-text mr-3" />
                <h2 className="text-xl font-bold text-white">RSA Key Generator</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Generate a new RSA key pair for secure encryption. Keep your private key secure!
              </p>
              <KeyManagement onPublicKeyReady={setPublicKey} />
            </div>

            {/* File Encryption */}
            <div className="glass-card neon-border rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 neon-text mr-3" />
                <h2 className="text-xl font-bold text-white">File Encryption</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Drop your file here or click to browse. All encryption happens locally in your browser.
              </p>
              <FileUpload 
                publicKeyHex={publicKey} 
                onUploadComplete={handleUploadComplete}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 glass-card border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-yellow-400 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-400 font-bold text-lg mb-2">🔒 Zero-Knowledge Security</h3>
                <p className="text-gray-300">
                  All cryptographic operations are performed locally in your browser using the WebCrypto API. 
                  Your private keys never leave your device, and our servers only store encrypted data that 
                  cannot be decrypted without your private key. We use military-grade AES-256-GCM encryption 
                  with RSA-2048 key exchange and SHA-256 integrity verification.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};