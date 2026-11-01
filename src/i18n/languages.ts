export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  category: 'regional' | 'tribal_adivasi';
  region: string;
  script?: string;
  speakers?: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  // Major Scheduled / Regional Languages
  { code: 'en', name: 'English', nativeName: 'English', category: 'regional', region: 'Pan-India & Global' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', category: 'regional', region: 'Maharashtra, Goa' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', category: 'regional', region: 'North & Central India' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', category: 'regional', region: 'Gujarat, D&NH' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', category: 'regional', region: 'West Bengal, Tripura, Assam' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', category: 'regional', region: 'Tamil Nadu, Puducherry' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', category: 'regional', region: 'Andhra Pradesh, Telangana' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', category: 'regional', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', category: 'regional', region: 'Kerala, Lakshadweep' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', category: 'regional', region: 'Odisha' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', category: 'regional', region: 'Punjab, Haryana, Delhi' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', category: 'regional', region: 'Assam' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', category: 'regional', region: 'Pan-India' },

  // Prominent Adivasi, Tribal & Indigenous Languages of India
  { code: 'sat', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (संथाली)', category: 'tribal_adivasi', region: 'Jharkhand, Odisha, WB, Bihar', script: 'Ol Chiki / Devanagari', speakers: '7.6M+ Adivasi' },
  { code: 'gon', name: 'Gondi', nativeName: 'गोंडी (Gōndi)', category: 'tribal_adivasi', region: 'MP, Maharashtra, Chhattisgarh, Telangana', script: 'Devanagari / Gunjala', speakers: '3M+ Gond tribe' },
  { code: 'bhi', name: 'Bhili', nativeName: 'भीली (Bhili)', category: 'tribal_adivasi', region: 'Rajasthan, Gujarat, Maharashtra, MP', script: 'Devanagari', speakers: '10M+ Bhil tribe' },
  { code: 'kru', name: 'Kurukh (Oraon)', nativeName: 'कुडुख़ (Kurukh)', category: 'tribal_adivasi', region: 'Jharkhand, Chhattisgarh, Odisha, WB', script: 'Tolong Siki / Devanagari', speakers: '2M+ Oraon tribe' },
  { code: 'hoc', name: 'Ho', nativeName: 'ᱦᱳ (Ho)', category: 'tribal_adivasi', region: 'Jharkhand, Odisha (Kolhan belt)', script: 'Warang Chiti / Devanagari', speakers: '1.4M+ Ho tribe' },
  { code: 'unr', name: 'Mundari', nativeName: 'मुण्डारी (Mundari)', category: 'tribal_adivasi', region: 'Jharkhand, Odisha, WB (Chota Nagpur)', script: 'Baniuri / Devanagari', speakers: '1.1M+ Munda tribe' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो (Bodo)', category: 'tribal_adivasi', region: 'Assam (Bodoland), Meghalaya', script: 'Devanagari', speakers: '1.5M+ Bodo tribe' },
  { code: 'trp', name: 'Kokborok', nativeName: 'ककबरक (Kokborok)', category: 'tribal_adivasi', region: 'Tripura (Tripuri Indigenous)', script: 'Bengali / Roman', speakers: '1M+ Tripuri' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', category: 'tribal_adivasi', region: 'Mizoram, Manipur, Tripura', script: 'Roman', speakers: '850K+ Mizo people' },
  { code: 'kha', name: 'Khasi', nativeName: 'Ka Ktien Khasi', category: 'tribal_adivasi', region: 'Meghalaya (Khasi & Jaintia Hills)', script: 'Roman', speakers: '1.4M+ Khasi people' },
  { code: 'korku', name: 'Korku', nativeName: 'कोर्कू (Korku)', category: 'tribal_adivasi', region: 'Melghat (Maharashtra), MP Satpura', script: 'Devanagari', speakers: '600K+ Korku tribe' }
];
