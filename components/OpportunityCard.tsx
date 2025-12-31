
import React, { useState } from 'react';
import { CareerOpportunity } from '../types';

interface OpportunityCardProps {
  opp: CareerOpportunity;
  isApplied: boolean;
  onApply: (id: string, url: string) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opp, isApplied, onApply }) => {
  const [expanded, setExpanded] = useState(false);

  const getDeadlineInfo = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    
    if (days < 0) return { label: 'Closed', class: 'text-slate-300', isUrgent: false };
    if (days <= 7) return { label: `Closing in ${days}d`, class: 'text-rose-500 font-bold', isUrgent: true };
    return { label: `Due ${new Date(deadline).toLocaleDateString()}`, class: 'text-slate-400', isUrgent: false };
  };

  const deadlineInfo = getDeadlineInfo(opp.deadline);

  return (
    <div className={`dona-card mb-3 transition-soft overflow-hidden ${expanded ? 'shadow-xl border-indigo-100 ring-4 ring-indigo-50/50' : 'hover:translate-x-1 hover:border-slate-200 active:bg-slate-50'}`}>
      <div 
        className="p-4 md:p-5 flex items-center justify-between cursor-pointer group select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[14px] md:rounded-2xl flex items-center justify-center transition-all ${expanded ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
             <i className={`fas ${opp.type === 'Internship' ? 'fa-seedling' : 'fa-briefcase'} text-base md:text-lg`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 overflow-hidden">
               <h3 className="text-base md:text-lg font-bold text-slate-800 truncate leading-tight group-hover:text-indigo-600 transition-colors">{opp.title}</h3>
               {deadlineInfo.isUrgent && (
                 <span className="flex-shrink-0 bg-rose-50 text-rose-500 text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse border border-rose-100">Expiring</span>
               )}
            </div>
            <p className="text-[10px] md:text-sm font-semibold text-slate-400 uppercase tracking-widest">{opp.organization}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-right hidden sm:block">
            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${deadlineInfo.class}`}>{deadlineInfo.label}</span>
          </div>
          <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-soft ${expanded ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'text-slate-200 hover:text-slate-400'}`}>
            <i className="fas fa-chevron-down text-[10px]"></i>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 md:px-5 pb-5 md:pb-6 pt-1 border-t border-slate-50 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8 mb-6 md:mb-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Overview</h4>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{opp.description}</p>
              </div>
              <div className="bg-slate-50/80 p-3 md:p-4 rounded-2xl border border-slate-100">
                <h4 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Criteria</h4>
                <p className="text-slate-700 text-xs md:text-sm font-medium">{opp.eligibility}</p>
              </div>
            </div>
            
            <div className="bg-indigo-50/40 rounded-2xl p-4 md:p-6 border border-indigo-100/30 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <i className="fas fa-sparkles text-indigo-400 text-[10px]"></i>
                <h4 className="text-[9px] md:text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Why it matches you</h4>
              </div>
              <p className="text-indigo-900/80 text-xs md:text-sm leading-relaxed italic font-medium">"{opp.matchReason}"</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-slate-400">
               <i className="fas fa-lock text-[10px]"></i>
               <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Official Portal Link</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(opp.id, opp.officialUrl);
              }}
              className={`w-full sm:w-auto h-12 md:h-12 px-8 md:px-10 rounded-2xl md:rounded-full font-bold transition-all flex items-center justify-center gap-2 ${
                isApplied 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-[#0095FF] text-white hover:bg-blue-600 shadow-lg shadow-blue-100 active:scale-95'
              }`}
            >
              {isApplied ? <><i className="fas fa-check"></i> Applied</> : <>Apply Now <i className="fas fa-external-link-alt text-[10px] ml-1"></i></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;
