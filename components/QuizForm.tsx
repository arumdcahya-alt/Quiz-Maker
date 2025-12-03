import React, { useState, useEffect } from 'react';
import { Phase, QuestionFormat, CognitiveLevel, QuizFormData, DifficultyConfig } from '../types';
import { Check, Info } from 'lucide-react';

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => void;
  isLoading: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ onSubmit, isLoading }) => {
  // Initial State
  const [formData, setFormData] = useState<QuizFormData>({
    subject: '',
    phase: Phase.A,
    grade: '1',
    topic: '',
    format: QuestionFormat.PG,
    optionCount: 4, // Default to 4 options
    pictorialMode: false,
    difficulties: {
      mudah: { checked: false, count: 0 },
      sedang: { checked: false, count: 0 },
      sulit: { checked: false, count: 0 },
    },
    cognitiveLevels: {
      C1: false, C2: false, C3: false, C4: false, C5: false, C6: false
    },
    questionType: 'Individu',
    hasStimulus: false
  });

  // Grade options based on Phase
  const getGradeOptions = (phase: Phase) => {
    switch (phase) {
      case Phase.A: return ['1', '2'];
      case Phase.B: return ['3', '4'];
      case Phase.C: return ['5', '6'];
      case Phase.D: return ['7', '8', '9'];
      case Phase.E: return ['10'];
      case Phase.F: return ['11', '12'];
      default: return [];
    }
  };

  const gradeOptions = getGradeOptions(formData.phase);

  // Update grade if phase changes
  useEffect(() => {
    const opts = getGradeOptions(formData.phase);
    if (!opts.includes(formData.grade)) {
      setFormData(prev => ({ ...prev, grade: opts[0] }));
    }
  }, [formData.phase, formData.grade]);

  const handleDifficultyChange = (key: keyof QuizFormData['difficulties']) => {
    setFormData(prev => ({
      ...prev,
      difficulties: {
        ...prev.difficulties,
        [key]: {
          ...prev.difficulties[key],
          checked: !prev.difficulties[key].checked,
        }
      }
    }));
  };

  const handleDifficultyCountChange = (key: keyof QuizFormData['difficulties'], count: string) => {
    const num = parseInt(count) || 0;
    setFormData(prev => ({
      ...prev,
      difficulties: {
        ...prev.difficulties,
        [key]: { ...prev.difficulties[key], count: num }
      }
    }));
  };

  const handleCognitiveChange = (level: CognitiveLevel) => {
    setFormData(prev => ({
      ...prev,
      cognitiveLevels: {
        ...prev.cognitiveLevels,
        [level]: !prev.cognitiveLevels[level]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="border-b border-slate-200 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Parameter Kuis</h2>
        <p className="text-slate-500 text-sm">Lengkapi form berikut untuk men-generate soal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mata Pelajaran */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-slate-900"
            placeholder="Contoh: Matematika, IPA"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

         {/* Fase & Kelas */}
         <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fase</label>
            <select
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-slate-900"
              value={formData.phase}
              onChange={e => setFormData({ ...formData, phase: e.target.value as Phase })}
            >
              {Object.values(Phase).map(p => (
                <option key={p} value={p}>Fase {p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
            <select
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-slate-900"
              value={formData.grade}
              onChange={e => setFormData({ ...formData, grade: e.target.value })}
            >
              {gradeOptions.map(g => (
                <option key={g} value={g}>Kelas {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Topik / Materi - Full Width Textarea */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Topik / Materi / Tujuan</label>
          <textarea
            required
            rows={6}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y bg-white text-slate-900"
            placeholder="Contoh: Pecahan, Ekosistem, atau Capaian Pembelajaran lengkap yang ingin diujikan..."
            value={formData.topic}
            onChange={e => setFormData({ ...formData, topic: e.target.value })}
          />
        </div>

        {/* Format Soal */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Format Soal</label>
          <select
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-slate-900"
            value={formData.format}
            onChange={e => setFormData({ ...formData, format: e.target.value as QuestionFormat })}
          >
            {Object.values(QuestionFormat).map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          {/* Option Count Selection (Visible only for PG formats) */}
          {(formData.format === QuestionFormat.PG || formData.format === QuestionFormat.PG_KOMPLEKS) && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-1">
               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                 Jumlah Opsi Jawaban
               </label>
               <div className="flex flex-wrap gap-3">
                 {[3, 4, 5, 6].map(opt => (
                   <label key={opt} className={`
                      flex items-center space-x-2 px-3 py-2 rounded-md border cursor-pointer transition-all select-none
                      ${formData.optionCount === opt 
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                        : 'bg-white border-slate-300 hover:bg-slate-50'}
                   `}>
                      <input 
                        type="radio" 
                        name="optionCount"
                        className="text-blue-600 focus:ring-blue-500 accent-blue-600"
                        checked={formData.optionCount === opt}
                        onChange={() => setFormData({...formData, optionCount: opt})}
                      />
                      <span className={`text-sm ${formData.optionCount === opt ? 'font-bold text-blue-700' : 'text-slate-700'}`}>
                        {opt} Opsi
                      </span>
                   </label>
                 ))}
               </div>
            </div>
          )}
        </div>

         {/* Jenis Pengerjaan (Moved here to balance grid) */}
         <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Pengerjaan</label>
           <div className="flex space-x-4 h-[42px] items-center">
             {['Individu', 'Grup'].map(type => (
               <label key={type} className="inline-flex items-center cursor-pointer">
                 <input
                    type="radio"
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    name="questionType"
                    value={type}
                    checked={formData.questionType === type}
                    onChange={(e) => setFormData({...formData, questionType: e.target.value as any})}
                 />
                 <span className="ml-2 text-slate-700">{type}</span>
               </label>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
         {/* Kesulitan */}
         <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Tingkat Kesulitan & Jumlah Soal</label>
          {(['mudah', 'sedang', 'sulit'] as const).map(diff => (
            <div key={diff} className="flex items-center space-x-3 bg-slate-50 p-2 rounded-md">
              <input
                type="checkbox"
                id={`diff-${diff}`}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                checked={formData.difficulties[diff].checked}
                onChange={() => handleDifficultyChange(diff)}
              />
              <label htmlFor={`diff-${diff}`} className="flex-1 capitalize text-slate-700">{diff}</label>
              
              {formData.difficulties[diff].checked && (
                <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-xs text-slate-500">Jml:</span>
                  <input
                    type="number"
                    min="1"
                    className="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-blue-500 outline-none bg-white text-slate-900"
                    value={formData.difficulties[diff].count || ''}
                    onChange={(e) => handleDifficultyCountChange(diff, e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Level Kognitif */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Level Kognitif</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(CognitiveLevel).map(level => (
              <label key={level} className={`
                flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-all text-sm
                ${formData.cognitiveLevels[level] 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
              `}>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.cognitiveLevels[level]}
                  onChange={() => handleCognitiveChange(level)}
                />
                {level}
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                checked={formData.pictorialMode}
                onChange={e => setFormData({...formData, pictorialMode: e.target.checked})}
              />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium text-sm">Mode Bergambar</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                checked={formData.hasStimulus}
                onChange={e => setFormData({...formData, hasStimulus: e.target.checked})}
              />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium text-sm">Gunakan Stimulus</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all
            ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sedang Membuat Soal...
            </>
          ) : (
            <>
              Generate Soal Kuis
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;