// // import React, { FC, useEffect, useState, useMemo } from 'react';
// import './Wines.scss';
// // import { useNavigate } from 'react-router';
// // import { RecipeModel } from '../../models/wine';
// // import { GetAllWines, GetWinesByCategory, DeleteWine } from '../../service/wines';
// // import { useWineContext } from '../../context/WineContext';
// // import AddWineForm from '../AddWineForm/AddWineForm';
// // import { useDispatch } from 'react-redux';
// // import { showMessage } from '../../redux/messageSlice';

// // const Wines: FC = () => {
// //   const myNavigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const { selectedCategory } = useWineContext();
// //   const [recipes, setRecipes] = useState<RecipeModel[]>([]);
// //   const [displayedCount, setDisplayedCount] = useState(20);
// //   const [showAddForm, setShowAddForm] = useState(false);

// //   const currentUser = JSON.parse(sessionStorage.getItem("user-data") || '{}');
// //   const isAdmin = currentUser?.isAdmin === true;

// //   useEffect(() => {
// //     const fetchWines = 
// //     // selectedCategory && selectedCategory !== 'היינות שלנו'
// //     //   ? GetWinesByCategory(selectedCategory)
// //       // : 
// //       GetAllWines();

// //     fetchWines
// //       .then((response: any) => {
// //         setRecipes(response.data.recipes || response.data);
// //         setDisplayedCount(20);
// //       })
// //       .catch(err => {
// //         console.error(err);
// //         dispatch(showMessage({
// //           title: 'שגיאה',
// //           body: 'אירעה שגיאה בעת טעינת היינות',
// //           delay: 4000
// //         }));
// //       });
// //   }, [selectedCategory, dispatch]);

// //   const visibleWines = useMemo(() => recipes.slice(0, displayedCount), [recipes, displayedCount]);

// //   const handleLoadMore = () => {
// //     setDisplayedCount(prev => Math.min(prev + 10, recipes.length));
// //   };

// //   const handleDelete = async (id: string | number) => {
// //     try {
// //       const stringId = id.toString();
// //       await DeleteWine(stringId);
// //       setRecipes(prev => prev.filter(w => w.id.toString() !== stringId));
// //       dispatch(showMessage({
// //         title: 'הצלחה',
// //         body: 'היין נמחק בהצלחה!',
// //         delay: 3000
// //       }));
// //     } catch (error) {
// //       console.error(error);
// //       dispatch(showMessage({
// //         title: 'שגיאה',
// //         body: 'אירעה שגיאה במחיקת היין',
// //         delay: 4000
// //       }));
// //     }
// //   };

// //   return (
// //     <div className="Wines">
// //       <h2 style={{ textAlign: 'center' }}>{selectedCategory || 'כל היינות'}</h2>

// //       {isAdmin && (
// //         <button
// //           className="add-wine-btn"
// //           onClick={() => myNavigate('/add-wine')}
// //           style={{ marginBottom: '1rem' }}
// //         >
// //           הוסף יין חדש
// //         </button>
// //       )}

// //       {showAddForm && (
// //         <AddWineForm
// //           onClose={() => setShowAddForm(false)}
// //           onWineAdded={(newWine) => {
// //             setRecipes(prev => [newWine, ...prev]);
// //             setShowAddForm(false);
// //           }}
// //         />
// //       )}

// //       <div className="wine-grid">
// //         {visibleWines.map((w: RecipeModel) => (
// //           <div
// //             key={w.id}
// //             className="wine-card"
// //             onClick={() => myNavigate('/WineDetails', { state: { id: w.id } })}
// //           >
// //             <h3>{w.name}</h3>
// //             <img
// //               className="product-image"
// //               // src={`http://localhost:2000/image/${w.image}`}
// //               alt={w.name}
// //             />

// //             {isAdmin && (
// //               <button
// //                 className="delete-btn"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   handleDelete(w.id);
// //                 }}
// //                 title="מחק יין"
// //                 type="button"
// //               >
// //                 <img
// //                   src="/images/פח.png"
// //                   alt="מחק"
// //                   style={{ width: '20px', height: '20px' }}
// //                 />
// //               </button>
// //             )}
// //           </div>
// //         ))}
// //       </div>

