export enum Phase {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

export enum QuestionFormat {
  PG = 'Pilihan Ganda',
  PG_KOMPLEKS = 'Pilihan Ganda Kompleks',
  BENAR_SALAH = 'Benar Salah',
  MENJODOHKAN = 'Menjodohkan',
  URAIAN = 'Uraian',
  ISIAN_SINGKAT = 'Isian Singkat'
}

export enum CognitiveLevel {
  C1 = 'C1',
  C2 = 'C2',
  C3 = 'C3',
  C4 = 'C4',
  C5 = 'C5',
  C6 = 'C6'
}

export interface DifficultyConfig {
  checked: boolean;
  count: number;
}

export interface QuizFormData {
  subject: string;
  phase: Phase;
  grade: string;
  topic: string;
  format: QuestionFormat;
  optionCount: number; // Added option count preference
  pictorialMode: boolean;
  difficulties: {
    mudah: DifficultyConfig;
    sedang: DifficultyConfig;
    sulit: DifficultyConfig;
  };
  cognitiveLevels: Record<CognitiveLevel, boolean>;
  questionType: 'Grup' | 'Individu';
  hasStimulus: boolean;
}

export interface QuestionData {
  no: number;
  id: string;
  text: string;
  options?: string[];
  matches?: { left: string; right: string }[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  cognitiveLevel: string;
  syllabus: {
    tujuanPembelajaran: string;
    materiPokok: string;
    indikatorSoal: string;
  };
  stimulus?: string;
  imageDescription?: string;
}

export interface GeneratedQuiz {
  metadata: QuizFormData;
  questions: QuestionData[];
}