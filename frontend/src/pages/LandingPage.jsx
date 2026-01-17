import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Wallet, CreditCard, Mail, Database, Key, Smartphone, Laptop, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import Button from '../components/Button';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('owner'); // 'owner' or 'recipient'
  const navigate = useNavigate();

  const handleOwnerLogin = () => {
    navigate('/login');
  };

  const handleRecipientAccess = () => {
    navigate('/claim');
  };

  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Cryptocurrency Wallets",
      description: "Bitcoin, Ethereum, and other crypto wallets. Secure access to digital assets that can't be recovered without private keys."
    },
    {
      icon: <Laptop className="w-8 h-8" />,
      title: "Device Access",
      description: "Laptops, desktops, and tablets. Ensure your loved ones can access your devices and the memories stored on them."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Phone Passwords",
      description: "iPhone, Android, and mobile device passcodes. Unlock years of photos, messages, and personal data."
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Banking & Financial Accounts",
      description: "Bank accounts, investment portfolios, and financial services. Critical for estate settlement."
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email & Social Media",
      description: "Preserve access to email accounts, social profiles, and digital memories that define your identity."
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Cloud Storage & Photos",
      description: "iCloud, Google Drive, Dropbox. Protect access to cherished photo libraries and personal documents."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Top Banner - LifeKey Branding */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 rounded-xl p-2">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                LifeKey
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-gray-500 text-sm">
              <span>Powered by</span>
              {/* 1Password logo placeholder - replace with actual logo image */}
              <div className="bg-gray-100 rounded px-3 py-1 font-semibold text-gray-700 text-xs">
                1Password
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 max-w-3xl mx-auto leading-relaxed">
              Your <span className="text-primary-600">Digital Identity</span> — 
              Your <span className="text-primary-600">Legacy</span>. 
              <br />Don't let it disappear when you're gone.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
              LifeKey uses <strong>1Password's secure vault technology</strong> with zero-knowledge encryption 
              to ensure your loved ones can access critical accounts and credentials after you pass away — 
              without compromising security while you're alive.
            </p>

            {/* Main CTA Tabs */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-1 inline-flex space-x-2">
                <button
                  onClick={() => setActiveTab('owner')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'owner'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Create Your Digital Will
                </button>
                <button
                  onClick={() => setActiveTab('recipient')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'recipient'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Access Passwords
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-8">
                {activeTab === 'owner' ? (
                  <div className="bg-white rounded-2xl shadow-xl p-8 text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Digital Will</h2>
                    <p className="text-gray-600 mb-6">
                      Set up your digital inheritance plan. Choose which accounts go to which beneficiaries. 
                      All protected with 1Password's battle-tested encryption.
                    </p>
                    <Button onClick={handleOwnerLogin} className="w-full md:w-auto">
                      Get Started
                      <ArrowRight className="w-5 h-5 inline ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-xl p-8 text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Your Assigned Items</h2>
                    <p className="text-gray-600 mb-6">
                      You've been designated as a beneficiary. Use your secure token link to access 
                      the accounts and credentials assigned to you.
                    </p>
                    <Button onClick={handleRecipientAccess} className="w-full md:w-auto">
                      Access Items
                      <ArrowRight className="w-5 h-5 inline ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section - Real Statistics */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">When Digital Lives End, Access Disappears</h2>
          <p className="text-center text-gray-300 mb-12 text-lg">
            Billions in digital assets become permanently inaccessible every year
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">$20B+</div>
              <p className="text-gray-300">in cryptocurrency lost due to lost private keys</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">4B+</div>
              <p className="text-gray-300">iPhones locked with no recovery method</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">Millions</div>
              <p className="text-gray-300">of family memories locked in inaccessible devices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Value Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <h2 className="text-4xl font-bold text-gray-900">More Than Passwords</h2>
              </div>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Your digital identity is <strong>who you are</strong> — photos of family moments, 
                messages with loved ones, financial security for your heirs. These aren't just accounts; 
                they're your legacy.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                When someone passes away, their digital life becomes a locked vault. No "forgot password" button. 
                No customer service to help. Just memories and assets, gone forever.
              </p>
              <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded">
                <p className="text-gray-800 font-medium">
                  "I lost my father's iPhone passcode. Five years of photos and messages — gone."
                </p>
                <p className="text-sm text-gray-600 mt-2">— Real story from a LifeKey user</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your Identity, Protected</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Photos that tell your family's story</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Financial accounts your heirs need</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Digital assets you've built over years</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Messages and memories that define you</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Protect Everything That Matters
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            LifeKey lets you securely delegate access to your most important digital assets using 1Password's trusted security
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1Password Integration Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">Built on 1Password Security</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              1Password is trusted by millions of individuals and thousands of businesses worldwide. 
              LifeKey leverages the same enterprise-grade security architecture that protects Fortune 500 companies.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold mb-2">Zero-Knowledge</div>
                <p className="text-primary-100">We never see your passwords. Ever. Encrypted locally, decrypted on your device.</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Battle-Tested</div>
                <p className="text-primary-100">Same security model used by 1Password, protecting millions of vaults globally.</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Future-Proof</div>
                <p className="text-primary-100">Military-grade encryption that stands the test of time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Benefits */}
      <div className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Security You Can Trust
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Client-side encryption - passwords encrypted before leaving your device</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Key wrapping - decryption keys encrypted specifically for each recipient</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">AI-powered identity verification for security</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Multi-factor verification including death certificates</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Protection</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Signed legal agreements protect all parties</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Immutable audit trail for transparency</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Granular control - assign specific accounts to specific people</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Database breach-proof - even we can't see your passwords</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Don't Let Your Digital Identity Disappear
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Set up your digital will today. Your loved ones will thank you.
          </p>
          <Button
            onClick={handleOwnerLogin}
            variant="secondary"
            className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Create Your Digital Will Now
            <ArrowRight className="w-5 h-5 inline ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-primary-400" />
            <span className="text-xl font-bold text-white">LifeKey</span>
          </div>
          <p>Your digital legacy matters. Secure it today.</p>
          <p className="text-sm mt-2">Powered by 1Password technology</p>
        </div>
      </footer>
    </div>
  );
}
