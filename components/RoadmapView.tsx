
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
      <div className="space-y-8 py-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 md:gap-8 animate-pulse">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-2xl bg-slate-100"></div>
              {i < 3 && <div className="w-[1.5px] flex-1 bg-slate-50 my-2"></div>}
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-slate-100 rounded-xl w-3/4"></div>
              <div className="h-20 bg-slate-50 rounded-[24px] w-full"></div>
            </div>
          </div>
        ))}
        <div className="pt-10 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
              <i className="fas fa-brain text-indigo-400 text-xs animate-pulse"></i>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Kairo AI is mapping your future...</span>
           </div>
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-slate-100 rounded-[32px] md:rounded-[48px] shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-map-marked-alt text-xl text-slate-200"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Blueprint Empty</h3>
        <p className="text-slate-400 mt-3 max-w-sm mx-auto text-sm font-medium px-6">
          We couldn't generate a path right now. Try refreshing the discovery engine.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0 relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4 md:gap-8 group">
          {/* Connector Column */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-[10px] md:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border text-[10px] md:text-sm font-black ${index === 0 ? 'bg-[#3d3028] text-white border-[#3d3028]' : 'bg-white text-slate-300 border-slate-100 group-hover:border-indigo-200 group-hover:text-indigo-400'}`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-[1.5px] h-full bg-gradient-to-b from-slate-100 to-transparent group-hover:from-indigo-100 transition-colors"></div>
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 pb-10">
            <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-slate-100/80 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                    <span className="text-[8px] md:text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md">
                      {step.type}
                    </span>
                    {step.provider && (
                      <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {step.provider}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base md:text-2xl font-bold text-[#3d3028] leading-tight group-hover:text-indigo-600 transition-colors">{step.title}</h3>
                </div>
                <button 
                  onClick={() => handleListen(step)}
                  disabled={playingId === step.id}
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${playingId === step.id ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-90'}`}
                  title="Listen to AI analysis"
                >
                  <i className={`fas ${playingId === step.id ? 'fa-spinner fa-spin' : 'fa-play'} text-[10px] md:text-xs`}></i>
                </button>
              </div>
              
              <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
                {step.description}
              </p>

              <div className="bg-[#fcf8f2] rounded-2xl md:rounded-[24px] p-4 md:p-6 border border-[#3d3028]/5">
                <p className="text-[8px] md:text-[10px] font-black text-[#3d3028]/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <i className="fas fa-sparkles text-amber-400 text-[10px]"></i> Strategic Advantage
                </p>
                <p className="text-[#3d3028]/80 text-[12px] md:text-sm font-semibold italic leading-relaxed">
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
