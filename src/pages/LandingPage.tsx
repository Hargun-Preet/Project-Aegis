import React, { useEffect } from 'react';
import { Shield, Lock, Key, FileText, Zap, Eye, Server, Globe, ArrowRight, Code, ArrowDown, CheckCircle } from 'lucide-react';

// Main Landing Page Component
export const LandingPage = () => {
  // Effect to handle scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <>
      {/* Custom Styles and Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        .gradient-text {
          background: linear-gradient(90deg, #00C6FF, #0072FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }

        .hero-bg {
          background-color: #05070D;
          background-image:
            radial-gradient(at 20% 25%, hsla(212, 90%, 25%, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 20%, hsla(288, 70%, 30%, 0.25) 0px, transparent 50%),
            radial-gradient(at 50% 80%, hsla(190, 85%, 40%, 0.2) 0px, transparent 50%);
          position: relative;
          overflow: hidden;
        }

        .hero-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 L50 0 L100 50 L50 100 Z' fill='none' stroke='%23101827' stroke-width='0.5'/%3E%3C/svg%3E");
          background-size: 20px 20px;
          opacity: 0.1;
          animation: pan 60s linear infinite;
        }
        
        @keyframes pan {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
        }

        .cta-button {
          background: linear-gradient(90deg, #00C6FF, #0072FF);
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 198, 255, 0.3), 0 0 25px rgba(0, 114, 255, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(0, 198, 255, 0.5), 0 0 40px rgba(0, 114, 255, 0.3);
        }
        
        .secondary-button {
            border: 1px solid #273142;
            transition: all 0.3s ease;
        }
        
        .secondary-button:hover {
            background-color: #111927;
            border-color: #00A2FF;
        }

        .feature-card {
          background: rgba(14, 22, 39, 0.6);
          border: 1px solid #273142;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: #00A2FF;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .fade-in-up {
            opacity: 1;
            transform: translateY(0);
        }
        
      `}</style>

      <div className="bg-[#05070D] text-gray-200">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#05070D]/80 backdrop-blur-sm border-b border-gray-800/50">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <Shield className="w-7 h-7 text-[#00C6FF]" />
              <span className="text-2xl font-bold text-white">Aegis</span>
            </a>
            <div className="hidden md:flex items-center space-x-8 text-gray-300">
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#howitworks" className="hover:text-white transition-colors">How It Works</a>
                <a href="#trust" className="hover:text-white transition-colors">Trust</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/auth" className="text-gray-300 hover:text-white transition-colors hidden sm:block">
                Sign In
              </a>
              <a href="/auth" className="px-5 py-2.5 cta-button text-white font-semibold rounded-lg">
                Get Started
              </a>
            </div>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section className="hero-bg pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="max-w-4xl mx-auto text-center px-6">
              <div className="inline-block bg-gray-800/50 text-sm px-4 py-1.5 rounded-full border border-gray-700 mb-6">
                <span className="gradient-text font-medium">Zero-Knowledge. Maximum Security.</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Your Impenetrable Digital Vault
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Aegis provides ultimate peace of mind with military-grade, client-side encryption. Your files are for your eyes only. Always.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/auth" className="z-10 px-8 py-4 cta-button text-white font-bold text-lg rounded-lg inline-flex items-center justify-center">
                  Secure My Files Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a href="#features" className="z-10 px-8 py-4 secondary-button font-semibold rounded-lg">
                  Explore Features
                </a>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 md:py-28 bg-[#0A101C]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                 <h2 className="text-4xl md:text-5xl font-bold text-white animate-on-scroll">
                  Security You Can <span className="gradient-text">Actually</span> Trust
                </h2>
                <p className="mt-4 text-gray-400 text-lg animate-on-scroll" style={{transitionDelay: '100ms'}}>
                  Aegis is built on a foundation of cutting-edge cryptographic principles to ensure your data is never compromised.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Lock, title: "AES-256-GCM Encryption", description: "Each file is encrypted with a randomly generated AES-256 key. GCM mode provides both confidentiality and authenticity." },
                  { icon: Key, title: "RSA Key Management", description: "Generate or provide your RSA-2048 key pair in HEX format. The public key encrypts the file key; the private key never leaves your device." },
                  { icon: FileText, title: "SHA-256 File Integrity", description: "A SHA-256 hash digest is calculated for each file and encrypted along with it, guaranteeing your data is never tampered with." },
                  { icon: Zap, title: "Client-Side Performance", description: "All cryptographic operations run directly in your browser, leveraging the WebCrypto API for hardware-accelerated speeds." }
                ].map((feature, index) => (
                    <div key={index} className="feature-card p-6 rounded-xl animate-on-scroll" style={{transitionDelay: `${100 * (index+1)}ms`}}>
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-5 border border-blue-400/20">
                          <feature.icon className="w-6 h-6 text-[#00C6FF]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

            {/* How It Works Section */}
            <section id="howitworks" className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white animate-on-scroll">
                            The <span className="gradient-text">Zero-Knowledge</span> Process
                        </h2>
                        <p className="mt-4 text-gray-400 text-lg animate-on-scroll" style={{transitionDelay: '100ms'}}>
                            Your data is encrypted and decrypted entirely on your device. We never have access to your keys or original files.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Step-by-step description */}
                        <div className="space-y-8">
                            {[
                                { 
                                    icon: Key, 
                                    title: "1. Provide Your Public Key", 
                                    description: "Generate a new RSA-2048 key pair or paste your existing public key in HEX format. Your public key can be safely stored, but your private key never leaves your computer." 
                                },
                                { 
                                    icon: Lock, 
                                    title: "2. Encrypt File & Hash", 
                                    description: "A unique AES-256 key is randomly generated in-browser. Your file and its SHA-256 hash are then encrypted together using this key with the AES-256-GCM algorithm." 
                                },
                                { 
                                    icon: Shield, 
                                    title: "3. Encrypt the AES Key", 
                                    description: "The unique AES key is then encrypted using your RSA public key. This is the crucial step that ensures only you can ever access the key to decrypt your file." 
                                },
                                { 
                                    icon: Server, 
                                    title: "4. Store Encrypted Blobs", 
                                    description: "The encrypted file (with hash) and the encrypted AES key are sent to the server. Your original data and keys are never seen by us." 
                                },
                                { 
                                    icon: CheckCircle, 
                                    title: "5. Decrypt & Verify", 
                                    description: "On download, your private key decrypts the AES key, which then decrypts the file. The file's hash is re-calculated and verified to ensure 100% integrity." 
                                }
                            ].map((step, index) => (
                                <div key={index} className="flex items-start space-x-4 animate-on-scroll" style={{transitionDelay: `${100 * (index + 1)}ms`}}>
                                    <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                                        <step.icon className="w-6 h-6 text-[#00C6FF]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                                        <p className="text-gray-400 mt-1">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Visual Diagram */}
                        <div className="feature-card rounded-xl p-8 animate-on-scroll" style={{transitionDelay: '500ms'}}>
                            <div className="space-y-6">
                                <div className="text-center">
                                    <FileText className="mx-auto w-8 h-8 text-gray-400"/>
                                    <p className="font-mono text-sm mt-1">YourFile.pdf + SHA-256 Hash</p>
                                </div>
                                <div className="flex justify-center items-center font-mono text-xs text-gray-500">
                                    <ArrowDown className="w-4 h-4 mr-2" /> Encrypt with random AES-256 Key <ArrowDown className="w-4 h-4 ml-2" />
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg text-center border border-gray-700">
                                    <Lock className="mx-auto w-8 h-8 text-green-400"/>
                                    <p className="font-mono text-sm mt-1 text-green-400">EncryptedFile.bin</p>
                                </div>
                                 <div className="flex justify-center items-center font-mono text-xs text-gray-500">
                                    <ArrowDown className="w-4 h-4 mr-2" /> Encrypt AES Key with your RSA Public Key <ArrowDown className="w-4 h-4 ml-2" />
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg text-center border border-gray-700">
                                    <Shield className="mx-auto w-8 h-8 text-[#00C6FF]"/>
                                    <p className="font-mono text-sm mt-1 text-[#00C6FF]">Data Stored on Server</p>
                                    <p className="text-xs text-gray-500 mt-2">(Encrypted File + Encrypted AES Key)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

          {/* Trust & Transparency Section */}
          <section id="trust" className="py-20 md:py-28 bg-[#0A101C]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white animate-on-scroll">
                        Built for <span className="gradient-text">Transparency</span>
                    </h2>
                    <p className="mt-4 text-gray-400 text-lg animate-on-scroll" style={{transitionDelay: '100ms'}}>
                       Your privacy isn't a feature; it's our entire foundation. We believe in building trust through transparent practices.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { icon: Eye, title: "Zero Tracking", description: "We don't use invasive analytics or track your activity. Your business is your own." },
                        { icon: Server, title: "No Key Storage", description: "Your private key is never sent to or stored on our servers, ensuring only you can decrypt your data." },
                        { icon: Code, title: "Open Source Core", description: "Our core cryptographic libraries are open source. Verify our code and trust our process." }
                    ].map((item, index) => (
                        <div key={index} className="text-center p-8 feature-card rounded-xl animate-on-scroll" style={{transitionDelay: `${100 * (index+1)}ms`}}>
                            <div className="inline-block p-4 bg-blue-500/10 rounded-full border border-blue-400/20 mb-4">
                               <item.icon className="w-8 h-8 text-[#00C6FF]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 md:py-28">
            <div className="max-w-4xl mx-auto text-center px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-on-scroll">
                    Ready to Reclaim Your Privacy?
                </h2>
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-on-scroll" style={{transitionDelay: '100ms'}}>
                    Create your free Aegis vault today and experience a new standard of digital security. No credit card required.
                </p>
                <div className="animate-on-scroll" style={{transitionDelay: '200ms'}}>
                    <a href="/auth" className="px-10 py-5 cta-button text-white font-bold text-xl rounded-lg inline-flex items-center justify-center">
                        <Lock className="w-6 h-6 mr-3" />
                        Get Started for Free
                    </a>
                </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-400">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <Shield className="w-6 h-6 text-[#00C6FF]" />
                    <span className="text-xl font-bold text-white">Aegis</span>
                </div>
                <p>&copy; {new Date().getFullYear()} Aegis Security. All Rights Reserved.</p>
                <p className="text-sm text-gray-500 mt-2">Military-grade encryption for everyone.</p>
            </div>
        </footer>
      </div>
    </>
  );
};

