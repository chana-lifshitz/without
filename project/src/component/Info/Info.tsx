import './Info.scss';
import React, { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ALLERGENS, AllergenKey, getAllergen } from '../../models/allergens';
import { ALLERGEN_GUIDES, GENERAL_TIPS } from '../../data/allergenInfo';
import { AllergenIcon, useUserSensitivities } from '../Allergens/Allergens';
import { IconType } from 'react-icons';
import {
  LuBan,
  LuChefHat,
  LuCircleCheck,
  LuCookingPot,
  LuLightbulb,
  LuMessagesSquare,
  LuSearch,
  LuShoppingBasket,
  LuSiren,
  LuTag,
  LuThumbsUp,
  LuUtensils
} from 'react-icons/lu';

const TIP_ICONS: Record<string, IconType> = {
  label: LuTag,
  kitchen: LuCookingPot,
  restaurant: LuUtensils,
  emergency: LuSiren
};

interface InfoProps {}

const InfoList: FC<{ title: string; icon: IconType; items: string[]; variant?: string }> = ({ title, icon: Icon, items, variant }) => (
  <div className={`info-block${variant ? ` ${variant}` : ''}`}>
    <h3><Icon size={18} aria-hidden="true" /> {title}</h3>
    <ul>
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  </div>
);

const Info: FC<InfoProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sensitivities = useUserSensitivities();

  // פותחים על רגישות שנשלחה בקישור, אחרת על הרגישות הראשונה של המשתמש
  const initialKey = (getAllergen(location.state?.allergen)?.key
    || getAllergen(sensitivities[0])?.key
    || 'gluten') as AllergenKey;
  const [activeKey, setActiveKey] = useState<AllergenKey>(initialKey);
  const [userPicked, setUserPicked] = useState(false);

  // אם הרגישויות נטענו מהשרת אחרי שהעמוד נפתח - עוברים אליהן
  useEffect(() => {
    if (!userPicked && !location.state?.allergen && sensitivities[0] && getAllergen(sensitivities[0]))
      setActiveKey(sensitivities[0] as AllergenKey);
  }, [sensitivities, userPicked, location.state]);

  const guide = ALLERGEN_GUIDES.find(g => g.key === activeKey) || ALLERGEN_GUIDES[0];
  const allergen = getAllergen(guide.key)!;

  const goTo = (route: string) =>
    navigate(route, { state: { freeFrom: guide.key } });

  return (
    <div className="Info">
      <div className="Info-shell">

        <section className="info-hero">
          <h1>מידע על רגישויות מזון</h1>
          <p>
            מה מותר, ממה להיזהר, איפה האלרגן מסתתר ובמה אפשר להחליף - לכל רגישות.
          </p>
        </section>

        <div className="info-tabs" role="tablist" aria-label="בחירת רגישות">
          {ALLERGENS.map(item => (
            <button
              key={item.key}
              role="tab"
              aria-selected={activeKey === item.key}
              className={`info-tab${activeKey === item.key ? ' active' : ''}${sensitivities.includes(item.key) ? ' mine' : ''}`}
              onClick={() => {
                setActiveKey(item.key);
                setUserPicked(true);
              }}
            >
              <AllergenIcon allergenKey={item.key} size={20} className="info-tab-icon" />
              {item.label}
            </button>
          ))}
        </div>

        <article className="info-guide" role="tabpanel">
          <header className="info-guide-header">
            <span className="info-guide-icon">
              <AllergenIcon allergenKey={guide.key} size={28} />
            </span>
            <div>
              <h2>{guide.title}</h2>
              {sensitivities.includes(guide.key) && (
                <span className="info-mine-badge">מהרגישויות שלך</span>
              )}
            </div>
          </header>

          <p className="info-summary">{guide.summary}</p>

          {guide.note && (
            <p className="info-note">
              <LuLightbulb size={18} aria-hidden="true" />
              <span>{guide.note}</span>
            </p>
          )}

          <div className="info-grid">
            <InfoList title="ממה להימנע" icon={LuBan} items={guide.avoid} variant="avoid" />
            <InfoList title="איפה זה מסתתר" icon={LuSearch} items={guide.hidden} variant="hidden" />
            <InfoList title="במה אפשר להחליף" icon={LuCircleCheck} items={guide.substitutes} variant="substitutes" />
            <InfoList title="טיפים" icon={LuThumbsUp} items={guide.tips} />
          </div>

          <div className="info-label-words">
            <h3><LuTag size={18} aria-hidden="true" /> מילים לחפש בתווית</h3>
            <div className="info-chips">
              {guide.labelWords.map(word => (
                <span key={word} className="info-chip">{word}</span>
              ))}
            </div>
          </div>

          <div className="info-links">
            <span>למצוא {allergen.freeLabel}:</span>
            <button onClick={() => goTo('/Home/Products')}><LuShoppingBasket size={16} aria-hidden="true" /> מוצרים</button>
            <button onClick={() => goTo('/Home/Recipes')}><LuChefHat size={16} aria-hidden="true" /> מתכונים</button>
            <button onClick={() => goTo('/Home/Restaurants')}><LuUtensils size={16} aria-hidden="true" /> מסעדות</button>
            <button onClick={() => navigate('/Home/forum', { state: { sensitivity: guide.key } })}><LuMessagesSquare size={16} aria-hidden="true" /> פורום {allergen.label}</button>
          </div>
        </article>

        <section className="info-general">
          <h2>חשוב לכל רגישות</h2>
          <div className="info-general-grid">
            {GENERAL_TIPS.map(tip => {
              const TipIcon = TIP_ICONS[tip.icon] || LuLightbulb;
              return (
              <div key={tip.title} className={`info-general-card${tip.icon === 'emergency' ? ' emergency' : ''}`}>
                <span className="info-general-icon"><TipIcon size={20} aria-hidden="true" /></span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </div>
              );
            })}
          </div>
        </section>

        <p className="info-disclaimer">
          המידע בעמוד הוא כללי ואינו מחליף ייעוץ רפואי. לאבחון ולהתאמה אישית יש לפנות לרופא, לאלרגולוג או לדיאטנית.
        </p>

      </div>
    </div>
  );
};

export default Info;
