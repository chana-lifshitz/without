// // // import './Restaurants.scss';
// // // import React, { FC, useEffect, useState } from 'react';
// // // import { Outlet, useNavigate, useLocation } from 'react-router';
// // // import { useWineContext } from '../../context/WineContext';
// // // import { useDispatch } from 'react-redux';
// // // import { setUser } from '../../redux/userSlice';
// // // import Products from '../Products/Products';

// // // interface RestaurantsProps {}

// // // const Restaurants: FC<RestaurantsProps> = () => {
// // //     const navigate = useNavigate();
// // //     const location = useLocation();
// // //     const { setSelectedCategory } = useWineContext();
// // //     const [showDropdown, setShowDropdown] = useState(false);
// // //     const dispatch = useDispatch();

// // //   useEffect(() => {
// // //     const token = sessionStorage.getItem('my-token');
// // //     const userData = sessionStorage.getItem('user-data');
  
// // //     if (!token || !userData) {
// // //       navigate('/Login');
// // //     } else {
// // //       dispatch(setUser(JSON.parse(userData)));
// // //     }
// // //   }, []);
// // //     return(
// // //   <div className="visitor-center">

// // //      <div className="Home">
// // //       <nav className="navbar navbar-expand-lg navbar-light bg-light">
// // //         <div className="collapse navbar-collapse" id="navbarNav">
// // //           <ul className="navbar-nav">
          
// // //             <li className="nav-item">
// // //               <a className="nav-link" onClick={() => { navigate('/Home/Wines') }}>מסעדות בשריות</a>
// // //             </li>
// // //             <li className="nav-item">
// // //               <a className="nav-link" onClick={() => { navigate('/Home/Wines') }}>מסעדות חלביות</a>
// // //             </li>
// // //             <li className="nav-item">
// // //               <a className="nav-link" onClick={() => { navigate('/Home/Wines') }}>בתי קפה</a>
// // //             </li>
// // //           </ul>
// // //         </div>
// // //       </nav>
   
// // //   </div>
// // //   </div>)
// // // };

// // // export default Restaurants;
// // import './Restaurants.scss';
// // // import React, { FC, useEffect, useState } from 'react';
// // // import { useNavigate } from 'react-router';
// // // import { useWineContext } from '../../context/WineContext';
// // // import { useDispatch } from 'react-redux';
// // // import { setUser } from '../../redux/userSlice';
// // // import Products from '../Products/Products';


// // import React, { FC, useEffect, useState, useMemo } from 'react';
// // // import './Recipes.scss';
// // import { useNavigate } from 'react-router';
// // import { RestaurantModel } from '../../models/restaurant';
// // import { GetAllRestaurants,DeleteWine } from '../../service/wines';
// // import AddWineForm from '../AddWineForm/AddWineForm';
// // import { useDispatch } from 'react-redux';
// // import { showMessage } from '../../redux/messageSlice';
  


// // interface RestaurantsProps {}

// // type RestaurantType = 'meat' | 'dairy' | 'cafe' | null;

// // const Restaurants: FC<RestaurantsProps> = () => {
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();

// //   const [Restaurants, setRestaurants] = useState<RestaurantModel[]>([]);
// //   const [displayedCount, setDisplayedCount] = useState(20);
// //   const [showAddForm, setShowAddForm] = useState(false);

// //   const currentUser = JSON.parse(sessionStorage.getItem('user-data') || '{}');
// //   const isAdmin = currentUser?.isAdmin === true;

// //   useEffect(() => {
// //     GetAllRestaurants()
// //       .then((response: any) => {
// //         // הגנה מלאה – לא משנה איך ה־API מחזיר
// //         const data = Array.isArray(response.data)
// //           ? response.data
// //           : response.data?.restaurants || [];          

// //         setRestaurants(data);
// //         setDisplayedCount(20);
// //       })
// //       .catch(err => {
// //         console.error(err);
// //         dispatch(
// //           showMessage({
// //             title: 'שגיאה',
// //             body: 'אירעה שגיאה בעת טעינת המתכונים',
// //             delay: 4000
// //           })
// //         );
// //       });
// //   }, [dispatch]);

// //   const visibleRestaurants = useMemo(
// //     () => Restaurants.slice(0, displayedCount),
// //     [Restaurants, displayedCount]
// //   );

