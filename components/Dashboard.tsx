
import React, { useState } from 'react';
import { AppState } from '../types';
import OpportunityCard from './OpportunityCard';
import RoadmapView from './RoadmapView';
import Logo from './Logo';

interface DashboardProps {
  state: AppState;
  onApply: (id: string, url: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
  onToggleFavorite: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onApply, onRefresh, onLogout, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'expiring' | 'applied' | 'roadmap' | 'favorites'>('recommended');

  const filteredOpps = state.opportunities.filter(opp => {
    if (activeTab === 'applied') return state.applications.includes(opp.id);
    if (activeTab === 'favorites') return state.favorites.includes(opp.id);
    if (activeTab === 'expiring') {
        const diff = new Date(opp.deadline).getTime() - new Date().getTime();
        return diff > 0 && diff < (1000 * 3600 * 24 * 7);
    }
    return true;
  });

  const expiringCount = state.opportunities.filter(opp => {
    const diff = new Date(opp.deadline).getTime() - new Date().getTime();
    return diff > 0 && diff < (1000 * 3600 * 24 * 7);
  }).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd]">
      {/* Top Bar Navigation - Optimized for Mobile */}
      <header className="h-16 px-4 md:px-10 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <button 
          onClick={onLogout}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-black text-xl tracking-tighter text-[#3d3028]">kairo</span>
        </div>
        <button 
          onClick={onRefresh}
          disabled={state.isLoading || state.isRoadmapLoading}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90"
        >
          <i className={`fas fa-redo-alt text-lg ${state.isLoading || state.isRoadmapLoading ? 'animate-spin' : ''}`}></i>
        </button>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:flex w-72 bg-white/40 border-r border-slate-100 p-8 sticky top-16 h-[calc(100vh-64px)] flex-col z-40">
          <nav className="space-y-8 flex-1">
            <div>
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Radar</h3>
              <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setActiveTab('recommended')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-soft ${activeTab === 'recommended' ? 'bg-white shadow-sm ring-1 ring-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-compass"></i>
                      <span>Discovery</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('expiring')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-soft ${activeTab === 'expiring' ? 'bg-white shadow-sm ring-1 ring-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-hourglass-half"></i>
                      <span>Upcoming</span>
                    </div>
                    {expiringCount > 0 && (
                      <span className="bg-rose-50 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-rose-500 border border-rose-100">
                        {expiringCount}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('favorites')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-soft ${activeTab === 'favorites' ? 'bg-white shadow-sm ring-1 ring-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-heart"></i>
                      <span>Saved</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-40">{state.favorites.length}</span>
                  </button>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Blueprint</h3>
              <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setActiveTab('roadmap')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-soft ${activeTab === 'roadmap' ? 'bg-white shadow-sm ring-1 ring-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-graduation-cap"></i>
                      <span>Learning Path</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('applied')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-soft ${activeTab === 'applied' ? 'bg-white shadow-sm ring-1 ring-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-clipboard-check"></i>
                      <span>Applied</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-40">{state.applications.length}</span>
                  </button>
              </div>
            </div>
          </nav>

          <div className="mt-auto">
             <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-2xl text-slate-400 font-bold hover:bg-rose-50 hover:text-rose-500 transition-colors flex items-center gap-3">
                <i className="fas fa-sign-out-alt"></i>
                <span>Sign Out</span>
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-10 lg:px-20 py-8 lg:py-12 overflow-y-auto pb-24 lg:pb-12">
          <div className="max-w-3xl mx-auto">
            {/* Primary Goal Hero Card - Compact for Mobile */}
            <div className="bg-[#3d3028] rounded-[32px] md:rounded-[40px] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200 mb-8 lg:mb-12">
              <div className="relative z-10">
                <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3">Primary Goal</p>
                <h2 className="text-2xl md:text-5xl font-black hero-text leading-tight mb-6 md:mb-8">{state.user?.futureGoal}</h2>
                <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Active</span>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-[9px] md:text-[10px] font-bold uppercase">
                     <i className="fas fa-bolt text-indigo-400"></i> AI Driven
                  </div>
                </div>
              </div>
              <div className="absolute top-[-50%] right-[-10%] w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-indigo-500/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>
            </div>

            {/* Content Header */}
            <header className="mb-6 lg:mb-10 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-4xl font-extrabold text-slate-900 hero-text mb-1 lg:mb-2">
                    {activeTab === 'roadmap' ? 'Learning Roadmap' : 
                     activeTab === 'recommended' ? 'Your Roadmap' : 
                     activeTab === 'expiring' ? 'Upcoming' : 
                     activeTab === 'favorites' ? 'Saved' : 'Applied'}
                </h1>
                <p className="text-slate-400 font-medium text-xs lg:text-base leading-relaxed">
                  {activeTab === 'roadmap' ? 'Bridge the gap to your goal with these steps.' : 
                   activeTab === 'expiring' ? 'Opportunities closing soon. Don\'t miss out.' : 
                   activeTab === 'favorites' ? 'Your hand-picked collection of opportunities.' : 
                   'Verified path curated specifically for you.'}
                </p>
              </div>
            </header>

            <div className="space-y-4 lg:space-y-6">
              {activeTab === 'roadmap' ? (
                <RoadmapView steps={state.roadmap} isLoading={state.isRoadmapLoading} />
              ) : (
                <>
                  {state.isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 md:h-28 bg-white border border-slate-50 rounded-[24px] md:rounded-[32px] animate-pulse flex items-center px-6 gap-4">
                           <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl"></div>
                           <div className="flex-1 space-y-2">
                              <div className="h-3 bg-slate-50 rounded w-1/3"></div>
                              <div className="h-3 bg-slate-50 rounded w-1/4"></div>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredOpps.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                       {filteredOpps.map(opp => (
                        <OpportunityCard 
                          key={opp.id} 
                          opp={opp} 
                          isApplied={state.applications.includes(opp.id)}
                          isFavorite={state.favorites.includes(opp.id)}
                          onApply={onApply}
                          onToggleFavorite={onToggleFavorite}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 md:py-24 text-center bg-white border border-slate-100 rounded-[32px] md:rounded-[48px] shadow-sm">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <i className={`fas ${activeTab === 'favorites' ? 'fa-heart-broken' : 'fa-wind'} text-lg md:text-xl text-slate-200`}></i>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-800">
                        {activeTab === 'favorites' ? 'No Saved Items' : 'Clear Skies'}
                      </h3>
                      <p className="text-slate-400 mt-2 md:mt-3 max-w-sm mx-auto text-xs md:text-sm font-medium px-6">
                        {activeTab === 'favorites' ? 'Explore discovery to add some favorites!' : 'No matches currently in this view. Try refreshing to trigger a fresh scan.'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Fixed Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-4 py-3 pb-6 flex items-center justify-between z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
        <button 
          onClick={() => setActiveTab('recommended')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'recommended' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 'recommended' ? 'bg-indigo-50' : ''}`}>
            <i className="fas fa-compass text-lg"></i>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Discover</span>
        </button>

        <button 
          onClick={() => setActiveTab('expiring')}
          className={`flex flex-col items-center gap-1 transition-all relative ${activeTab === 'expiring' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 'expiring' ? 'bg-indigo-50' : ''}`}>
            <i className="fas fa-hourglass-half text-lg"></i>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Upcoming</span>
          {expiringCount > 0 && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[8px] font-black flex items-center justify-center border-2 border-white">
              {expiringCount}
            </div>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'favorites' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 'favorites' ? 'bg-indigo-50' : ''}`}>
            <i className="fas fa-heart text-lg"></i>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Saved</span>
        </button>

        <button 
          onClick={() => setActiveTab('roadmap')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'roadmap' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 'roadmap' ? 'bg-indigo-50' : ''}`}>
            <i className="fas fa-graduation-cap text-lg"></i>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Blueprint</span>
        </button>

        <button 
          onClick={() => setActiveTab('applied')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'applied' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 'applied' ? 'bg-indigo-50' : ''}`}>
            <i className="fas fa-clipboard-check text-lg"></i>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Applied</span>
        </button>
      </nav>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Touch ripples or active state feel */
        button:active {
          transform: scale(0.96);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
