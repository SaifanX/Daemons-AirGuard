
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Zap, Map as MapIcon, Cpu, ArrowRight, ShieldCheck, BarChart3, Globe2, Download, MessageSquare, Move, Trophy, Github, MousePointer2 } from 'lucide-react';

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-aviation-orange/50 hover:bg-slate-800/50 transition-all duration-500 group">
    <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-200">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const DocSection = ({ icon, title, children }: { icon: React.ReactNode, title: string, children?: React.ReactNode }) => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-800 rounded-lg text-aviation-orange">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
        </div>
        <div className="text-slate-400 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

const UnifiedLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    window.open('https://github.com/SaifanX/Daemons-AirGuard', '_blank');
  };

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-aviation-orange/30 overflow-y-auto scroll-smooth">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-aviation-orange to-orange-600 flex items-center justify-center transition-transform group-hover:rotate-12">
              <Plane className="text-white transform -rotate-45" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight uppercase">AirGuard</span>
          </Link>
          <div className="flex items-center gap-6">
            <a 
              href="#features" 
              onClick={scrollToFeatures}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block"
            >
              Features
            </a>
            <Link 
              to="/hackathon" 
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block"
            >
              TechnoFest 2026
            </Link>
            <Link 
              to="/app"
              className="flex items-center gap-2 text-sm font-bold text-aviation-orange hover:text-orange-400 transition-colors"
            >
              Open App
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Link to="/hackathon" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-aviation-orange mb-8 shadow-lg shadow-orange-500/5 hover:border-aviation-orange transition-colors">
            <Trophy size={12} />
            2ND PRIZE WINNER @ TECHNOFEST 2026 // STONEHILL INTERNATIONAL SCHOOL
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 leading-tight">
            The Award-Winning Drone <br/> Safety Assistant
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the 2nd prize-winning project from <strong>Stonehill International School's TechnoFest 2026</strong>. AirGuard helps drone pilots fly safer with real-time risk assessment and automated rule checks.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/app')}
              className="w-full md:w-auto px-8 py-4 bg-aviation-orange hover:bg-orange-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl shadow-orange-900/30 ring-1 ring-white/20"
            >
              <Plane className="transform -rotate-45" />
              Launch Mission Control
            </button>
            <button 
              onClick={handleLearnMore}
              className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold transition-all hover:text-white flex items-center justify-center gap-2"
            >
              <Github size={18} />
              View Source on GitHub
            </button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-32 relative border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Safety Systems</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Discover the features that secured a top spot at Stonehill's TechnoFest 2026 hackathon.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare className="text-aviation-orange" />}
              title="AI Safety Co-Pilot"
              desc="Powered by Gemini AI, our assistant provides instant safety briefings and helps you navigate local drone rules in Bangalore."
            />
            <FeatureCard 
              icon={<Move className="text-blue-400" />}
              title="Tactical Path Drawing"
              desc="Intuitive map-based mission planning with automatic intersection checks for restricted airspace near airports."
            />
            <FeatureCard 
              icon={<Download className="text-emerald-400" />}
              title="GPX & KML Export"
              desc="Seamlessly export your missions to professional drone flight controllers and software suites."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-red-400" />}
              title="Risk Engine v2"
              desc="Proprietary heuristics that evaluate altitude, distance, and zone violations in accordance with India's Drone Rules 2021."
            />
            <FeatureCard 
              icon={<Globe2 className="text-cyan-400" />}
              title="Live Weather Sync"
              desc="Real-time localized wind speed and visibility data ensuring flight feasibility for your specific drone model."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-purple-400" />}
              title="3D Mission Simulation"
              desc="Preview your entire mission in a simulated environment to estimate battery usage and signal degradation."
            />
          </div>
        </div>
      </section>

      {/* How it's Made Section */}
      <section id="how-it-made" className="py-32 relative bg-slate-900/20">
        <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-xl bg-aviation-orange/10 border border-aviation-orange/30 flex items-center justify-center">
                    <Trophy className="text-aviation-orange" size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">TechnoFest 2026 Submission</h2>
                    <p className="text-slate-400">Winning Project by Team Daemons at Stonehill International School</p>
                </div>
            </div>

            <div className="space-y-24">
                <DocSection 
                    icon={<Plane size={20} className="text-aviation-orange rotate-[-45deg]" />}
                    title="The Vision for AirGuard"
                >
                    <p>
                        AirGuard was developed during a high-stakes 24-hour hackathon to address drone safety in India. By combining interactive maps with intelligent safety logic, we built a tool that empowers hobbyists and professionals alike to fly responsibly.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 my-4 font-mono text-sm text-aviation-orange/80 leading-relaxed shadow-inner">
                        // STATUS: TECHNOFEST 2026 WINNER<br/>
                        // HOST: STONEHILL INTERNATIONAL SCHOOL<br/>
                        // CATEGORY: JUNIOR (STATE LEVEL)<br/>
                        // TECH: REACT + GEMINI AI + LEAFLET
                    </div>
                </DocSection>

                <DocSection 
                    icon={<MousePointer2 size={20} className="text-blue-400" />}
                    title="Our Tech Stack"
                >
                    <p className="mb-4">
                        We prioritized low-latency and high-performance mapping. Our tech choices were optimized for rapid iteration during the Stonehill hackathon.
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-300">
                        <li><strong>Mapping:</strong> Leaflet.js with custom tile layers and Turf.js for geo-spatial analysis.</li>
                        <li><strong>Intelligence:</strong> Google Gemini-3-Flash for lightning-fast AI safety reasoning.</li>
                        <li><strong>UI/UX:</strong> Tailwind CSS and Lucide icons for a tactical, professional mission control feel.</li>
                    </ul>
                </DocSection>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50 text-center text-slate-500 text-sm bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <Plane className="text-slate-600 transform -rotate-45" size={16} />
                <span className="font-bold text-slate-400 tracking-widest uppercase">AirGuard</span>
            </div>
            <p className="font-mono text-[10px]">&copy; 2026 TEAM DAEMONS // STONEHILL TECHNOFEST STATE LEVEL WINNER</p>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedLanding;
