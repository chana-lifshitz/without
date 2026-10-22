// import './Recipes.scss';
// import React, { FC, useEffect, useMemo, useState } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router';
// import { useWineContext } from '../../context/WineContext';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../../redux/userSlice';
// import Products from '../Products/Products';

// import { RecipeModel } from '../../models/wine';
// import { GetAllWines, GetWinesByCategory, DeleteWine } from '../../service/wines';
// import AddWineForm from '../AddWineForm/AddWineForm';
// import { showMessage } from '../../redux/messageSlice';

// interface RecipesProps {}

// const Recipes: FC<RecipesProps> = () => {
  
//     // const navigate = useNavigate();
//     // const location = useLocation();
//     // const { setSelectedCategory } = useWineContext();
//     // const [showDropdown, setShowDropdown] = useState(false);
//     // const dispatch = useDispatch();


//     const myNavigate = useNavigate();
//       const dispatch = useDispatch();
//       const { selectedCategory } = useWineContext();
//       const [wines, setWines] = useState<RecipeModel[]>([]);
//       const [displayedCount, setDisplayedCount] = useState(20);
//       const [showAddForm, setShowAddForm] = useState(false);
    
//       const currentUser = JSON.parse(sessionStorage.getItem("user-data") || '{}');
//       const isAdmin = currentUser?.isAdmin === true;
    
//       useEffect(() => {
//         const fetchWines = selectedCategory && selectedCategory !== 'היינות שלנו'
//           ? GetWinesByCategory(selectedCategory)
//           : GetAllWines();
    
//         fetchWines
//           .then((response: any) => {
//             setWines(response.data.wines || response.data);
//             setDisplayedCount(20);
//           })
//           .catch(err => {
//             console.error(err);
//             dispatch(showMessage({
//               title: 'שגיאה',
//               body: 'אירעה שגיאה בעת טעינת היינות',
//               delay: 4000
//             }));
//           });
//       }, [selectedCategory, dispatch]);
    
//       // const visibleWines = useMemo(() => wines.slice(0, displayedCount), [wines, displayedCount]);
    
//       const handleLoadMore = () => {
//         setDisplayedCount(prev => Math.min(prev + 10, wines.length));
//       };
    
//       const handleDelete = async (id: string | number) => {
//         try {
//           const stringId = id.toString();
//           await DeleteWine(stringId);
//           setWines(prev => prev.filter(w => w.id.toString() !== stringId));
//           dispatch(showMessage({
//             title: 'הצלחה',
//             body: 'היין נמחק בהצלחה!',
//             delay: 3000
//           }));
//         } catch (error) {
//           console.error(error);
//           dispatch(showMessage({
//             title: 'שגיאה',
//             body: 'אירעה שגיאה במחיקת היין',
//             delay: 4000
//           }));
//         }
//       };

//   useEffect(() => {
//     const token = sessionStorage.getItem('my-token');
//     const userData = sessionStorage.getItem('user-data');
  
//     if (!token || !userData) {
//       myNavigate('/Login');
//     } else {
//       dispatch(setUser(JSON.parse(userData)));
//     }
//   }, []);
//   return(
//     <div className="visitor-center">

//      <div className="Home">
//       <nav className="navbar navbar-expand-lg navbar-light bg-light">
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav">
          
//             <li className="nav-item">
//               <a className="nav-link" onClick={() => { myNavigate('/Home/Wines') }}>לחמים</a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" onClick={() => { myNavigate('/Home/Wines') }}>עוגות</a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" onClick={() => { myNavigate('/Home/Wines') }}>קינוחים</a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" onClick={() => { myNavigate('/Home/Wines') }}>ארוחות</a>
//             </li>
//           </ul>
//         </div>
//       </nav>
   
//     </div>
//   </div>)
// };

// export default Recipes;
import './Recipes.scss';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

import { setUser } from '../../redux/userSlice';
import { showMessage } from '../../redux/messageSlice';

