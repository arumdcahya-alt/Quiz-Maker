import React from 'react';
import { GeneratedQuiz, QuestionFormat } from '../types';
import { Image, FileText } from 'lucide-react';

interface QuizDisplayProps {
  data: GeneratedQuiz;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-wide">
          Soal {data.metadata.subject}
        </h2>
        <div className="flex justify-center space-x-4 text-sm text-slate-500 mt-2">
          <span>Kelas: {data.metadata.grade} (Fase {data.metadata.phase})</span>
          <span>&bull;</span>
          <span>Topik: {data.metadata.topic}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {data.questions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
               <span className="font-bold text-slate-700 bg-white px-3 py-1 rounded border border-slate-300 text-sm">
                 No. {idx + 1}
               </span>
               <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded font-medium 
                    ${q.difficulty === 'Mudah' ? 'bg-green-100 text-green-700' : 
                      q.difficulty === 'Sedang' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 rounded font-medium bg-blue-100 text-blue-700">
                    {q.cognitiveLevel}
                  </span>
               </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Stimulus Section */}
              {q.stimulus && (
                <div className="bg-slate-50 p-4 rounded border-l-4 border-blue-400 text-slate-700 italic mb-4">
                  <div className="flex items-center gap-2 mb-1 text-blue-600 font-semibold text-xs uppercase">
                    <FileText size={14} /> Stimulus
                  </div>
                  {q.stimulus}
                </div>
              )}

              {/* Image Section */}
              {q.imageDescription && (
                <div className="mb-4">
                   <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden relative group">
                      <img 
                        src={`https://picsum.photos/seed/${q.id}/600/350`} 
                        alt="Question Illustration" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <p className="text-white text-sm text-center">{q.imageDescription}</p>
                      </div>
                   </div>
                   <p className="text-xs text-slate-500 mt-1 italic text-center">*Gambar ilustrasi (Hover untuk deskripsi)</p>
                </div>
              )}

              {/* Question Text */}
              <p className="text-lg text-slate-900 font-medium leading-relaxed">
                {q.text}
              </p>

              {/* Options / Answer Area */}
              <div className="mt-4">
                {/* Multiple Choice & Complex MC */}
                {(data.metadata.format === QuestionFormat.PG || data.metadata.format === QuestionFormat.PG_KOMPLEKS) && q.options && (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-start group cursor-pointer hover:bg-slate-50 p-2 rounded transition">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-slate-300 text-slate-500 font-bold group-hover:border-blue-500 group-hover:text-blue-500 mr-3">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="text-slate-700 pt-1">{opt}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* True / False */}
                {data.metadata.format === QuestionFormat.BENAR_SALAH && (
                  <div className="flex gap-4 mt-4">
                     <div className="border-2 border-slate-300 rounded px-6 py-3 font-bold text-slate-500 w-32 text-center">Benar</div>
                     <div className="border-2 border-slate-300 rounded px-6 py-3 font-bold text-slate-500 w-32 text-center">Salah</div>
                  </div>
                )}

                {/* Matching */}
                {data.metadata.format === QuestionFormat.MENJODOHKAN && q.matches && (
                   <div className="grid grid-cols-2 gap-8 mt-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-slate-500 uppercase">Premis</h4>
                        {q.matches.map((m, i) => (
                          <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded min-h-[50px] flex items-center">
                            <span className="font-bold mr-2">{i+1}.</span> {m.left}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-slate-500 uppercase">Respon (Acak)</h4>
                        {/* Shuffling just for display effect would require state, simply listing them for print/view */}
                         {q.matches.map((m, i) => (
                          <div key={i} className="p-3 bg-white border border-slate-300 border-dashed rounded min-h-[50px] flex items-center justify-between">
                            <span>{m.right}</span>
                            <div className="w-6 h-6 rounded-full border border-slate-400"></div>
                          </div>
                        ))}
                      </div>
                   </div>
                )}

                {/* Essay / Short Answer */}
                {(data.metadata.format === QuestionFormat.URAIAN || data.metadata.format === QuestionFormat.ISIAN_SINGKAT) && (
                   <div className="mt-4 border-b-2 border-slate-300 border-dotted h-24 w-full bg-slate-50/50"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizDisplay;