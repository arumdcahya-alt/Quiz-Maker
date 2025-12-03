import React, { useState } from 'react';
import QuizForm from './components/QuizForm';
import QuizDisplay from './components/QuizDisplay';
import SyllabusTable from './components/SyllabusTable';
import AnswerKey from './components/AnswerKey';
import { GeneratedQuiz, QuizFormData } from './types';
import { generateQuiz } from './services/geminiService';
import { BrainCircuit, BookOpen, Key, TableProperties, Sparkles } from 'lucide-react';

export default function App() {
  const [quizData, setQuizData] = useState<GeneratedQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'soal' | 'kunci' | 'kisi'>('soal');
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: QuizFormData) => {
    setIsLoading(true);
    setError(null);
    setQuizData(null);
    
    // Check if at least one difficulty has a count > 0
    const totalCount = Object.values(formData.difficulties).reduce((acc, curr) => acc + (curr.checked ? curr.count : 0), 0);
    if (totalCount === 0) {
      setError("Mohon isi jumlah soal pada setidaknya satu tingkat kesulitan.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateQuiz(formData);
      setQuizData(result);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat generate soal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <BrainCircuit size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              GenAI Quiz Master
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            Powered by Google Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Form Section */}
        {!quizData && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="text-center mb-10">
               <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                 Buat Soal Kuis <span className="text-blue-600">Otomatis</span> & <span className="text-indigo-600">Terstruktur</span>
               </h2>
               <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                 Generator soal berbasis AI untuk Guru. Lengkap dengan Kisi-kisi, Kunci Jawaban, dan pemetaan Level Kognitif sesuai Kurikulum Merdeka.
               </p>
             </div>
             
             {error && (
               <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex items-center">
                 <span className="font-bold mr-2">Error:</span> {error}
               </div>
             )}

             <QuizForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* Results Section */}
        {quizData && (
          <div className="flex flex-col space-y-6">
            
            {/* Action Bar / Navigation */}
            <div className="sticky top-20 z-20 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-200 p-1 flex justify-center max-w-fit mx-auto">
               <button 
                  onClick={() => setActiveTab('soal')}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all font-medium ${activeTab === 'soal' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <BookOpen size={18} /> <span>Lembar Soal</span>
               </button>
               <button 
                  onClick={() => setActiveTab('kunci')}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all font-medium ${activeTab === 'kunci' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <Key size={18} /> <span>Kunci Jawaban</span>
               </button>
               <button 
                  onClick={() => setActiveTab('kisi')}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all font-medium ${activeTab === 'kisi' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 <TableProperties size={18} /> <span>Kisi-Kisi</span>
               </button>
            </div>

            <div className="flex justify-between items-center mb-4">
               <button 
                 onClick={() => setQuizData(null)}
                 className="text-slate-500 hover:text-slate-800 underline text-sm"
               >
                 &larr; Buat Kuis Baru
               </button>
               <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-900 print:hidden">
                 Cetak / Simpan PDF
               </button>
            </div>

            {/* Content Render */}
            <div className="min-h-[500px]">
              {activeTab === 'soal' && <QuizDisplay data={quizData} />}
              {activeTab === 'kunci' && <AnswerKey data={quizData} />}
              {activeTab === 'kisi' && <SyllabusTable data={quizData} />}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} GenAI Quiz Master. Made for Educators.
        </div>
      </footer>
    </div>
  );
}