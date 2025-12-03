import React from 'react';
import { GeneratedQuiz } from '../types';

const AnswerKey: React.FC<{ data: GeneratedQuiz }> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Kunci Jawaban</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.questions.map((q, idx) => (
          <div key={idx} className="flex flex-col p-3 bg-slate-50 rounded border border-slate-100">
             <div className="flex justify-between items-center mb-2">
                 <span className="font-bold text-slate-700">No. {idx + 1}</span>
                 <span className="text-xs bg-white border px-2 py-0.5 rounded text-slate-400">{q.difficulty}</span>
             </div>
             
             <div className="text-sm">
                 <span className="font-semibold text-slate-500">Jawaban:</span>
                 <div className="mt-1 font-medium text-blue-700">
                    {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                 </div>
             </div>
             
             {q.explanation && (
                 <div className="mt-2 text-xs text-slate-500 border-t pt-2 italic">
                     "{q.explanation}"
                 </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerKey;