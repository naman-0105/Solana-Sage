import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Zap, Shield, Sparkles, Github, ExternalLink, Linkedin } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  useEffect(() => {
    setMounted(true);

    const text = 'Create a token swap program with liquidity pools';
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setTerminalText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/newchat', {
        method: 'POST',
      });
      const data = await response.json();
      router.push(`/chat?chatId=${data.chatId}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Natural Language to Code",
      description: "Transform your ideas into production-ready Anchor smart contracts using plain English."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate, iterate, and deploy Solana programs in minutes, not hours."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security First",
      description: "Built-in best practices and security patterns for robust smart contract development."
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md shadow-md border-b border-gray-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">

      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-inner">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
          Solana Sage
        </span>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
          About
        </a>
        <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
          Features
        </a>
        <Button
          onClick={() => window.open('https://www.linkedin.com/in/naman-goyal-a24283276/', '_blank')}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white transition-all duration-200"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </Button>
      </nav>

    </div>
  </div>
</header>


        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 animate-pulse">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by AI
              </span>
            </div>
            
            <h1 className="text-6xl md:text-6xl font-bold mb-6 leading-tight">
            Learn. Build. Ship.
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                -with AI for Solana
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your blockchain ideas into production-ready Anchor smart contracts using AI. 
              No complex syntax, no steep learning curves—just describe what you want to build.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                onClick={handleNewChat}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg group relative overflow-hidden shadow-lg hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Start Building
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>

            <div className="mb-16 max-w-4xl mx-auto">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-left relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 text-gray-400 text-sm font-mono">solana-sage-terminal</div>
                </div>
                
                <div className="space-y-3 text-sm font-mono">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">$</span>
                    <span className="text-white">{terminalText}</span>
                    <span className="animate-pulse text-white">|</span>
                  </div>
                  <div className="text-purple-400 ml-4">✨ Analyzing requirements...</div>
                  <div className="text-blue-400 ml-4">🔧 Generating Anchor program...</div>
                  <div className="text-green-400 ml-4">✅ Smart contract ready!</div>
                  
                  <div className="mt-6 bg-black/50 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-500 text-xs mb-2">Generated: TokenSwap.rs</div>
                    <div className="space-y-1 text-xs">
                      <div><span className="text-purple-400">#[program]</span></div>
                      <div><span className="text-blue-400">pub mod</span> <span className="text-yellow-400">token_swap</span> <span className="text-white"></span></div>
                      <div className="ml-4"><span className="text-green-400">// Liquidity pool implementation</span></div>
                      <div className="ml-4"><span className="text-blue-400">pub fn</span> <span className="text-yellow-400">swap</span><span className="text-white">(ctx: Context&lt;Swap&gt;) -&gt; Result&lt;()&gt; </span></div>
                      <div className="ml-8 text-gray-400">...</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating particles */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75 animation-delay-1000"></div>
                  <div className="absolute bottom-6 left-12 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75 animation-delay-2000"></div>
                </div>
              </div>
            </div>

            {/* Floating Code Snippets */}
            <div className="relative mb-16">
              <div className="absolute -left-4 top-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-left transform -rotate-3 hover:rotate-0 transition-transform duration-300 hover:scale-105">
                <div className="text-purple-400">#[derive(Accounts)]</div>
                <div className="text-blue-400">struct Initialize&lt;&apos;info&gt;</div>
              </div>
              
              <div className="absolute -right-4 top-12 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-left transform rotate-2 hover:rotate-0 transition-transform duration-300 hover:scale-105">
                <div className="text-green-400">// Auto-generated tests</div>
                <div className="text-yellow-400">assert_eq!(result, expected)</div>
              </div>
              
              <div className="absolute left-8 bottom-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-left transform rotate-1 hover:rotate-0 transition-transform duration-300 hover:scale-105">
                <div className="text-pink-400">pub fn transfer</div>
                <div className="text-gray-400 ml-2">amount: u64</div>
              </div>
            </div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 border border-purple-500/20 rounded-full animate-spin-slow"></div>
          <div className="absolute top-40 right-20 w-12 h-12 border border-blue-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-bounce"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Everything you need to build on
                <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Solana
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                From concept to deployment, Solana Sage provides the tools and intelligence to bring your blockchain ideas to life.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Preview Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">See it in action</h2>
              <p className="text-xl text-gray-400">From natural language to production-ready code</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-400">Natural Language Input</span>
                  </div>
                  <p className="text-gray-300 italic">
                    "Create a token minting program that allows only the owner to mint tokens with a maximum supply of 1 million"
                  </p>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-purple-400" />
                </div>

                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-400">Generated Anchor Code</span>
                  </div>
                  <div className="text-sm text-gray-300 font-mono bg-black/50 p-4 rounded-lg overflow-x-auto">
                    <div className="text-purple-400">#[program]</div>
                    <div className="text-blue-400">pub mod token_mint </div>
                    <div className="ml-4 text-gray-300">use super::*;</div>
                    <div className="ml-4 text-green-400">// Generated with security best practices</div>
                    <div className="text-gray-500">...</div>
                  </div>
                </div>
              </div>

              <div className="lg:text-right">
                <h3 className="text-2xl font-bold mb-6">
                  Production-ready code in seconds
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Our AI understands Solana's architecture, security patterns, and best practices. 
                  Get fully documented, tested, and deployment-ready smart contracts that follow industry standards.
                </p>
                <Button 
                  onClick={handleNewChat}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Try it now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-12">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to build the future?
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who are already building on Solana with AI assistance. 
                  Start your journey today—no credit card required.
                </p>
                <Button 
                  onClick={handleNewChat}
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Solana Sage
                </span>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="https://www.linkedin.com/in/naman-goyal-a24283276/" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <span className="text-gray-500 text-sm">
                  © 2025 Solana Sage. Built with Next.js & AI.
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}