import './Allergens.scss';
import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconType } from 'react-icons';
import {
  LuBean,
  LuCheck,
  LuEgg,
  LuLayoutGrid,
  LuLeaf,
  LuMilk,
  LuNut,
  LuSettings2,
  LuSprout,
  LuTriangleAlert,
  LuUtensils,
  LuWheat,
  LuX
} from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router';
import {
  ALLERGENS,
  AllergenKey,
  getAllergen,
  missingAllergens,
  toFreeFrom
} from '../../models/allergens';

/* =========================
   אייקון לכל רגישות
========================= */

const ALLERGEN_ICONS: Record<string, IconType> = {
  gluten: LuWheat,
  lactose: LuMilk,
  nuts: LuNut,
  peanuts: LuBean,
  eggs: LuEgg,
  soy: LuLeaf,
  sesame: LuSprout,
  // מפתחות נוספים שמשמשים בפורום
  general: LuUtensils,
  all: LuLayoutGrid
};

export const AllergenIcon: FC<{ allergenKey: string; size?: number; className?: string }> = ({
  allergenKey,
  size = 16,
  className
}) => {
  const Icon = ALLERGEN_ICONS[allergenKey] || LuUtensils;
  return <Icon size={size} className={className} aria-hidden="true" />;
};

export const useUserSensitivities = (): string[] => {
  const currentUser = useSelector((store: any) => store.userSlice.currentUser);
  return useMemo(
    () => (currentUser?.sensitivities || []).filter((key: string) => getAllergen(key)),
    [currentUser]
  );
};

/* =========================
   תגיות "ללא..." על כרטיס
========================= */

interface AllergenBadgesProps {
  freeFrom?: unknown;
  // כמה תגיות להציג לפני "+N"
  max?: number;
  // במסעדות: "יש מנות ללא..." במקום "ללא..."
  isRestaurant?: boolean;
}

export const AllergenBadges: FC<AllergenBadgesProps> = ({ freeFrom, max = 3, isRestaurant = false }) => {
  const sensitivities = useUserSensitivities();
  const safe = toFreeFrom(freeFrom);
  const missing = missingAllergens(freeFrom, sensitivities);

  // הרגישויות של המשתמש מוצגות ראשונות
  const ordered = [...safe].sort(
    (a, b) => Number(sensitivities.includes(b)) - Number(sensitivities.includes(a))
  );
  const shown = ordered.slice(0, max);
  const hidden = ordered.length - shown.length;

  if (safe.length === 0 && sensitivities.length === 0)
    return null;

  return (
    <div className="allergen-badges" onClick={e => e.stopPropagation()}>
      {sensitivities.length > 0 && (
        missing.length === 0 ? (
          <span className="allergen-badge match" title="מתאים לכל הרגישויות שלך">
            <LuCheck size={13} aria-hidden="true" />
            {isRestaurant ? 'יש מנות שמתאימות לך' : 'מתאים לך'}
          </span>
        ) : (
          <span
            className="allergen-badge warning"
            title={`לא מסומן: ${missing.map(key => getAllergen(key)?.freeLabel).join(', ')}`}
          >
            <LuTriangleAlert size={13} aria-hidden="true" />
            <span>לא מסומן {missing.map(key => getAllergen(key)?.freeLabel).join(', ')}</span>
          </span>
        )
      )}
      {shown.map(key => {
        const allergen = getAllergen(key)!;
        return (
          <span
            key={key}
            className={`allergen-badge${sensitivities.includes(key) ? ' mine' : ''}`}
          >
            {allergen.freeLabel}
          </span>
        );
      })}
      {hidden > 0 && (
        <span className="allergen-badge more" title={ordered.slice(max).map(key => getAllergen(key)?.freeLabel).join(', ')}>
          +{hidden}
        </span>
      )}
    </div>
  );
};

/* =========================
   סינון לפי רגישויות
========================= */

export const useAllergenFilter = <T,>(items: T[], getFreeFrom: (item: T) => unknown) => {
  const sensitivities = useUserSensitivities();
  const [matchMe, setMatchMe] = useState(true);
    const location = useLocation();
  // אפשר להגיע עם סינון מוכן, למשל מעמוד "מידע"
  const [selected, setSelected] = useState<AllergenKey[]>(() => {
    const initial = getAllergen(location.state?.freeFrom)?.key;
    return initial ? [initial] : [];
  });

  const required = useMemo(
    () => Array.from(new Set([...(matchMe ? sensitivities : []), ...selected])),
    [matchMe, sensitivities, selected]
  );

  const filtered = useMemo(
    () => required.length === 0
      ? items
      : items.filter(item => missingAllergens(getFreeFrom(item), required).length === 0),
    // getFreeFrom הוא פונקציה פשוטה שלא משתנה בין רינדורים
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, required]
  );

  const toggle = (key: AllergenKey) =>
    setSelected(current =>
      current.includes(key) ? current.filter(k => k !== key) : [...current, key]
    );

  return {
    filtered,
    filterProps: {
      sensitivities,
      matchMe,
      setMatchMe,
      selected,
      toggle,
      clear: () => {
        setSelected([]);
        setMatchMe(false);
      },
      total: items.length,
      shown: filtered.length
    }
  };
};

