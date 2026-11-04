import { translations } from './translations';
import {
  guTranslation,
  bnTranslation,
  taTranslation,
  teTranslation,
  knTranslation,
  mlTranslation,
  orTranslation,
  paTranslation,
  asTranslation,
  urTranslation
} from './regionalLanguages';
import {
  satTranslation,
  gonTranslation,
  bhiTranslation,
  kruTranslation,
  hocTranslation,
  unrTranslation,
  brxTranslation,
  trpTranslation,
  lusTranslation,
  khaTranslation,
  korkuTranslation
} from './tribalLanguages';

// Export all individual language resources for direct access if needed
export {
  guTranslation,
  bnTranslation,
  taTranslation,
  teTranslation,
  knTranslation,
  mlTranslation,
  orTranslation,
  paTranslation,
  asTranslation,
  urTranslation,
  satTranslation,
  gonTranslation,
  bhiTranslation,
  kruTranslation,
  hocTranslation,
  unrTranslation,
  brxTranslation,
  trpTranslation,
  lusTranslation,
  khaTranslation,
  korkuTranslation
};

/**
 * Complete i18next resource dictionary mapping all 24 supported Indian languages:
 * 13 Major Scheduled / Regional Languages + 11 Prominent Tribal & Indigenous Languages.
 */
export const ALL_RESOURCES = {
  ...translations,
  // Regional Languages
  gu: { translation: guTranslation },
  bn: { translation: bnTranslation },
  ta: { translation: taTranslation },
  te: { translation: teTranslation },
  kn: { translation: knTranslation },
  ml: { translation: mlTranslation },
  or: { translation: orTranslation },
  pa: { translation: paTranslation },
  as: { translation: asTranslation },
  ur: { translation: urTranslation },

  // Adivasi, Tribal & Indigenous Languages
  sat: { translation: satTranslation },
  gon: { translation: gonTranslation },
  bhi: { translation: bhiTranslation },
  kru: { translation: kruTranslation },
  hoc: { translation: hocTranslation },
  unr: { translation: unrTranslation },
  brx: { translation: brxTranslation },
  trp: { translation: trpTranslation },
  lus: { translation: lusTranslation },
  kha: { translation: khaTranslation },
  korku: { translation: korkuTranslation }
};