// //   const handleLoadMore = () => {
// //     setDisplayedCount(prev => Math.min(prev + 10, Restaurants.length));
// //   };

// //   const handleDelete = async (id: string | number) => {
// //     try {
// //       const stringId = id.toString();
// //       await DeleteWine(stringId);
// //       setRestaurants(prev => prev.filter(r => r.id.toString() !== stringId));

// //       dispatch(
// //         showMessage({
// //           title: 'הצלחה',
// //           body: 'המסעדה נמחקה בהצלחה',
// //           delay: 3000
// //         })
// //       );
// //     } catch (error) {
// //       console.error(error);
// //       dispatch(
// //         showMessage({
// //           title: 'שגיאה',
// //           body: 'אירעה שגיאה במחיקת המסעדה',
// //           delay: 4000
// //         })
// //       );
// //     }
// //   };

// //   return (
// //     <div className="Restaurants">
// //       <h2 style={{ textAlign: 'center' }}>כל המסעדות</h2>

// //       {isAdmin && (
// //         <button
// //           className="add-restaurant-btn"
// //           onClick={() => navigate('/add-restaurant')}
// //           style={{ marginBottom: '1rem' }}
// //         >
// //           הוסף מסעדה חדשה
// //         </button>
// //       )}

// //       {showAddForm && (
// //         <AddWineForm
// //           onClose={() => setShowAddForm(false)}
// //           onWineAdded={(newRestaurant) => {
// //             setRestaurants(prev => [newRestaurant, ...prev]);
// //             setShowAddForm(false);
// //           }}
// //         />
// //       )}

// //       <div className="recipe-grid">
// //         {visibleRestaurants.map((r: RestaurantModel) => (
// //           <div
// //             key={r.id}
// //             className="recipe-card"
// //             onClick={() =>
// //               navigate('/RestaurantDetails', { state: { id: r.id } })
// //             }
// //           >
// //             <h3>{r.name}</h3>
// //             {/* {r.image && (
// //               <img
// //                 className="product-image"
// //                 src={`http://localhost:2000/image/${r.image}`}
// //                 alt={r.name}
// //               />
// //             )} */}

            
// //             <p>{r.city}</p>
// //             <p> כתובת: {r.address}</p>

// //             {isAdmin && (
// //               <button
// //                 className="delete-btn"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   handleDelete(r.id);
// //                 }}
// //                 title="מחק מסעדה"
// //                 type="button"
// //               >
// //                 🗑️
// //               </button>
// //             )}
// //           </div>
// //         ))}
// //       </div>

// //       {displayedCount < Restaurants.length && (
// //         <div style={{ textAlign: 'center', marginTop: '1rem' }}>
// //           <button className="load-more-btn" onClick={handleLoadMore}>
// //             טען עוד
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
// // //   const navigate = useNavigate();
// // //   const dispatch = useDispatch();
// // //   const { setSelectedCategory } = useWineContext();

// // //   const [selectedType, setSelectedType] = useState<RestaurantType>(null);

// // //   useEffect(() => {
// // //     const token = sessionStorage.getItem('my-token');
// // //     const userData = sessionStorage.getItem('user-data');

// // //     if (!token || !userData) {
// // //       navigate('/Login');
// // //     } else {
// // //       dispatch(setUser(JSON.parse(userData)));
// // //     }
// // //   }, [dispatch, navigate]);

// // //   const handleFilter = (type: RestaurantType) => {
// // //     setSelectedType(type);
// // //   };

// // //   return (
// // //     <div className="visitor-center">
// // //       <div className="Home">
// // //         <nav className="navbar navbar-expand-lg navbar-light bg-light">
// // //           <div className="collapse navbar-collapse">
// // //             <ul className="navbar-nav">

// // //               <li className="nav-item">
// // //                 <button
// // //                   className={`nav-link btn btn-link ${selectedType === 'meat' ? 'active' : ''}`}
// // //                   onClick={() => handleFilter('meat')}
// // //                 >
// // //                   מסעדות בשריות
// // //                 </button>
// // //               </li>

// // //               <li className="nav-item">
// // //                 <button
// // //                   className={`nav-link btn btn-link ${selectedType === 'dairy' ? 'active' : ''}`}
// // //                   onClick={() => handleFilter('dairy')}
// // //                 >
// // //                   מסעדות חלביות
// // //                 </button>
// // //               </li>

