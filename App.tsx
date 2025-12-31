
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, UserProfile, CareerOpportunity, RoadmapStep } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { fetchOpportunities, generateRoadmap } from './services/geminiService';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    opportunities: [],
    roadmap: [],
    isLoading: false,
    isRoadmapLoading: false,
    applications: [],
    favorites: []
  });

  const [notification, setNotification] = useState<string | null>(null);
  const fetchAttempted = useRef(false);

  const handleOnboardingComplete = (profile: UserProfile) => {
    fetchAttempted.current = false; // Reset on new profile
    setState(prev => ({ ...prev, user: profile }));
  };

  const getDiscoveryData = useCallback(async (profile: UserProfile) => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;
    
    setState(prev => ({ ...prev, isLoading: true, isRoadmapLoading: true }));
    
    try {
      // Fire both requests in parallel
      const oppsPromise = fetchOpportunities(profile);
      const roadmapPromise = generateRoadmap(profile);

      oppsPromise.then(results => {
        setState(prev => ({ ...prev, opportunities: results, isLoading: false }));
      }).catch(() => {
        setState(prev => ({ ...prev, isLoading: false }));
      });

      roadmapPromise.then(steps => {
        setState(prev => ({ ...prev, roadmap: steps, isRoadmapLoading: false }));
      }).catch(() => {
        setState(prev => ({ ...prev, isRoadmapLoading: false }));
      });
    } catch (error) {
      console.error("Discovery error:", error);
      setState(prev => ({ ...prev, isLoading: false, isRoadmapLoading: false }));
    }
  }, []);

  useEffect(() => {
    if (state.user && !fetchAttempted.current && !state.isLoading && !state.isRoadmapLoading) {
      getDiscoveryData(state.user);
    }
  }, [state.user, state.isLoading, state.isRoadmapLoading, getDiscoveryData]);

  const handleApply = (id: string, url: string) => {
    setNotification("Kairo is ready to pre-fill your details...");
    
    setTimeout(() => {
      window.open(url, '_blank');
      setNotification(null);
      if (!state.applications.includes(id)) {
        setState(prev => ({
          ...prev,
          applications: [...prev.applications, id]
        }));
      }
    }, 1500);
  };

  const handleToggleFavorite = (id: string) => {
    setState(prev => {
      const isFavorite = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: isFavorite 
          ? prev.favorites.filter(favId => favId !== id) 
          : [...prev.favorites, id]
      };
    });
  };

  const handleRefresh = () => {
    if (state.user) {
      fetchAttempted.current = false;
      getDiscoveryData(state.user);
    }
  };

  const logout = () => {
    fetchAttempted.current = false;
    setState({ user: null, opportunities: [], roadmap: [], isLoading: false, isRoadmapLoading: false, applications: [], favorites: [] });
  };

  return (
    <div className="min-h-screen relative selection:bg-[#3d3028]/10 selection:text-[#3d3028]">
      {!state.user ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <div className="animate-in fade-in duration-700">
          <Dashboard 
            state={state} 
            onApply={handleApply} 
            onRefresh={handleRefresh}
            onLogout={logout}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      )}

      {/* Global Notification Overlay for Pre-fill */}
      {notification && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-[#3d3028] text-[#fcf8f2] rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl animate-pulse">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-2">Pre-fill Active</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Redirecting you to the official site. We'll attempt to help pre-fill your profile for {state.user?.name}.
              </p>
              <div className="h-1 w-full bg-[#4a3a31] rounded-full overflow-hidden">
                 <div className="h-full bg-[#0095FF] animate-[progress_1.5s_ease-in-out]"></div>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default App;
