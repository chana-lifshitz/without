// הרגישויות שהאתר תומך בהן. המפתחות זהים לקובץ allergens.js בשרת.
export type AllergenKey =
  | 'gluten'
  | 'lactose'
  | 'nuts'
  | 'peanuts'
  | 'eggs'
  | 'soy'
  | 'sesame';

export interface AllergenInfo {
  key: AllergenKey;
  label: string;      // שם הרגישות
  freeLabel: string;  // איך מסמנים פריט שמתאים
}

export const ALLERGENS: AllergenInfo[] = [
  { key: 'gluten', label: 'גלוטן', freeLabel: 'ללא גלוטן' },
  { key: 'lactose', label: 'לקטוז / חלב', freeLabel: 'ללא לקטוז' },
  { key: 'nuts', label: 'אגוזים', freeLabel: 'ללא אגוזים' },
  { key: 'peanuts', label: 'בוטנים', freeLabel: 'ללא בוטנים' },
  { key: 'eggs', label: 'ביצים', freeLabel: 'ללא ביצים' },
  { key: 'soy', label: 'סויה', freeLabel: 'ללא סויה' },
  { key: 'sesame', label: 'שומשום', freeLabel: 'ללא שומשום' }
];

export const getAllergen = (key: string) =>
  ALLERGENS.find(allergen => allergen.key === key);

export const toFreeFrom = (freeFrom: unknown): AllergenKey[] =>
  Array.isArray(freeFrom)
    ? freeFrom.filter((key): key is AllergenKey => Boolean(getAllergen(key)))
    : [];

// הרגישויות שהפריט לא מסומן כבטוח עבורן
export const missingAllergens = (freeFrom: unknown, required: string[]) => {
  const safe = toFreeFrom(freeFrom);
  return required.filter(key => !safe.includes(key as AllergenKey));
};

export const isSafeFor = (freeFrom: unknown, required: string[]) =>
  missingAllergens(freeFrom, required).length === 0;