// // //               <li className="nav-item">
// // //                 <button
// // //                   className={`nav-link btn btn-link ${selectedType === 'cafe' ? 'active' : ''}`}
// // //                   onClick={() => handleFilter('cafe')}
// // //                 >
// // //                   בתי קפה
// // //                 </button>
// // //               </li>

// // //             </ul>
// // //           </div>
// // //         </nav>

// // //         {/* <Products type={selectedType} /> */}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // export default Restaurants;


// import './Restaurants.scss';

// import React, {
//   FC,
//   useEffect,
//   useState,
//   useMemo
// } from 'react';

// import { useNavigate } from 'react-router-dom';

// import { RestaurantModel } from '../../models/restaurant';

// import {
//   GetAllRestaurants,
//   DeleteRestaurant
// } from '../../service/wines';

// import AddWineForm from '../AddWineForm/AddWineForm';

// import { useDispatch } from 'react-redux';

// import { showMessage } from '../../redux/messageSlice';

// interface RestaurantsProps {}

// type RestaurantType =
//   | 'בשרי'
//   | 'חלבי'
//   | 'בית קפה'
//   | '';

// const Restaurants: FC<RestaurantsProps> = () => {

//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const [restaurants, setRestaurants] = useState<RestaurantModel[]>([]);

//   const [displayedCount, setDisplayedCount] =
//     useState(20);

//   const [showAddForm, setShowAddForm] =
//     useState(false);

//   const [selectedType, setSelectedType] =
//     useState<RestaurantType>('');

//   const [searchCity, setSearchCity] =
//     useState('');

//   const currentUser = JSON.parse(
//     sessionStorage.getItem('user-data') || '{}'
//   );

//   const isAdmin =
//     currentUser?.isAdmin === true;

//   useEffect(() => {

//     GetAllRestaurants()

//       .then((response: any) => {

//         const data = Array.isArray(response.data)
//           ? response.data
//           : response.data?.restaurants || [];

//         setRestaurants(data);

//         setDisplayedCount(20);
//       })

//       .catch((err) => {

//         console.error(err);

//         dispatch(
//           showMessage({
//             title: 'שגיאה',
//             body: 'אירעה שגיאה בעת טעינת המסעדות',
//             delay: 4000
//           })
//         );
//       });

//   }, [dispatch]);

//   const filteredRestaurants = useMemo(() => {

//     return restaurants.filter(
//       (r: RestaurantModel) => {

//         const matchesType =
//           !selectedType ||
//           r.type === selectedType;

//         const matchesCity =
//           !searchCity ||
//           r.city
//             ?.toLowerCase()
//             .includes(
//               searchCity.toLowerCase()
//             );

//         return (
//           matchesType &&
//           matchesCity
//         );
//       }
//     );

//   }, [
//     restaurants,
//     selectedType,
//     searchCity
//   ]);

//   const visibleRestaurants = useMemo(() => {

//     return filteredRestaurants.slice(
//       0,
//       displayedCount
//     );

//   }, [
//     filteredRestaurants,
//     displayedCount
//   ]);

//   const handleLoadMore = () => {

//     setDisplayedCount((prev) =>
//       Math.min(
//         prev + 10,
//         filteredRestaurants.length
//       )
//     );
//   };

//   const handleDelete = async (
//     id: string | number
//   ) => {

//     try {

//       const stringId = id.toString();

//       await DeleteRestaurant(stringId);

//       setRestaurants((prev) =>
//         prev.filter(
//           (r) =>
//             r.id.toString() !== stringId
//         )
//       );

//       dispatch(
//         showMessage({
//           title: 'הצלחה',
//           body: 'המסעדה נמחקה בהצלחה',
//           delay: 3000
//         })
//       );

//     } catch (error) {

//       console.error(error);

//       dispatch(
//         showMessage({
//           title: 'שגיאה',
//           body: 'אירעה שגיאה במחיקת המסעדה',
//           delay: 4000
//         })
//       );
//     }
//   };

//   return (

//     <div className="Restaurants">
// {/* 
//       <h2 style={{ textAlign: 'center' }}>
//         כל המסעדות
//       </h2> */}

//       {/* סינונים */}

//       <div className="filters-container">

