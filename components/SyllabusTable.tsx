import React from 'react';
import { GeneratedQuiz, QuestionFormat } from '../types';

interface SyllabusTableProps {
  data: GeneratedQuiz;
}

const SyllabusTable: React.FC<SyllabusTableProps> = ({ data }) => {
  const format = data.metadata.format;

  const renderHeader = () => {
    const baseHeaders = ["No", "Tujuan Pembelajaran", "Materi Pokok", "Indikator Soal", "Level Kog"];
    
    if (format === QuestionFormat.PG || format === QuestionFormat.PG_KOMPLEKS) {
      return [...baseHeaders, "Rumusan Soal", "Opsi (A-E)", "Kunci Jawaban"];
    }
    if (format === QuestionFormat.BENAR_SALAH) {
      return [...baseHeaders, "Rumusan Soal", "Kunci Jawaban", "Alasan"];
    }
    if (format === QuestionFormat.MENJODOHKAN) {
      return [...baseHeaders, "Rumusan Soal (Premis - Respon)", "Kunci Jawaban"];
    }
    // Uraian / Isian
    return [...baseHeaders, "Rumusan Soal", "Kunci Jawaban"];
  };

  const renderRow = (q: any, idx: number) => {
    const baseCells = (
      <>
        <td className="px-4 py-3 text-center font-medium">{idx + 1}</td>
        <td className="px-4 py-3">{q.syllabus.tujuanPembelajaran}</td>
        <td className="px-4 py-3">{q.syllabus.materiPokok}</td>
        <td className="px-4 py-3">{q.syllabus.indikatorSoal}</td>
        <td className="px-4 py-3 text-center"><span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-bold">{q.cognitiveLevel}</span></td>
      </>
    );

    if (format === QuestionFormat.PG || format === QuestionFormat.PG_KOMPLEKS) {
      return (
        <tr key={idx} className="hover:bg-slate-50 border-b border-slate-200">
          {baseCells}
          <td className="px-4 py-3 min-w-[200px] text-sm">{q.text}</td>
          <td className="px-4 py-3 min-w-[150px] text-xs font-mono text-slate-600">
             {q.options?.map((opt: string, i: number) => (
               <div key={i}>{String.fromCharCode(65+i)}. {opt}</div>
             ))}
          </td>
          <td className="px-4 py-3 font-bold text-center text-blue-600">{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</td>
        </tr>
      );
    }

    if (format === QuestionFormat.BENAR_SALAH) {
        return (
          <tr key={idx} className="hover:bg-slate-50 border-b border-slate-200">
            {baseCells}
            <td className="px-4 py-3 text-sm">{q.text}</td>
            <td className="px-4 py-3 font-bold text-center">{q.correctAnswer}</td>
            <td className="px-4 py-3 text-sm italic text-slate-500">{q.explanation}</td>
          </tr>
        );
    }

    if (format === QuestionFormat.MENJODOHKAN) {
        return (
            <tr key={idx} className="hover:bg-slate-50 border-b border-slate-200">
              {baseCells}
              <td className="px-4 py-3 text-sm">
                <ul className="list-disc pl-4">
                    {q.matches?.map((m: any, i: number) => (
                        <li key={i}>{m.left} &mdash; {m.right}</li>
                    ))}
                </ul>
              </td>
              <td className="px-4 py-3 text-center text-sm">Terlampir di Rumusan</td>
            </tr>
          );
    }

    // Uraian / Isian
    return (
        <tr key={idx} className="hover:bg-slate-50 border-b border-slate-200">
          {baseCells}
          <td className="px-4 py-3 text-sm">{q.text}</td>
          <td className="px-4 py-3 text-sm text-slate-700">{q.correctAnswer}</td>
        </tr>
      );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-4 bg-slate-800 text-white">
        <h3 className="font-bold text-lg">Kisi-Kisi Penulisan Soal</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-xs">
            <tr>
              {renderHeader().map((h, i) => (
                <th key={i} className="px-4 py-3 border-b border-slate-300 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.questions.map((q, idx) => renderRow(q, idx))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SyllabusTable;