import { RecipeModel } from '../../models/wine';
import { GetAllWines, DeleteWine, AddWineReview, deleteWineReview } from '../../service/wines';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import ItemDetailsModal from '../ItemDetailsModal/ItemDetailsModal';
import { AllergenBadges, AllergenFilter, useAllergenFilter } from '../Allergens/Allergens';
import { LuChartNoAxesColumn, LuChefHat, LuClock, LuListChecks, LuTag, LuTrash2 } from 'react-icons/lu';
import { API_URL } from '../../config/api';
interface RecipesProps {}

const Recipes: FC<RecipesProps> = () => {
  const myNavigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [wines, setWines] = useState<RecipeModel[]>([]);
  const [displayedCount, setDisplayedCount] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  // אפשר לפתוח מתכון ישירות מ"הרשימה שלי"
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(
    location.state?.openId !== undefined ? String(location.state.openId) : null
  );
  const currentUser = JSON.parse(
    sessionStorage.getItem('user-data') || '{}'
  );
  const isAdmin = currentUser?.isAdmin === true;

  useEffect(() => {
    GetAllWines()
      .then((response: any) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.recipes || [];

        setWines(data);
        setDisplayedCount(20);
      })
      .catch((err) => {
        console.error(err);

        dispatch(
          showMessage({
            title: 'שגיאה',
            body: 'אירעה שגיאה בעת טעינת המתכונים',
            delay: 4000,
          })
        );
      });
  }, [dispatch]);

  useEffect(() => {
    const token = sessionStorage.getItem('my-token');
    const userData = sessionStorage.getItem('user-data');

    if (!token || !userData) {
      myNavigate('/Login');
    } else {
      dispatch(setUser(JSON.parse(userData)));
    }
  }, [myNavigate, dispatch]);

  const selectedRecipe = useMemo(
    () => wines.find((w) => String(w.id) === selectedRecipeId) || null,
    [wines, selectedRecipeId]
  );

  const closeRecipe = useCallback(() => setSelectedRecipeId(null), []);

  const replaceRecipe = (updated: RecipeModel) =>
    setWines((prev) =>
      prev.map((w) => (String(w.id) === String(updated.id) ? updated : w))
    );

  const handleAddReview = async (comment: string, stars: number) => {
    if (!selectedRecipe) return;
    try {
      const res = await AddWineReview(String(selectedRecipe.id), {
        clientId: currentUser?.id,
        clientName: currentUser?.name,
        comment,
        stars,
      });
      replaceRecipe(res.data);
      dispatch(showMessage({ title: 'הצלחה', body: 'הביקורת נשמרה', delay: 3000 }));
    } catch (err) {
      console.error(err);
      dispatch(showMessage({ title: 'שגיאה', body: 'שמירת הביקורת נכשלה', delay: 4000 }));
      throw err;
    }
  };

  const handleDeleteReview = async (index: number) => {
    if (!selectedRecipe) return;
    try {
      const res = await deleteWineReview(String(selectedRecipe.id), index, currentUser?.id);
      replaceRecipe(res.data);
    } catch (err) {
      console.error(err);
      dispatch(showMessage({ title: 'שגיאה', body: 'מחיקת הביקורת נכשלה', delay: 4000 }));
    }
  };

  const filteredWines = useMemo(() => {
    return wines.filter((wine) => {
      return (
        selectedCategory === 'הכל' ||
        wine.category === selectedCategory
      );
    });
  }, [wines, selectedCategory]);

    const { filtered: safeWines, filterProps } = useAllergenFilter(
    filteredWines,
    (wine: RecipeModel) => wine.freeFrom
  );

  const visibleWines = useMemo(() => {
    return safeWines.slice(0, displayedCount);
  }, [safeWines, displayedCount]);

  const handleLoadMore = () => {
    setDisplayedCount((prev) =>
      Math.min(prev + 10, safeWines.length)
    );
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('למחוק את המתכון מהאתר?')) return;
    try {
      const stringId = id.toString();

      await DeleteWine(stringId, currentUser?.id);

      setWines((prev) =>
        prev.filter((w) => w.id.toString() !== stringId)
      );

      dispatch(
        showMessage({
          title: 'הצלחה',
          body: 'המתכון נמחק בהצלחה',
          delay: 3000,
        })
      );
    } catch (err) {
      console.error(err);

      dispatch(
        showMessage({
          title: 'שגיאה',
          body: 'אירעה שגיאה במחיקת המתכון',
          delay: 4000,
        })
      );
    }
  };

  return (
    <div className="Recipes">
      <div className="Recipes-shell">
        <header className="page-header">
          <h1>מתכונים</h1>
          <p>לחמים, עוגות, קינוחים וארוחות - מסוננים לפי הרגישויות שלכם.</p>
        </header>

        <nav className="navbar">
          <ul className="navbar-nav">
            {['הכל', 'לחמים', 'עוגות', 'קינוחים', 'ארוחות'].map(cat => (
              <li className="nav-item" key={cat}>
                <button
                  className={`nav-link ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="recipes-filter">
          <AllergenFilter {...filterProps} />
          {visibleWines.length === 0 && (
            <p className="no-results">לא נמצאו מתכונים שמתאימים לסינון.</p>
          )}
        </div>

        {selectedRecipe && (
          <ItemDetailsModal
            title={selectedRecipe.name}
            imageUrl={selectedRecipe.image ? `${API_URL}/image/${selectedRecipe.image}` : undefined}
            fallbackIcon={<LuChefHat />}
            badges={[selectedRecipe.category, selectedRecipe.difficulty]}
            rating={selectedRecipe.rating}
            favorite={{ itemId: Number(selectedRecipe.id), type: 'recipe' }}
            allergens={{ freeFrom: selectedRecipe.freeFrom }}
            facts={[
              { icon: <LuClock />, label: 'זמן הכנה', value: selectedRecipe.preparationTime },
              { icon: <LuChartNoAxesColumn />, label: 'רמת קושי', value: selectedRecipe.difficulty },
              { icon: <LuTag />, label: 'קטגוריה', value: selectedRecipe.category },
              { icon: <LuListChecks />, label: 'מספר מרכיבים', value: selectedRecipe.ingredients?.length || undefined }
            ]}
            sections={[
              { title: 'מרכיבים', items: selectedRecipe.ingredients }
            ]}
            reviews={selectedRecipe.reviews}
            currentUserId={currentUser?.id}
            onAddReview={handleAddReview}
            onDeleteReview={handleDeleteReview}
            onClose={closeRecipe}
          />
        )}

        <div className="recipes-grid">
          {visibleWines.map((wine) => (
            <div
              className="recipe-card"
              key={wine.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedRecipeId(String(wine.id))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedRecipeId(String(wine.id));
              }}
            >
              <div className="recipe-media">
                {wine.image ? (
                  <img
                    className="product-image"
                    src={`${API_URL}/image/${wine.image}`}
                    alt={wine.name}
                  />
                ) : (
                  <LuChefHat className="recipe-media-icon" aria-hidden="true" />
                )}
                <div className="card-favorite">
                  <FavoriteButton itemId={Number(wine.id)} type="recipe" />
                </div>
              </div>

              <div className="recipe-body">
                <span className="card-category">{wine.category}</span>
                <h3>{wine.name}</h3>

                <div className="recipe-meta">
                  {wine.preparationTime && (
                    <span><LuClock size={15} aria-hidden="true" /> {wine.preparationTime}</span>
                  )}
                  {wine.difficulty && (
                    <span><LuChartNoAxesColumn size={15} aria-hidden="true" /> {wine.difficulty}</span>
                  )}
                </div>

                <AllergenBadges freeFrom={wine.freeFrom} />

                {isAdmin && (
                  <button
                    className="admin-delete-btn"
                    onClick={(e) => { e.stopPropagation(); handleDelete(wine.id); }}
                  >
                    <LuTrash2 size={15} aria-hidden="true" />
                    מחק
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayedCount < safeWines.length && (
          <div className="load-more-wrap">
            <button className="load-more-btn" onClick={handleLoadMore}>
              טען עוד
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;