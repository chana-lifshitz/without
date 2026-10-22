import React, { FC } from 'react';
import { useNavigate } from 'react-router';
import {
  LuArrowLeft,
  LuChefHat,
  LuInfo,
  LuMessagesSquare,
  LuShoppingBasket,
  LuUtensils
} from 'react-icons/lu';
import './About.scss';
import { ALLERGENS } from '../../models/allergens';
import { SITE_NAME } from '../../config/site';
import { AllergenIcon } from '../Allergens/Allergens';

interface AboutProps {}

const SECTIONS = [
  {
    path: '/Home/Products',
    icon: LuShoppingBasket,
    title: 'מוצרים',
    text: 'מוצרים מהסופר עם פירוט מרכיבים, כשרות וביקורות של הקהילה.'
  },
  {
    path: '/Home/Recipes',
    icon: LuChefHat,
    title: 'מתכונים',
    text: 'לחמים, עוגות וארוחות שמתאימים לרגישויות שלכם.'
  },
  {
    path: '/Home/Restaurants',
    icon: LuUtensils,
    title: 'מסעדות',
    text: 'מקומות שיודעים להכין מנות בטוחות, לפי עיר וסוג.'
  },
  {
    path: '/Home/forum',
    icon: LuMessagesSquare,
    title: 'פורום',
    text: 'שאלות, המלצות ותשובות של מומחים - לכל רגישות.'
  }
];

const About: FC<AboutProps> = () => {
  const navigate = useNavigate();
  const goToSensitivities = () =>
    navigate('/Home/CustomerDetails', { state: { section: 'sensitivities' } });

  return (
    <div className="About">
      <section className="about-hero">
        <div className="about-hero-text">
          <span className="about-eyebrow">לאנשים עם רגישויות ואלרגיות למזון</span>
          <h1>אוכל טוב, בלי לבדוק כל תווית לבד.</h1>
          <p>
            {SITE_NAME} התחיל כקהילה לאנשים עם צליאק, והיום הוא בית לכל מי שחי עם רגישות למזון.
            מגדירים פעם אחת מה לא מתאים לכם, ורואים רק מוצרים, מתכונים ומסעדות שכן.
          </p>
          <div className="about-hero-actions">
            <button className="btn-primary" onClick={goToSensitivities}>
              להגדרת הרגישויות שלי
            </button>
            <button className="btn-secondary" onClick={() => navigate('/Home/Products')}>
              לחיפוש מוצרים
            </button>
          </div>
        </div>

        <aside className="about-allergens" aria-label="הרגישויות שאנחנו מכסים">
          <h2>הרגישויות שאנחנו מכסים</h2>
          <ul>
            {ALLERGENS.map(allergen => (
              <li key={allergen.key}>
                <span className="about-allergen-icon">
                  <AllergenIcon allergenKey={allergen.key} size={18} />
                </span>
                {allergen.label}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="about-section">
        <h2>מה תמצאו כאן</h2>
        <div className="about-cards">
          {SECTIONS.map(({ path, icon: Icon, title, text }) => (
            <button key={path} className="about-card" onClick={() => navigate(path)}>
              <span className="about-card-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="about-card-link">
                למעבר ל{title}
                <LuArrowLeft size={16} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>איך זה עובד</h2>
        <ol className="about-steps">
          <li>
            <span className="about-step-number">1</span>
            <h3>מגדירים רגישויות</h3>
            <p>באזור האישי מסמנים את הרגישויות שלכם - אחת או כמה.</p>
          </li>
          <li>
            <span className="about-step-number">2</span>
            <h3>רואים רק מה שמתאים</h3>
            <p>מוצרים, מתכונים ומסעדות מסוננים אוטומטית, וליד כל פריט מופיע אם הוא מתאים לכם.</p>
          </li>
          <li>
            <span className="about-step-number">3</span>
            <h3>שומרים ומשתפים</h3>
            <p>שומרים ל"רשימה שלי" את מה שאהבתם, ושואלים את הקהילה והמומחים בפורום.</p>
          </li>
        </ol>
      </section>

      <section className="about-disclaimer">
        <LuInfo size={20} aria-hidden="true" />
        <div>
          <h2>חשוב לדעת</h2>
          <p>
            הסימון "ללא..." באתר מבוסס על רשימת המרכיבים ועל מידע מהקהילה, ואינו תחליף לבדיקת התווית או לבירור במסעדה.
            במקרה של אלרגיה חמורה יש להתייעץ עם רופא או דיאטנית.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
