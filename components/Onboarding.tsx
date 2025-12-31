
import React, { useState, useEffect } from 'react';
import { UserProfile, EducationLevel } from '../types';
import Logo from './Logo';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [interestInput, setInterestInput] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    educationLevel: 'Undergraduate',
    major: '',
    currentStage: 'Student',
    interests: [],
    futureGoal: ''
  });

  const educationLevels: EducationLevel[] = ['High School', 'Undergraduate', 'Graduate', 'Post-Graduate', 'Professional'];

  const presetInterests = [
    'Technology', 'Design', 'Science', 'Marketing', 'Finance', 
    'Healthcare', 'Education', 'Sustainability', 'Social Impact', 
    'Artificial Intelligence', 'Cybersecurity', 'Renewable Energy'
  ];

  const handleNext = () => {
    if (step === 1 && profile.name) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3 && profile.futureGoal) setStep(4);
    else if (step === 4 && profile.interests.length > 0) onComplete(profile);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleInterest = (interest: string) => {
    const cleaned = interest.trim();
    if (!cleaned) return;
    
    setProfile(prev => {
      const exists = prev.interests.includes(cleaned);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== cleaned) };
      } else {
        return { ...prev, interests: [...prev.interests, cleaned] };
      }
    });
  };

  const handleAddCustomInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || (e.key === ' ' && interestInput.trim())) {
      if (e.key === ',' || e.key === ' ') {
        e.preventDefault();
      }
      
      const value = interestInput.trim();
      if (value) {
        if (!profile.interests.includes(value)) {
          toggleInterest(value);
        }
        setInterestInput('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col overflow-hidden">
      {/* Navigation Header */}
      <nav className="px-6 md:px-10 py-6 md:py-8 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-black text-xl tracking-tighter text-[#3d3028]">kairo</span>
        </div>
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
           Step {step} of 4
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 pb-12 relative overflow-y-auto">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 flex h-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 transition-all duration-700 ${step >= i ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>
          ))}
        </div>

        <div className="max-w-xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-12 text-left shadow-2xl shadow-slate-200 border border-slate-50 flex flex-col justify-center min-h-[440px] md:min-h-[500px]">
            
            {step === 1 && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <header>
                  <h2 className="text-3xl md:text-5xl font-black text-[#3d3028] hero-text leading-tight">What's your name?</h2>
                  <p className="text-slate-400 mt-2 font-medium">To personalize your career portal.</p>
                </header>
                <input
                  autoFocus
                  type="text"
                  placeholder="Full Name"
                  className="w-full text-2xl md:text-3xl font-bold bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder:text-slate-200"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                />
                <button 
                  onClick={handleNext}
                  disabled={!profile.name}
                  className="w-full bg-[#0095FF] text-white text-lg font-bold px-8 py-5 rounded-2xl hover:bg-blue-600 transition shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <header>
                  <h2 className="text-3xl md:text-5xl font-black text-[#3d3028] hero-text leading-tight">Where are you on your journey?</h2>
                </header>
                <div className="grid grid-cols-1 gap-2.5">
                  {educationLevels.map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        setProfile({ ...profile, educationLevel: level });
                        setTimeout(handleNext, 300);
                      }}
                      className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all border-2 flex items-center justify-between ${profile.educationLevel === level ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100 active:scale-98'}`}
                    >
                      {level}
                      {profile.educationLevel === level && <i className="fas fa-check-circle text-white/50"></i>}
                    </button>
                  ))}
                </div>
                <button onClick={handleBack} className="text-slate-400 font-bold hover:text-slate-600 w-fit">Back</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <header>
                  <h2 className="text-3xl md:text-5xl font-black text-[#3d3028] hero-text leading-tight">What do you want to be?</h2>
                  <p className="text-slate-400 mt-2 font-medium">Your North Star goal helps us find the path.</p>
                </header>
                <textarea
                  autoFocus
                  rows={3}
                  placeholder="e.g. Product Manager at a climate-tech startup."
                  className="w-full text-xl md:text-2xl font-bold bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none placeholder:text-slate-200"
                  value={profile.futureGoal}
                  onChange={(e) => setProfile({ ...profile, futureGoal: e.target.value })}
                />
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleNext}
                    disabled={!profile.futureGoal}
                    className="w-full bg-[#0095FF] text-white text-lg font-bold px-8 py-5 rounded-2xl hover:bg-blue-600 transition shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button onClick={handleBack} className="text-slate-400 font-bold hover:text-slate-600 w-fit mx-auto">Back</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <header>
                  <h2 className="text-3xl md:text-5xl font-black text-[#3d3028] hero-text leading-tight">What are you passionate about?</h2>
                  <p className="text-slate-400 mt-2 font-medium">Select multiple or type your own.</p>
                </header>
                
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                    {presetInterests.map(interest => {
                      const isSelected = profile.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all border-2 flex items-center gap-2 whitespace-nowrap ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100 hover:text-indigo-400 active:scale-95'}`}
                        >
                          {interest}
                          {isSelected && <i className="fas fa-times text-[10px]"></i>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Add custom... (Space/Comma to add)"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={handleAddCustomInterest}
                    />
                  </div>

                  {profile.interests.filter(i => !presetInterests.includes(i)).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {profile.interests.filter(i => !presetInterests.includes(i)).map(interest => (
                        <div key={interest} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-black border border-indigo-100 animate-in zoom-in">
                          {interest}
                          <button onClick={() => toggleInterest(interest)} className="hover:text-rose-500"><i className="fas fa-times"></i></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <button 
                    onClick={handleNext}
                    disabled={profile.interests.length === 0}
                    className="w-full bg-[#3d3028] text-white text-lg font-bold px-8 py-5 rounded-2xl hover:bg-slate-800 transition shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    Finish Setup
                  </button>
                  <button onClick={handleBack} className="text-slate-400 font-bold hover:text-slate-600 w-fit mx-auto">Back</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
