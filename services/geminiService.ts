import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizFormData, GeneratedQuiz, QuestionData, QuestionFormat } from "../types";

const mapDifficultyToCount = (data: QuizFormData): string => {
  let summary = [];
  if (data.difficulties.mudah.checked) summary.push(`${data.difficulties.mudah.count} soal Mudah`);
  if (data.difficulties.sedang.checked) summary.push(`${data.difficulties.sedang.count} soal Sedang`);
  if (data.difficulties.sulit.checked) summary.push(`${data.difficulties.sulit.count} soal Sulit`);
  return summary.join(', ');
};

const mapCognitiveLevels = (data: QuizFormData): string => {
  return Object.entries(data.cognitiveLevels)
    .filter(([_, checked]) => checked)
    .map(([level]) => level)
    .join(', ');
};

export const generateQuizIllustration = async (description: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Buatkan gambar ilustrasi pendidikan yang jelas dan aman untuk soal sekolah berikut: ${description}. Gaya visual: edukatif, bersih, mudah dipahami siswa.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating illustration:", error);
    return null;
  }
};

export const generateQuiz = async (formData: QuizFormData): Promise<GeneratedQuiz> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in the environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const difficultyPrompt = mapDifficultyToCount(formData);
  const cognitivePrompt = mapCognitiveLevels(formData);
  
  // Determine option range logic
  let optionInstruction = "";
  if (formData.format === QuestionFormat.PG || formData.format === QuestionFormat.PG_KOMPLEKS) {
    const count = formData.optionCount || 4; // fallback
    const letters = Array.from({length: count}, (_, i) => String.fromCharCode(65 + i)).join(', ');
    optionInstruction = `WAJIB membuat tepat ${count} opsi jawaban (${letters}).`;
  }

  const systemInstruction = `
    Anda adalah asisten pembuat soal ujian profesional untuk guru di Indonesia (Kurikulum Merdeka).
    Tugas Anda adalah membuat soal kuis yang lengkap dengan kisi-kisi dan kunci jawaban dalam format JSON yang valid.
    
    Panduan Format Soal:
    1. **Pilihan Ganda (PG)**: ${optionInstruction}
    2. **Pilihan Ganda Kompleks**: Mirip PG, tapi kunci jawaban bisa lebih dari satu. ${optionInstruction}
    3. **Benar Salah**: Soal berupa pernyataan.
    4. **Menjodohkan**: Berikan pasangan premis (kiri) dan respon (kanan).
    5. **Uraian/Isian Singkat**: Soal pertanyaan langsung.
    
    Jika "Mode Bergambar" (pictorialMode) aktif, sertakan deskripsi visual yang detail untuk gambar yang relevan dengan soal di field "imageDescription".
    Jika "Stimulus" aktif, sertakan teks stimulus pendek (cerita, data, kasus) di field "stimulus".
  `;

  const prompt = `
    Buatlah kuis dengan spesifikasi berikut:
    - Mata Pelajaran: ${formData.subject}
    - Fase: ${formData.phase}
    - Kelas: ${formData.grade}
    - Topik/Materi: ${formData.topic}
    - Format Soal: ${formData.format}
    ${formData.format === QuestionFormat.PG || formData.format === QuestionFormat.PG_KOMPLEKS ? `- Jumlah Opsi: ${formData.optionCount}` : ''}
    - Komposisi Kesulitan: ${difficultyPrompt}
    - Level Kognitif yang digunakan: ${cognitivePrompt}
    - Jenis Pengerjaan: ${formData.questionType}
    - Menggunakan Stimulus: ${formData.hasStimulus ? "Ya" : "Tidak"}
    - Mode Bergambar: ${formData.pictorialMode ? "Ya" : "Tidak"}

    Pastikan output adalah JSON valid sesuai skema. 
    Field "options" hanya diisi untuk Pilihan Ganda / PG Kompleks (Harus array string dengan jumlah ${formData.optionCount}).
    Field "matches" hanya diisi untuk Menjodohkan (array of objects {left: string, right: string}).
    Field "correctAnswer" sesuaikan dengan format (string untuk PG/Uraian, array string untuk PG Kompleks).
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            no: { type: Type.INTEGER },
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of options for PG/PG Kompleks"
            },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  left: { type: Type.STRING },
                  right: { type: Type.STRING }
                }
              },
              description: "Pairs for matching questions"
            },
            correctAnswer: { 
              type: Type.STRING, 
              description: "The answer key."
            }, 
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Mudah", "Sedang", "Sulit"] },
            cognitiveLevel: { type: Type.STRING },
            syllabus: {
              type: Type.OBJECT,
              properties: {
                tujuanPembelajaran: { type: Type.STRING },
                materiPokok: { type: Type.STRING },
                indikatorSoal: { type: Type.STRING }
              },
              required: ["tujuanPembelajaran", "materiPokok", "indikatorSoal"]
            },
            stimulus: { type: Type.STRING },
            imageDescription: { type: Type.STRING }
          },
          required: ["no", "text", "correctAnswer", "difficulty", "cognitiveLevel", "syllabus"]
        }
      }
    },
    required: ["questions"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.7, 
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    const json = JSON.parse(text);
    return {
      metadata: formData,
      questions: json.questions
    };
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to generate valid quiz data.");
  }
};