//         <button
//           className={
//             selectedType === ''
//               ? 'active-filter'
//               : ''
//           }
//           onClick={() =>
//             setSelectedType('')
//           }
//         >
//           הכל
//         </button>

//         <button
//           className={
//             selectedType === 'בשרי'
//               ? 'active-filter'
//               : ''
//           }
//           onClick={() =>
//             setSelectedType('בשרי')
//           }
//         >
//           מסעדות בשריות
//         </button>

//         <button
//           className={
//             selectedType === 'חלבי'
//               ? 'active-filter'
//               : ''
//           }
//           onClick={() =>
//             setSelectedType('חלבי')
//           }
//         >
//           מסעדות חלביות
//         </button>

//         <button
//           className={
//             selectedType === 'בית קפה'
//               ? 'active-filter'
//               : ''
//           }
//           onClick={() =>
//             setSelectedType('בית קפה')
//           }
//         >
//           בתי קפה
//         </button>

//         <input
//           type="text"
//           placeholder="חיפוש לפי עיר..."
//           value={searchCity}
//           onChange={(e) =>
//             setSearchCity(
//               e.target.value
//             )
//           }
//         />

//       </div>

//       {isAdmin && (

//         <button
//           className="add-restaurant-btn"
//           onClick={() =>
//             navigate('/add-restaurant')
//           }
//           style={{
//             marginBottom: '1rem'
//           }}
//         >
//           הוסף מסעדה חדשה
//         </button>

//       )}

//       {showAddForm && (

//         <AddWineForm
//           onClose={() =>
//             setShowAddForm(false)
//           }
//           onWineAdded={(
//             newRestaurant
//           ) => {

//             setRestaurants((prev) => [
//               newRestaurant,
//               ...prev
//             ]);

//             setShowAddForm(false);
//           }}
//         />

//       )}

//       <div className="restaurants-grid">

//         {visibleRestaurants.map(
//           (
//             r: RestaurantModel
//           ) => (

//             <div
//               key={r.id}
//               className="restaurant-card"
//               onClick={() =>
//                 navigate(
//                   '/RestaurantDetails',
//                   {
//                     state: {
//                       id: r.id
//                     }
//                   }
//                 )
//               }
//             >

//               <h3>{r.name}</h3>

//               {/* { && (

//                 <img
//                   className="product-image"
//                   src={`http://localhost:2000/image/${r.image}`}
//                   alt={r.name}
//                 />

//               )} */}

//               <p>
//                 עיר: {r.city}
//               </p>

//               <p>
//                 כתובת: {r.address}
//               </p>

//               <p>
//                 סוג: {r.type}
//               </p>

//               {isAdmin && (

//                 <button
//                   className="delete-btn"
//                   onClick={(e) => {

//                     e.stopPropagation();

//                     handleDelete(r.id);
//                   }}
//                   title="מחק מסעדה"
//                   type="button"
//                 >
//                   🗑️
//                 </button>

//               )}

//             </div>
//           )
//         )}

//       </div>

//       {displayedCount <
//         filteredRestaurants.length && (

//         <div
//           style={{
//             textAlign: 'center',
//             marginTop: '1rem'
//           }}
//         >

//           <button
//             className="load-more-btn"
//             onClick={handleLoadMore}
//           >
//             טען עוד
//           </button>

//         </div>
//       )}

//     </div>
//   );
// };

// export default Restaurants;



import './Restaurants.scss';

import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import FavoriteButton from '../FavoriteButton/FavoriteButton';

import { AllergenBadges, AllergenFilter, useAllergenFilter } from '../Allergens/Allergens';

import { RestaurantModel } from '../../models/restaurant';

import {
  GetAllRestaurants,
  DeleteRestaurant,
  AddRestaurantReview,
  deleteRestaurantReview
} from '../../service/wines';

import AddWineForm from '../AddWineForm/AddWineForm';

import ItemDetailsModal from '../ItemDetailsModal/ItemDetailsModal';

import { useDispatch } from 'react-redux';

import { LuBadgeCheck, LuClock, LuMapPin, LuPhone, LuPlus, LuSearch, LuStar, LuTrash2, LuUtensils } from 'react-icons/lu';

import { showMessage } from '../../redux/messageSlice';

interface RestaurantsProps {}