interface AllergenFilterProps {
  sensitivities: string[];
  matchMe: boolean;
  setMatchMe: (value: boolean) => void;
  selected: AllergenKey[];
  toggle: (key: AllergenKey) => void;
  clear: () => void;
  total: number;
  shown: number;
}

export const AllergenFilter: FC<AllergenFilterProps> = ({
  sensitivities,
  matchMe,
  setMatchMe,
  selected,
  toggle,
  clear,
  total,
  shown
}) => {
  const navigate = useNavigate();
  const myLabels = sensitivities.map(key => getAllergen(key)?.label).join(', ');
  const isFiltering = (matchMe && sensitivities.length > 0) || selected.length > 0;

  return (
    <div className="allergen-filter">
      <div className="allergen-filter-row">
        {sensitivities.length > 0 ? (
          <button
            type="button"
            className={`allergen-match-toggle${matchMe ? ' active' : ''}`}
            onClick={() => setMatchMe(!matchMe)}
            aria-pressed={matchMe}
            title={`הרגישויות שלך: ${myLabels}`}
          >
            <span className="switch" aria-hidden="true" />
            מתאים לי
            <small>({myLabels})</small>
          </button>
        ) : (
          <button
            type="button"
            className="allergen-setup-link"
            onClick={() => navigate('/Home/CustomerDetails', { state: { section: 'sensitivities' } })}
          >
            <LuSettings2 size={16} aria-hidden="true" />
            הגדירו את הרגישויות שלכם לסינון אוטומטי
          </button>
        )}

        <span className="allergen-filter-count">
          {isFiltering ? `${shown} מתוך ${total}` : `${total} פריטים`}
        </span>
      </div>

      <div className="allergen-chips" role="group" aria-label="סינון לפי רגישות">
        {ALLERGENS.map(allergen => {
          const fromProfile = matchMe && sensitivities.includes(allergen.key);
          const active = fromProfile || selected.includes(allergen.key);
          return (
            <button
              key={allergen.key}
              type="button"
              className={`allergen-chip${active ? ' active' : ''}${fromProfile ? ' locked' : ''}`}
              onClick={() => !fromProfile && toggle(allergen.key)}
              aria-pressed={active}
              title={fromProfile ? 'מסונן לפי הרגישויות שלך' : undefined}
            >
              <AllergenIcon allergenKey={allergen.key} size={15} />
              {allergen.freeLabel}
            </button>
          );
        })}
        {isFiltering && (
          <button type="button" className="allergen-clear" onClick={clear}>
            <LuX size={15} aria-hidden="true" />
            נקה סינון
          </button>
        )}
      </div>
    </div>
  );
};

/* =========================
   פירוט בחלון פרטים
========================= */

export const AllergenDetails: FC<{ freeFrom?: unknown; isRestaurant?: boolean }> = ({ freeFrom, isRestaurant = false }) => {
  const sensitivities = useUserSensitivities();
  const safe = toFreeFrom(freeFrom);
  const missing = missingAllergens(freeFrom, sensitivities);

  return (
    <div className="allergen-details">
      {sensitivities.length > 0 && (
        missing.length === 0 ? (
          <div className="allergen-alert ok">
            <LuCheck size={18} aria-hidden="true" />
            {isRestaurant
              ? 'במסעדה יש מנות שמתאימות לכל הרגישויות שלך'
              : 'מתאים לכל הרגישויות שלך'}
          </div>
        ) : (
          <div className="allergen-alert warn">
            <LuTriangleAlert size={18} aria-hidden="true" />
            <span>
              שימו לב: {isRestaurant ? 'המסעדה לא מסומנת כמציעה מנות' : 'הפריט לא מסומן'}{' '}
              {missing.map(key => getAllergen(key)?.freeLabel).join(', ')}
            </span>
          </div>
        )
      )}

      {safe.length > 0 ? (
        <div className="allergen-badges large">
          {safe.map(key => {
            const allergen = getAllergen(key)!;
            return (
              <span
                key={key}
                className={`allergen-badge${sensitivities.includes(key) ? ' mine' : ''}`}
              >
                <AllergenIcon allergenKey={key} size={14} />
                {allergen.freeLabel}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="allergen-note">אין מידע על רגישויות לפריט הזה.</p>
      )}

      <p className="allergen-note">
        הסימון מבוסס על רשימת המרכיבים ועשוי שלא לכלול חשש לעקבות. יש לבדוק תמיד את התווית או לברר במקום.
      </p>
    </div>
  );
};
