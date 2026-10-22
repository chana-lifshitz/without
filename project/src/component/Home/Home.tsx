import React, { FC, useEffect, useState } from 'react';
import './Home.scss';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useWineContext } from '../../context/WineContext';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { GetCustomerById } from '../../service/wines';
import { SITE_LOGO, SITE_NAME, SITE_TAGLINE } from '../../config/site';
import { LuHeart, LuMenu, LuX } from 'react-icons/lu';

interface HomeProps { }

const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedCategory } = useWineContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
 const dispatch = useDispatch();

 useEffect(()=>{
   let token= sessionStorage.getItem('my-token');
   if(!token){
    navigate('/Login')
   }
  },[])
useEffect(() => {
  const token = sessionStorage.getItem('my-token');
  const userData = sessionStorage.getItem('user-data');

  if (!token || !userData) {
    navigate('/Login');
    } else {
    const user = JSON.parse(userData);
    dispatch(setUser(user));

    // טוענים מהשרת את הרשימה האישית העדכנית
    if (user?.id !== undefined) {
      GetCustomerById(user.id)
        .then(res => {
          const serverUser = res.data?.data;
          if (!serverUser) return;
          const syncedUser = {
            ...user,
            favoriteRecipes: serverUser.favoriteRecipes || [],
            favoriteProducts: serverUser.favoriteProducts || [],
            favoriteRestaurants: serverUser.favoriteRestaurants || [],
            followedForums: serverUser.followedForums || [],
            sensitivities: serverUser.sensitivities || []
          };
          dispatch(setUser(syncedUser));
          sessionStorage.setItem('user-data', JSON.stringify(syncedUser));
        })
        .catch(err => console.error('שגיאה בטעינת הרשימה שלי:', err));
    }
  }
}, []);
  // const categories = [
  //   "יינות מיוחדים",
  //    "יינות רוזה",
  //   "יינות לבנים",
  //   "יינות אדומים",
  //   "היינות שלנו"
  // ];


  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setShowDropdown(false);
    navigate('/Home/Wines');
  };

  const navItems = [
    { path: '/Home/About', label: 'ראשי' },
    { path: '/Home/Products', label: 'מוצרים' },
    { path: '/Home/Recipes', label: 'מתכונים' },
    { path: '/Home/Restaurants', label: 'מסעדות' },
    { path: '/Home/forum', label: 'פורום' },
    { path: '/Home/Info', label: 'מידע על רגישויות' }
  ];

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase() ||
    (path === '/Home/About' && location.pathname.replace(/\/$/, '').toLowerCase() === '/home');

  const go = (path: string) => {
    setMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="Home">
      <header className="site-header">
        <div className="site-header-inner">
          <a
            className="site-brand"
            href="/Home"
            aria-label={`${SITE_NAME} - לעמוד הבית`}
            onClick={(e) => {
              e.preventDefault();
              go('/Home/About');
            }}
          >
            <img src={SITE_LOGO} className="brand-logo" alt="" />
            <span className="brand-text">{SITE_NAME}</span>
          </a>

          <nav className={`site-nav${menuOpen ? ' open' : ''}`} aria-label="ניווט ראשי">
            <ul>
              {navItems.map(item => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.path);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-actions">
            <button
              type="button"
              className={`my-list-link${isActive('/Home/CustomerDetails') ? ' active' : ''}`}
              onClick={() => go('/Home/CustomerDetails')}
            >
              <LuHeart size={18} aria-hidden="true" />
              <span>הרשימה שלי</span>
            </button>
            <button
              type="button"
              className="menu-toggle"
              aria-label={menuOpen ? 'סגירת תפריט' : 'פתיחת תפריט'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(open => !open)}
            >
              {menuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <img src={SITE_LOGO} alt="" />
            <div>
              <strong>{SITE_NAME}</strong>
              <span>{SITE_TAGLINE}</span>
            </div>
          </div>
          <p>
            המידע באתר כללי ואינו תחליף לבדיקת התווית או לייעוץ רפואי.
          </p>
          <span className="footer-copy">© {new Date().getFullYear()} {SITE_NAME}</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