// בנתונים השעות שמורות כאובייקט אחד, אבל תומכים גם ברשימה
const formatOpeningHours = (openingHours: unknown) => {
  const list = Array.isArray(openingHours)
    ? openingHours
    : openingHours
      ? [openingHours]
      : [];
  return list
    .map((item: any) => [item?.days, item?.hours].filter(Boolean).join(' '))
    .filter(Boolean)
    .join(' | ') || undefined;
};

type RestaurantType =
  | 'בשרי'
  | 'חלבי'
  | 'בית קפה'
  | '';

const Restaurants: FC<RestaurantsProps> = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [restaurants, setRestaurants] =
    useState<RestaurantModel[]>([]);

  const [displayedCount, setDisplayedCount] =
    useState(20);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [selectedType, setSelectedType] =
    useState<RestaurantType>('');

  const [searchCity, setSearchCity] =
    useState('');

  // המסעדה שהפרטים שלה פתוחים כרגע
  // אפשר לפתוח מסעדה ישירות מ"הרשימה שלי"
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState<string | null>(
      location.state?.openId !== undefined
        ? String(location.state.openId)
        : null
    );

  // חוות דעת חדשה
  

  const currentUser =
    JSON.parse(
      sessionStorage.getItem('user-data') || '{}'
    );

  const currentCustomerId =
    currentUser?.id;

  const currentCustomerName =
    currentUser?.name;

  const isAdmin =
    currentUser?.isAdmin === true;


  // =========================
  // טעינת המסעדות
  // =========================

  useEffect(() => {

    GetAllRestaurants()

      .then((response: any) => {

        const data =
          Array.isArray(response.data)
            ? response.data
            : response.data?.restaurants || [];

        setRestaurants(data);
        setDisplayedCount(20);

      })

      .catch((err) => {

        console.error(err);

        dispatch(
          showMessage({
            title: 'שגיאה',
            body: 'אירעה שגיאה בעת טעינת המסעדות',
            delay: 4000
          })
        );

      });

  }, [dispatch]);


  // =========================
  // סינון
  // =========================

  const selectedRestaurant = useMemo(
    () =>
      restaurants.find(
        (r) => String(r.id) === selectedRestaurantId
      ) || null,
    [restaurants, selectedRestaurantId]
  );



  const filteredRestaurants = useMemo(() => {

    return restaurants.filter(
      (r: RestaurantModel) => {

        const matchesType =
          !selectedType ||
          r.type === selectedType;

        const matchesCity =
          !searchCity ||
          r.city
            ?.toLowerCase()
            .includes(
              searchCity.toLowerCase()
            );

        return (
          matchesType &&
          matchesCity
        );
      }
    );

  }, [
    restaurants,
    selectedType,
    searchCity
  ]);


  // =========================
  // מסעדות להצגה
  // =========================

  const { filtered: safeRestaurants, filterProps } =
    useAllergenFilter(
      filteredRestaurants,
      (r: RestaurantModel) => r.freeFrom
    );



  const visibleRestaurants = useMemo(() => {

    return safeRestaurants.slice(
      0,
      displayedCount
    );

  }, [
    safeRestaurants,
    displayedCount
  ]);


  // =========================
  // טען עוד
  // =========================

  const handleLoadMore = () => {

    setDisplayedCount((prev) =>
      Math.min(
        prev + 10,
        safeRestaurants.length
      )
    );

  };


  // =========================
  // פתיחת פרטי מסעדה
  // =========================

  const handleRestaurantClick = (
    restaurant: RestaurantModel
  ) => {

    setSelectedRestaurantId(String(restaurant.id));

  };


  // =========================
  // סגירת פרטי מסעדה
  // =========================

  const closeRestaurantDetails = useCallback(
    () => setSelectedRestaurantId(null),
    []
  );


  // =========================
  // מחיקת מסעדה
  // =========================

  const handleDelete = async (
    id: string | number
  ) => {

    if (!window.confirm('למחוק את המסעדה מהאתר?'))
      return;

    try {

      const stringId =
        id.toString();

      await DeleteRestaurant(stringId, currentCustomerId);

      setRestaurants((prev) =>
        prev.filter(
          (r) =>
            r.id.toString() !== stringId
        )
      );

      // אם המסעדה שנמחקה פתוחה
      if (selectedRestaurantId === stringId) {
        setSelectedRestaurantId(null);
      }

      dispatch(
        showMessage({
          title: 'הצלחה',
          body: 'המסעדה נמחקה בהצלחה',
          delay: 3000
        })
      );

    } catch (error) {

      console.error(error);

      dispatch(
        showMessage({
          title: 'שגיאה',
          body: 'אירעה שגיאה במחיקת המסעדה',
          delay: 4000
        })
      );

    }
  };


  // =========================
  // הוספת חוות דעת
  // =========================

  const replaceRestaurant = (updated: RestaurantModel) =>
    setRestaurants((prev) =>
      prev.map((r) => (String(r.id) === String(updated.id) ? updated : r))
    );

  const handleAddReview = async (comment: string, stars: number) => {

    if (!selectedRestaurant)
      return;

    try {

      const res =
        await AddRestaurantReview(
          selectedRestaurant.id.toString(),
          {
            clientId: currentCustomerId,
            clientName: currentCustomerName,
            comment,
            stars
          }
        );

      replaceRestaurant(res.data);

      dispatch(
        showMessage({
          title: 'הצלחה',
          body: 'חוות הדעת נשלחה בהצלחה!',
          delay: 3000
        })
      );

    } catch (err) {

      console.error(err);

      dispatch(
        showMessage({
          title: 'שגיאה',
          body: 'הייתה שגיאה בשליחת חוות הדעת',
          delay: 4000
        })
      );

      throw err;
    }

  };



  const handleDeleteReview = async (
    index: number
  ) => {

    if (!selectedRestaurant)
      return;

    try {

      const res =
        await deleteRestaurantReview(
          selectedRestaurant.id.toString(),
          index,
          currentCustomerId
        );

      replaceRestaurant(res.data);

    } catch (err) {

      console.error(err);

      dispatch(
        showMessage({
          title: 'שגיאה',
          body: 'שגיאה במחיקת חוות הדעת',
          delay: 4000
        })
      );

    }

  };


  return (

    <div className="Restaurants">

      <div className="Restaurants-shell">

        <header className="page-header">
          <h1>מסעדות</h1>
          <p>מקומות שיודעים להכין מנות שמתאימות לרגישויות שלכם.</p>
        </header>

        {/* =========================
            סינונים
        ========================= */}

        <nav className="navbar">

          <ul className="navbar-nav">

            <li className="nav-item">

              <button
                className={
                  `nav-link ${
                    selectedType === ''
                      ? 'active'
                      : ''
                  }`
                }
                onClick={() =>
                  setSelectedType('')
                }
              >
                הכל
              </button>

            </li>


            <li className="nav-item">

              <button
                className={
                  `nav-link ${
                    selectedType === 'בשרי'
                      ? 'active'
                      : ''
                  }`
                }
                onClick={() =>
                  setSelectedType('בשרי')
                }
              >
                מסעדות בשריות
              </button>

            </li>


            <li className="nav-item">

              <button
                className={
                  `nav-link ${
                    selectedType === 'חלבי'
                      ? 'active'
                      : ''
                  }`
                }
                onClick={() =>
                  setSelectedType('חלבי')
                }
              >
                מסעדות חלביות
              </button>

            </li>


            <li className="nav-item">

              <button
                className={
                  `nav-link ${
                    selectedType === 'בית קפה'
                      ? 'active'
                      : ''
                  }`
                }
                onClick={() =>
                  setSelectedType('בית קפה')
                }
              >
                בתי קפה
              </button>

            </li>

          </ul>


          <label className="city-search">
            <LuSearch size={17} aria-hidden="true" />
            <input
              type="text"
              placeholder="חיפוש לפי עיר"
              aria-label="חיפוש לפי עיר"
              value={searchCity}
              onChange={(e) =>
                setSearchCity(e.target.value)
              }
            />
          </label>

        </nav>


        {/* =========================
            הוספת מסעדה
        ========================= */}

        {isAdmin && (

          <button
            className="add-restaurant-btn"
            onClick={() =>
              navigate('/add-restaurant')
            }
          >
            <LuPlus size={17} aria-hidden="true" />
            הוסף מסעדה חדשה
          </button>

        )}


        {showAddForm && (

          <AddWineForm
            onClose={() =>
              setShowAddForm(false)
            }

            onWineAdded={(newRestaurant) => {

              setRestaurants((prev) => [
                newRestaurant,
                ...prev
              ]);

              setShowAddForm(false);

            }}
          />

        )}


        {/* =========================
            חלון פרטי מסעדה
        ========================= */}

        <AllergenFilter {...filterProps} />

        {visibleRestaurants.length === 0 && (
          <p className="no-results">
            לא נמצאו מסעדות שמתאימות לסינון.
          </p>
        )}


        {selectedRestaurant && (
          <ItemDetailsModal
            title={selectedRestaurant.name}
            subtitle={[selectedRestaurant.address, selectedRestaurant.city].filter(Boolean).join(', ')}
            fallbackIcon={<LuUtensils />}
            badges={[selectedRestaurant.type, selectedRestaurant.city]}
            rating={selectedRestaurant.rating || 0}
            favorite={{ itemId: Number(selectedRestaurant.id), type: 'restaurant' }}
                        allergens={{ freeFrom: selectedRestaurant.freeFrom, isRestaurant: true }}
            facts={[
              { icon: <LuMapPin />, label: 'כתובת', value: [selectedRestaurant.address, selectedRestaurant.city].filter(Boolean).join(', ') },
              {
                icon: <LuPhone />,
                label: 'טלפון',
                value: selectedRestaurant.phone
                  ? <a href={`tel:${selectedRestaurant.phone}`}>{selectedRestaurant.phone}</a>
                  : undefined
              },
              { icon: <LuBadgeCheck />, label: 'כשרות', value: selectedRestaurant.kosher },
              { icon: <LuUtensils />, label: 'סוג', value: selectedRestaurant.type },
              { icon: <LuClock />, label: 'שעות פעילות', value: formatOpeningHours(selectedRestaurant.openingHours) }
            ]}
            sections={[
              {
                title: 'ניווט',
                text: (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedRestaurant.name} ${selectedRestaurant.address} ${selectedRestaurant.city}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    פתח במפות גוגל ↗
                  </a>
                )
              }
            ]}
            reviews={selectedRestaurant.reviews}
            currentUserId={currentCustomerId}
            onAddReview={handleAddReview}
            onDeleteReview={handleDeleteReview}
            onClose={closeRestaurantDetails}
          />
        )}


        {/* =========================
            כרטיסי מסעדות
        ========================= */}

        <div className="restaurants-grid">

          {visibleRestaurants.map(
            (restaurant: RestaurantModel) => (

              <div
                key={restaurant.id}
                className="restaurant-card"
                onClick={() =>
                  handleRestaurantClick(
                    restaurant
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {

                  if (
                    e.key === 'Enter' ||
                    e.key === ' '
                  ) {

                    handleRestaurantClick(
                      restaurant
                    );

                  }

                }}
              >

                <div className="card-favorite">
                  <FavoriteButton
                    itemId={Number(restaurant.id)}
                    type="restaurant"
                  />
                </div>

                <span className="card-category">
                  {restaurant.type}
                </span>

                <h3>
                  {restaurant.name}
                </h3>

                <p className="meta-text restaurant-address">
                  <LuMapPin size={15} aria-hidden="true" />
                  {[restaurant.address, restaurant.city].filter(Boolean).join(', ')}
                </p>

                <AllergenBadges
                  freeFrom={restaurant.freeFrom}
                  isRestaurant
                />

                <div className="card-footer">
                  <span className="restaurant-rating">
                    <LuStar size={15} fill="currentColor" aria-hidden="true" />
                    {restaurant.rating || 0}
                  </span>
                  {restaurant.kosher && (
                    <span className="muted">{restaurant.kosher}</span>
                  )}
                </div>


                {isAdmin && (

                  <button
                    className="delete-btn"
                    onClick={(e) => {

                      e.stopPropagation();

                      handleDelete(
                        restaurant.id
                      );

                    }}
                    title="מחק מסעדה"
                    type="button"
                  >
                    <LuTrash2 size={15} aria-hidden="true" />
                    מחק
                  </button>

                )}

              </div>

            )
          )}

        </div>


        {/* =========================
            טען עוד
        ========================= */}

        {displayedCount <
          safeRestaurants.length && (

          <div className="load-more-wrap">

            <button
              className="load-more-btn"
              onClick={handleLoadMore}
            >
              טען עוד
            </button>

          </div>

        )}

      </div>

    </div>

  );
};

export default Restaurants;