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
    <>
      {/* Consistent styles from other pages */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
        
        body { font-family: 'Inter', sans-serif; }

        .hero-bg {
          background-color: #05070D;
          background-image:
            radial-gradient(at 20% 25%, hsla(212, 90%, 25%, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 20%, hsla(288, 70%, 30%, 0.25) 0px, transparent 50%),
            radial-gradient(at 50% 80%, hsla(190, 85%, 40%, 0.2) 0px, transparent 50%);
        }

        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 L50 0 L100 50 L50 100 Z' fill='none' stroke='%23101827' stroke-width='0.5'/%3E%3C/svg%3E");
          background-size: 20px 20px;
          opacity: 0.1;
          animation: pan 60s linear infinite;
        }

        @keyframes pan {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
        }
        
        .gradient-text {
          background: linear-gradient(90deg, #00C6FF, #0072FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .feature-card {
          background: rgba(14, 22, 39, 0.6);
          border: 1px solid #273142;
          backdrop-filter: blur(10px);
        }
      `}</style>

      <div className="min-h-screen bg-[#0A101C] text-white relative">
        {/* Background */}
        <div className="fixed inset-0 hero-bg"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <header className="z-1000 px-6 py-4 border-b border-gray-800/50 bg-[#0A101C]/80 backdrop-blur-sm top-0">
            <nav className=" max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-7 h-7 text-[#00C6FF]" />
                <span className="text-2xl font-bold text-white">Aegis</span>
              </div>

              <div className="flex items-center space-x-6">
                <Link
                  to="/files"
                  className="flex items-center space-x-2 px-4 py-2 border border-[#273142] rounded-lg hover:bg-[#111927] hover:border-[#00A2FF] transition-all duration-300"
                >
                  <Files className="w-4 h-4" />
                  <span>My Files</span>
                </Link>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <span className="text-sm hidden sm:inline">Welcome, {user.email}</span>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/20 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className='hidden sm:inline'>Sign Out</span>
                </button>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="feature-card p-6 rounded-xl">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4 border border-blue-400/20">
                    <Lock className="w-6 h-6 text-[#00C6FF]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">AES-256</div>
                    <div className="text-gray-400 text-sm">File Encryption</div>
                  </div>
                </div>
              </div>
              
              <div className="feature-card p-6 rounded-xl">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4 border border-blue-400/20">
                    <Key className="w-6 h-6 text-[#00C6FF]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">RSA-2048</div>
                    <div className="text-gray-400 text-sm">Key Exchange</div>
                  </div>
                </div>
              </div>
              
              <div className="feature-card p-6 rounded-xl">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4 border border-blue-400/20">
                    <Shield className="w-6 h-6 text-[#00C6FF]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">SHA-256</div>
                    <div className="text-gray-400 text-sm">Integrity Check</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* RSA Key Management */}
              <div className="feature-card rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <Key className="w-6 h-6 text-[#00C6FF] mr-3" />
                  <h2 className="text-xl font-bold text-white">RSA Key Management</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Generate a new RSA key pair for secure encryption. Keep your private key secure!
                </p>
                <KeyManagement onPublicKeyReady={setPublicKey} />
              </div>

              {/* File Encryption */}
              <div className="feature-card rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <Upload className="w-6 h-6 text-[#00C6FF] mr-3" />
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
            <div className="mt-8 feature-card border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start">
                <Shield className="w-8 h-8 text-yellow-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-500 font-bold text-lg mb-2">Zero-Knowledge Security</h3>
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
    </>
  );
};
