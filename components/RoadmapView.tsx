
import React, { useState } from 'react';
import { RoadmapStep } from '../types';
import { generateSpeech } from '../services/geminiService';

interface RoadmapViewProps {
  steps: RoadmapStep[];
  isLoading: boolean;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ steps, isLoading }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleListen = async (step: RoadmapStep) => {
    if (playingId) return;
    setPlayingId(step.id);
    
    try {
      const base64Audio = await generateSpeech(`${step.title}. ${step.description}`);
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const buffer = audioContext.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => setPlayingId(null);
        source.start();
      } else {
        setPlayingId(null);
      }
    } catch (e) {
      console.error(e);
      setPlayingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-4 md:gap-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 animate-pulse"></div>
              {i < 4 && <div className="w-[1.5px] flex-1 bg-slate-50 animate-pulse my-2"></div>}
            </div>
            <div className="flex-1 h-24 md:h-28 bg-slate-50 rounded-[24px] md:rounded-[32px] animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0 relative animate-in fade-in slide-in-from-bottom-2 duration-700">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4 md:gap-8 group">
          {/* Connector Column */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-[10px] md:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border text-[10px] md:text-sm font-black ${index === 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-300 border-slate-100 group-hover:border-indigo-200 group-hover:text-indigo-400'}`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-[1.5px] h-full bg-gradient-to-b from-slate-100 to-slate-50 group-hover:from-indigo-50 transition-colors"></div>
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 pb-10">
            <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-6 border border-slate-100/80 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1.5">
                    <span className="text-[8px] md:text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                      {step.type}
                    </span>
                    {step.provider && (
                      <span className="text-[8px] md:text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                        {step.provider}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-[#3d3028] leading-tight">{step.title}</h3>
                </div>
                <button 
                  onClick={() => handleListen(step)}
                  disabled={playingId === step.id}
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${playingId === step.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-300 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                  <i className={`fas ${playingId === step.id ? 'fa-spinner fa-spin' : 'fa-volume-up'} text-[10px] md:text-xs`}></i>
                </button>
              </div>
              
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-4">
                {step.description}
              </p>

              <div className="bg-slate-50/50 rounded-2xl p-3 md:p-4 border border-slate-100/50">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5 flex items-center gap-2">
                  <i className="fas fa-bullseye text-[8px] text-indigo-300"></i> Why this path
                </p>
                <p className="text-slate-600 text-[11px] md:text-xs font-medium italic leading-relaxed">
                  "{step.reason}"
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapView;
