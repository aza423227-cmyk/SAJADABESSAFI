import { GoogleGenAI } from '@google/genai';

export interface SpiritualGuidanceResult {
  verseArabic: string;
  verseTranslation: string;
  verseSource: string;
  hadithOrDua: string;
  counsel: string;
}

const FALLBACK_GUIDANCE: Record<string, SpiritualGuidanceResult> = {
  anxiety: {
    verseArabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    verseTranslation: '« Ceux qui ont cru, et dont les cœurs se tranquillisent à l\'évocation d\'Allah. N\'est-ce point par l\'évocation d\'Allah que les cœurs se tranquillisent ? »',
    verseSource: 'Sourate Ar-Ra\'d · Verset 28',
    hadithOrDua: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ (Ô Allah, je cherche refuge auprès de Toi contre l\'anxiété et la tristesse)',
    counsel: 'Respirez profondément, faites vos ablutions et posez votre front au sol en prosternation (Sajda). Confiez à Allah tout ce qui pèse sur vos épaules, Il connaît chaque battement de votre cœur.'
  },
  grief: {
    verseArabic: 'وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    verseTranslation: '« Et fais la bonne annonce aux endurants, qui disent, quand un malheur les atteint : "Certes nous sommes à Allah, et c\'est à Lui que nous retournerons". »',
    verseSource: 'Sourate Al-Baqarah · Versets 155-156',
    hadithOrDua: '« L\'œil pleure et le cœur s\'attriste, mais nous ne disons que ce qui plaît à notre Seigneur. » (Sahih Al-Bukhari)',
    counsel: 'La tristesse et les larmes ne sont pas contraires à la foi. Elles sont une miséricorde qu\'Allah dépose dans le cœur de Ses serviteurs. Laissez votre cœur s\'apaiser dans Son souvenir.'
  },
  gratitude: {
    verseArabic: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    verseTranslation: '« Et lorsque votre Seigneur proclama : "Si vous êtes reconnaissants, très certainement J\'augmenterai [Mes bienfaits] pour vous." »',
    verseSource: 'Sourate Ibrahim · Verset 7',
    hadithOrDua: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ (Louange abondante, pure et bénie à Allah)',
    counsel: 'La gratitude est le gardien des bienfaits présents et la clé des bienfaits à venir. Prenez une minute pour remercier pour votre souffle, votre santé et la paix dans votre foyer.'
  },
  decision: {
    verseArabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ',
    verseTranslation: '« Et quiconque place sa confiance en Allah, Il lui suffit. Allah atteint toujours ce qu\'Il Se propose. »',
    verseSource: 'Sourate At-Talaq · Verset 3',
    hadithOrDua: 'Salat Al-Istikhara : « Ô Allah, je Te consulte de par Ta science et je Te demande de m\'accorder la capacité de par Ta puissance... »',
    counsel: 'Faites les causes humaines nécessaires, accomplissez les deux unités de prière de consultation (Istikhara), puis avancez avec le cœur tranquille : ce qui est pour vous ne vous manquera pas.'
  }
};

export async function getSpiritualCounsel(
  moodOrQuery: string,
  moodKey?: string
): Promise<SpiritualGuidanceResult> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Return curated authentic guidance
    if (moodKey && FALLBACK_GUIDANCE[moodKey]) {
      return FALLBACK_GUIDANCE[moodKey];
    }
    return FALLBACK_GUIDANCE.anxiety;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tu es un guide spirituel musulman sage, bienveillant et apaisant pour l'application "SAJADA BESSAFI". 
L'utilisateur te partage son état d'esprit ou sa question : "${moodOrQuery}".
Réponds EXCLUSIVEMENT en JSON valide avec ce format exact (aucun markdown autour) :
{
  "verseArabic": "Le verset pertinent en arabe avec voyelles",
  "verseTranslation": "La traduction en français du verset",
  "verseSource": "Sourate et numéro de verset",
  "hadithOrDua": "Un Hadith ou une Du'a authentique en lien",
  "counsel": "Un conseil bienveillant et réconfortant de 2 à 3 phrases pour apaiser le cœur"
}`
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch {
    if (moodKey && FALLBACK_GUIDANCE[moodKey]) {
      return FALLBACK_GUIDANCE[moodKey];
    }
    return FALLBACK_GUIDANCE.anxiety;
  }
}
