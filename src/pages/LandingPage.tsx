import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Key, FileText, Zap, Eye, Server, Globe } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-20"></div>
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold neon-text">SecureVault</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/auth" 
              className="px-6 py-2 bg-transparent border neon-border rounded-lg hover:bg-cyan-400/10 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link 
              to="/auth" 
              className="px-6 py-2 glow-button text-black font-semibold rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mb-6">
              <Lock className="w-10 h-10 text-black" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            SECURE VAULT
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Military-grade client-side encryption for your most sensitive files. 
            <span className="neon-text"> Zero-knowledge architecture</span> ensures complete privacy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              to="/auth" 
              className="px-8 py-4 glow-button text-black font-bold text-lg rounded-lg inline-flex items-center justify-center"
            >
              <Shield className="w-5 h-5 mr-2" />
              Start Encrypting
            </Link>
            <button className="px-8 py-4 bg-transparent border neon-border rounded-lg hover:bg-cyan-400/10 transition-all duration-300 font-semibold">
              Learn More
            </button>
          </div>

          {/* Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card neon-border p-6 rounded-xl">
              <div className="text-3xl font-bold neon-text mb-2">AES-256</div>
              <div className="text-gray-400">Military-Grade Encryption</div>
            </div>
            <div className="glass-card neon-border-green p-6 rounded-xl">
              <div className="text-3xl font-bold neon-text-green mb-2">RSA-2048</div>
              <div className="text-gray-400">Key Exchange Security</div>
            </div>
            <div className="glass-card neon-border-purple p-6 rounded-xl">
              <div className="text-3xl font-bold neon-text-purple mb-2">SHA-256</div>
              <div className="text-gray-400">Integrity Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text">
            Unbreakable Security Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card neon-border p-6 rounded-xl hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 neon-text" />
              </div>
              <h3 className="text-xl font-bold mb-3 neon-text">Client-Side Encryption</h3>
              <p className="text-gray-400">All encryption happens in your browser. Your keys never leave your device.</p>
            </div>
            
            <div className="glass-card neon-border-green p-6 rounded-xl hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                <Key className="w-6 h-6 neon-text-green" />
              </div>
              <h3 className="text-xl font-bold mb-3 neon-text-green">RSA Key Management</h3>
              <p className="text-gray-400">Generate or import RSA key pairs with secure HEX format storage.</p>
            </div>
            
            <div className="glass-card neon-border-purple p-6 rounded-xl hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 neon-text-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3 neon-text-purple">File Integrity</h3>
              <p className="text-gray-400">SHA-256 hashing ensures your files remain uncorrupted and authentic.</p>
            </div>
            
            <div className="glass-card neon-border p-6 rounded-xl hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 neon-text" />
              </div>
              <h3 className="text-xl font-bold mb-3 neon-text">Lightning Fast</h3>
              <p className="text-gray-400">Optimized WebCrypto API implementation for maximum performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 neon-text">Generate RSA Keys</h3>
                  <p className="text-gray-400">Create a secure RSA-2048 key pair or import your existing keys in HEX format.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-black font-bold">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 neon-text-green">Upload & Encrypt</h3>
                  <p className="text-gray-400">Files are encrypted with AES-256-GCM and integrity-protected with SHA-256 hashing.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-black font-bold">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 neon-text-purple">Secure Storage</h3>
                  <p className="text-gray-400">Only encrypted data is stored on our servers. We never see your original files.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-black font-bold">4</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-pink-400">Decrypt & Download</h3>
                  <p className="text-gray-400">Use your private key to decrypt files with full integrity verification.</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card neon-border p-8 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 neon-text">Zero-Knowledge Architecture</h3>
                <p className="text-gray-400 mb-6">
                  We use a zero-knowledge architecture where your private keys never leave your browser. 
                  Even we cannot access your encrypted files without your private key.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>No Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <Server className="w-4 h-4 mr-1" />
                    <span>No Key Storage</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    <span>Open Source</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text">
            Ready to Secure Your Files?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust SecureVault with their most sensitive data.
          </p>
          <Link 
            to="/auth" 
            className="px-12 py-4 glow-button text-black font-bold text-xl rounded-lg inline-flex items-center justify-center"
          >
            <Lock className="w-6 h-6 mr-3" />
            Start Encrypting Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold neon-text">SecureVault</span>
          </div>
          <p className="text-gray-400">
            Military-grade encryption for everyone. Your privacy is our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};