// //       {displayedCount < recipes.length && (
// //         <div style={{ textAlign: 'center', marginTop: '1rem' }}>
// //           <button className="load-more-btn" onClick={handleLoadMore}>
// //             טען עוד
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Wines;
// import React, { FC, useEffect, useState, useMemo } from 'react';
// // import './Recipes.scss';
// import { useNavigate } from 'react-router';
// import { RecipeModel } from '../../models/wine';
// import { GetAllWines,DeleteWine } from '../../service/wines';
// import AddWineForm from '../AddWineForm/AddWineForm';
// import { useDispatch } from 'react-redux';
// import { showMessage } from '../../redux/messageSlice';

// const Recipes: FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [recipes, setRecipes] = useState<RecipeModel[]>([]);
//   const [displayedCount, setDisplayedCount] = useState(20);
//   const [showAddForm, setShowAddForm] = useState(false);

//   const currentUser = JSON.parse(sessionStorage.getItem('user-data') || '{}');
//   const isAdmin = currentUser?.isAdmin === true;

//   useEffect(() => {
//     GetAllWines()
//       .then((response: any) => {
//         // הגנה מלאה – לא משנה איך ה־API מחזיר
//         const data = Array.isArray(response.data)
//           ? response.data
//           : response.data?.recipes || [];

//         setRecipes(data);
//         setDisplayedCount(20);
//       })
//       .catch(err => {
//         console.error(err);
//         dispatch(
//           showMessage({
//             title: 'שגיאה',
//             body: 'אירעה שגיאה בעת טעינת המתכונים',
//             delay: 4000
//           })
//         );
//       });
//   }, [dispatch]);

//   const visibleRecipes = useMemo(
//     () => recipes.slice(0, displayedCount),
//     [recipes, displayedCount]
//   );

//   const handleLoadMore = () => {
//     setDisplayedCount(prev => Math.min(prev + 10, recipes.length));
//   };

//   const handleDelete = async (id: string | number) => {
//     try {
//       const stringId = id.toString();
//       await DeleteWine(stringId);
//       setRecipes(prev => prev.filter(r => r.id.toString() !== stringId));

//       dispatch(
//         showMessage({
//           title: 'הצלחה',
//           body: 'המתכון נמחק בהצלחה',
//           delay: 3000
//         })
//       );
//     } catch (error) {
//       console.error(error);
//       dispatch(
//         showMessage({
//           title: 'שגיאה',
//           body: 'אירעה שגיאה במחיקת המתכון',
//           delay: 4000
//         })
//       );
//     }
//   };

//   return (
//     <div className="Recipes">
//       <h2 style={{ textAlign: 'center' }}>כל המתכונים</h2>

//       {isAdmin && (
//         <button
//           className="add-recipe-btn"
//           onClick={() => navigate('/add-recipe')}
//           style={{ marginBottom: '1rem' }}
//         >
//           הוסף מתכון חדש
//         </button>
//       )}

//       {showAddForm && (
//         <AddWineForm
//           onClose={() => setShowAddForm(false)}
//           onWineAdded={(newRecipe) => {
//             setRecipes(prev => [newRecipe, ...prev]);
//             setShowAddForm(false);
//           }}
//         />
//       )}

//       <div className="recipe-grid">
//         {visibleRecipes.map((r: RecipeModel) => (
//           <div
//             key={r.id}
//             className="recipe-card"
//             onClick={() =>
//               navigate('/WineDetails', { state: { id: r.id } })
//             }
//           >
//             <h3>{r.name}</h3>
//             {r.image && (
//               <img
//                 className="product-image"
//                 src={`http://localhost:2000/image/${r.image}`}
//                 alt={r.name}
//               />
//             )}

            
//             <p>{r.preparationTime}</p>
//             <p>רמת קושי: {r.difficulty}</p>

