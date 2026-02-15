
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Zap, Map as MapIcon, Cpu, ArrowRight, ShieldCheck, BarChart3, Globe2, Download, MessageSquare, Move, Book, MousePointer2, AlertTriangle, ChevronRight, Trophy } from 'lucide-react';

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
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">Features</a>
            <a href="#tactics" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">Project Info</a>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-aviation-orange mb-8 shadow-lg shadow-orange-500/5">
            <Trophy size={12} />
            2ND PRIZE WINNER @ TECHNOFEST 2026 // TEAM DAEMONS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 leading-tight">
            Smart Drone Flight <br/> Safety Assistant
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Our project helps drone pilots plan safer flights by checking rules, weather, and restricted zones automatically.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/app')}
              className="w-full md:w-auto px-8 py-4 bg-aviation-orange hover:bg-orange-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl shadow-orange-900/30 ring-1 ring-white/20"
            >
              <Plane className="transform -rotate-45" />
              Launch App
            </button>
            <a 
              href="#tactics"
              className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold transition-all hover:text-white"
            >
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* Stats Divider */}
      <div className="border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <div className="text-3xl font-bold text-white mb-1">SMART</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Risk Checking</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-white mb-1">EASY</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Path Planning</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-white mb-1">AI HELP</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Gemini Powered</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-white mb-1">WINNER</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">TechnoFest 2026</div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-32 relative border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What we built</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We combined map technology with AI to make drone flying easier for everyone.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare className="text-aviation-orange" />}
              title="AI Helper"
              desc="Ask our built-in assistant about your flight plan. It's powered by Gemini AI to give you real answers."
            />
            <FeatureCard 
              icon={<Move className="text-blue-400" />}
              title="Easy Maps"
              desc="Just click and drag on the map to create your flight path. We automatically calculate risks while you draw."
            />
            <FeatureCard 
              icon={<Download className="text-emerald-400" />}
              title="Export Files"
              desc="Download your flight plan as GPX or KML files so you can use them in other drone software."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-red-400" />}
              title="History"
              desc="Save your best flight routes and see how safe they were in our history section."
            />
            <FeatureCard 
              icon={<Globe2 className="text-cyan-400" />}
              title="Weather Link"
              desc="We connect to live weather data to tell you if the wind is too strong for your drone model."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-purple-400" />}
              title="Simulations"
              desc="Watch a virtual drone follow your path to see how much battery you'll need before you fly."
            />
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section id="tactics" className="py-32 relative bg-slate-900/20">
        <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-xl bg-aviation-orange/10 border border-aviation-orange/30 flex items-center justify-center">
                    <Trophy className="text-aviation-orange" size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">TechnoFest 2026 Submission</h2>
                    <p className="text-slate-400">Created by Team Daemons (Junior Category - Non-BAASC Schools)</p>
                </div>
            </div>

            <div className="space-y-24">
                <DocSection 
                    icon={<Plane size={20} className="text-aviation-orange rotate-[-45deg]" />}
                    title="About AirGuard"
                >
                    <p>
                        AirGuard started as a 24-hour hackathon project to solve a real problem: drone pilots don't always know where it's safe to fly. We built a tool that combines airspace maps, weather info, and AI to give pilots a clear "Go/No-Go" answer.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 my-4 font-mono text-sm text-aviation-orange/80 leading-relaxed shadow-inner">
                        // PROJECT STATUS: COMPLETED<br/>
                        // HACKATHON: TECHNOFEST 2026<br/>
                        // TEAM: TEAM DAEMONS<br/>
                        // RESULT: 2ND PRIZE (JUNIOR CAT)
                    </div>
                </DocSection>

                <DocSection 
                    icon={<MousePointer2 size={20} className="text-blue-400" />}
                    title="How we made it"
                >
                    <p className="mb-4">
                        We used React and Leaflet for the maps, and the Google Gemini API to make our smart assistant. The goal was to make it look professional but also easy for any pilot to use.
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-300">
                        <li><strong>Map Engine:</strong> Uses Leaflet to show restricted zones in red and orange.</li>
                        <li><strong>Math:</strong> We use Turf.js to calculate if your line crosses into an airport zone.</li>
                        <li><strong>AI Command:</strong> We spent a lot of time "prompting" the AI to give helpful safety advice.</li>
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
            <p className="font-mono text-[10px]">&copy; 2026 TEAM DAEMONS // TECHNOFEST HACKATHON SUBMISSION</p>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedLanding;