//             {isAdmin && (
//               <button
//                 className="delete-btn"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDelete(r.id);
//                 }}
//                 title="מחק מתכון"
//                 type="button"
//               >
//                 
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {displayedCount < recipes.length && (
//         <div style={{ textAlign: 'center', marginTop: '1rem' }}>
//           <button className="load-more-btn" onClick={handleLoadMore}>
//             טען עוד
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Recipes;


import React, { FC, useEffect, useState, useMemo } from 'react';
import './Wines.scss';

import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { RecipeModel } from '../../models/wine';

import {
  GetAllWines,
  GetWinesByCategory,
  DeleteWine
} from '../../service/wines';

import AddWineForm from '../AddWineForm/AddWineForm';

import { useDispatch } from 'react-redux';
import { showMessage } from '../../redux/messageSlice';
import { API_URL } from '../../config/api';

const Wines: FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');

  const [recipes, setRecipes] = useState<RecipeModel[]>([]);
  const [displayedCount, setDisplayedCount] = useState(20);
  const [showAddForm, setShowAddForm] = useState(false);

  const currentUser = JSON.parse(
    sessionStorage.getItem('user-data') || '{}'
  );

  const isAdmin = currentUser?.isAdmin === true;

  useEffect(() => {

    const fetchData = category
      ? GetWinesByCategory(category)
      : GetAllWines();

    fetchData
      .then((response: any) => {

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.recipes || [];

        setRecipes(data);

        setDisplayedCount(20);
      })
      .catch(err => {

        console.error(err);

        dispatch(
          showMessage({
            title: 'שגיאה',
            body: 'אירעה שגיאה בעת טעינת המתכונים',
            delay: 4000
          })
        );
      });

  }, [category, dispatch]);

  const visibleRecipes = useMemo(
    () => recipes.slice(0, displayedCount),
    [recipes, displayedCount]
  );

  const handleLoadMore = () => {
    setDisplayedCount(prev =>
      Math.min(prev + 10, recipes.length)
    );
  };

  const handleDelete = async (id: string | number) => {

    try {

      const stringId = id.toString();

      await DeleteWine(stringId);

      setRecipes(prev =>
        prev.filter(r => r.id.toString() !== stringId)
      );

      dispatch(
        showMessage({
          title: 'הצלחה',
          body: 'המתכון נמחק בהצלחה',
          delay: 3000
        })
      );

    } catch (error) {

      console.error(error);

      dispatch(
        showMessage({
          title: 'שגיאה',
          body: 'אירעה שגיאה במחיקת המתכון',
          delay: 4000
        })
      );
    }
  };

  return (
    <div className="Recipes">

      <h2 style={{ textAlign: 'center' }}>
        {category || 'כל המתכונים'}
      </h2>

      {isAdmin && (
        <button
          className="add-recipe-btn"
          onClick={() => navigate('/add-recipe')}
          style={{ marginBottom: '1rem' }}
        >
          הוסף מתכון חדש
        </button>
      )}

      {showAddForm && (
        <AddWineForm
          onClose={() => setShowAddForm(false)}
          onWineAdded={(newRecipe) => {

            setRecipes(prev => [newRecipe, ...prev]);

            setShowAddForm(false);
          }}
        />
      )}

      <div className="recipe-grid">

        {visibleRecipes.map((r: RecipeModel) => (

          <div
            key={r.id}
            className="recipe-card"
            onClick={() =>
              navigate('/WineDetails', {
                state: { id: r.id }
              })
            }
          >

            <h3>{r.name}</h3>

            {r.image && (
              <img
                className="product-image"
                src={`${API_URL}/image/${r.image}`}
                alt={r.name}
              />
            )}

            <p>{r.preparationTime}</p>

            <p>
              רמת קושי: {r.difficulty}
            </p>

            {isAdmin && (
              <button
                className="delete-btn"
                onClick={(e) => {

                  e.stopPropagation();

                  handleDelete(r.id);
                }}
                title="מחק מתכון"
                type="button"
              >
                מחק
              </button>
            )}

          </div>
        ))}

      </div>

      {displayedCount < recipes.length && (

        <div
          style={{
            textAlign: 'center',
            marginTop: '1rem'
          }}
        >

          <button
            className="load-more-btn"
            onClick={handleLoadMore}
          >
            טען עוד
          </button>

        </div>
      )}

    </div>
  );
};

export default Wines;