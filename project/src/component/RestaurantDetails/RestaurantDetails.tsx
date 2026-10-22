// import React, { FC, useEffect, useState } from 'react';
// import './RestaurantDetails.scss';
// import { useLocation, useNavigate } from 'react-router';
// // import { GetWinesById, AddWineReview, deleteWineReview } from '../../service/wines';
// import {GetRestaurantById, AddRestaurantReview, deleteRestaurantReview} from '../../service/wines';
// import { RestaurantModel } from '../../models/restaurant';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../redux/shoppingSlice';
// import { showMessage } from '../../redux/messageSlice';

// const RestaurantDetails: FC = () => {
//   const [restaurantDetail, setRestaurantDetail] = useState<RestaurantModel | null>(null);
//   const [newReview, setNewReview] = useState('');
//   const [addedToCart, setAddedToCart] = useState(false);

//   const location = useLocation();
//   const myNavigate = useNavigate();
//   const dispatch = useDispatch();

//   const currentCustomerId = JSON.parse(sessionStorage.getItem('user-data') || '{}').id;
//   const currentCustomerName = JSON.parse(sessionStorage.getItem('user-data') || '{}').name;

//   const handleAddToCart = () => {
//     if (WineDetail) {
//     //   dispatch(addToCart(WineDetail));
//       setAddedToCart(true);
//       setTimeout(() => setAddedToCart(false), 3000);
//     }
//   };

//   // useEffect(() => {
//   //   const myId = location.state?.id;
//   //   if (!myId) return;

//   //   GetRestaurantById(myId)
//   //     .then((res: any) => setWineDetail(res.data))
//   //     .catch(err => {
//   //       console.error(err);
//   //       dispatch(showMessage({
//   //         title: 'שגיאה',
//   //         body: 'אירעה שגיאה בטעינת פרטי היין',
//   //         delay: 4000
//   //       }));
//   //     });
//   // }, [location.state]);
// useEffect(() => {
//     const myId = location.state?.id;

//     if (!myId) return;

//     GetRestaurantById(myId)
//         .then((res: any) => {
//             setRestaurantDetail(res.data);
//         })
//         .catch(err => {
//             console.error(err);

//             dispatch(showMessage({
//                 title: 'שגיאה',
//                 body: 'אירעה שגיאה בטעינת פרטי המסעדה',
//                 delay: 4000
//             }));
//         });

// }, [location.state, dispatch]);
//   const handleAddReview = async () => {
//     if (!newReview.trim()) {
//       dispatch(showMessage({
//         title: 'שגיאה',
//         body: 'אנא כתוב חוות דעת לפני השליחה',
//         delay: 4000
//       }));
//       return;
//     }
//     if (!WineDetail) return;

//     try {
//       const reviewObj = {
//         clientId: currentCustomerId,
//         clientName: currentCustomerName,
//         comment: newReview.trim(),
//       };
//       const res = await AddWineReview(WineDetail.id.toString(), reviewObj);
//       setWineDetail(res.data);
//       setNewReview('');
//       dispatch(showMessage({
//         title: 'הצלחה',
//         body: 'חוות הדעת נשלחה בהצלחה!',
//         delay: 3000
//       }));
//     } catch (err) {
//       console.error(err);
//       dispatch(showMessage({
//         title: 'שגיאה',
//         body: 'הייתה שגיאה בשליחת חוות הדעת',
//         delay: 4000
//       }));
//     }
//   };

//   const handleDeleteReview = async (index: number) => {
//     if (!WineDetail) return;

//     try {
//       const res = await deleteWineReview(WineDetail.id.toString(), index);
//       setWineDetail(res.data);
//       dispatch(showMessage({
//         title: 'הצלחה',
//         body: 'חוות הדעת נמחקה בהצלחה',
//         delay: 3000
//       }));
//     } catch (err) {
//       console.error(err);
//       dispatch(showMessage({
//         title: 'שגיאה',
//         body: 'שגיאה במחיקת חוות הדעת',
//         delay: 4000
//       }));
//     }
//   };

//   return (
//     <div className="RestaurantDetails">
//       {WineDetail ? (
//         <div className="wine-container">
//           <div className="wine-image-side">
//             <img
//               className="wine-image"
//             //   src={`http://localhost:2000/image/${WineDetail.image}`}
//               alt={WineDetail.name}
//             />
//             {addedToCart && <p className="cart-message">נוסף לסל!</p>}
//           </div> 

//             <div className="details">
//             <h1>{WineDetail.name}</h1>
//             <h3>{WineDetail.city}</h3>
//             <p>{WineDetail.type}</p>
//             <p>זמני פעילות: {WineDetail.openingHours} </p>
//             <p>נקודות:{WineDetail.rating}</p>

//             <h3>חוות דעת:</h3>
//             <ul className="reviews-list">
//               {(WineDetail.reviews ?? []).map((r, i) => (
//                 <li key={i}>
//                   {r.comment}
//                   {String(r.clientId) === currentCustomerId && (
//                     <button
//                       className="delete-review-btn"
//                       onClick={() => handleDeleteReview(i)}
//                     >
//                       למחיקה
//                     </button>
//                   )}
//                 </li>
//               ))}
//             </ul>

//             <div className="add-review">
//               <textarea
//                 placeholder="כתוב חוות דעת חדשה..."
//                 value={newReview}
//                 onChange={e => setNewReview(e.target.value)}
//                 rows={4}
//               />
//               <button onClick={handleAddReview}>שלח חוות דעת</button>
//             </div>
//             <br />
//             <button className="add-to-cart" onClick={handleAddToCart}>הוסף לסל </button>
//             <br />
//             <button className="go-cart-btn" onClick={() => myNavigate('/Home/ShoppingCart')}>
//               לסל קניות
//             </button>
//           </div> 
//          </div>
//       ) : (
//         <p>טוען פרטי יין...</p>
//       )}
//     </div>
//  );
// };

// export default RestaurantDetails;

import React, { FC, useEffect, useState } from 'react';
import './RestaurantDetails.scss';
import { useLocation, useNavigate } from 'react-router';
import {
  GetRestaurantsById,
  AddRestaurantReview,
  deleteRestaurantReview
} from '../../service/wines';
import { RestaurantModel } from '../../models/restaurant';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../redux/messageSlice';
import { API_URL } from '../../config/api';

const RestaurantDetails: FC = () => {

  const [restaurantDetail, setRestaurantDetail] =
    useState<RestaurantModel | null>(null);

  const [newReview, setNewReview] =
    useState('');

  const location = useLocation();
  const myNavigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser =
    JSON.parse(
      sessionStorage.getItem('user-data') || '{}'
    );

  const currentCustomerId =
    currentUser?.id;

  const currentCustomerName =
    currentUser?.name;


  // טעינת פרטי המסעדה
  useEffect(() => {

    const myId = location.state?.id;

    if (!myId)
      return;

    GetRestaurantsById(myId)

      .then((res: any) => {

        setRestaurantDetail(res.data);

      })

      .catch((err) => {

        console.error(err);

        dispatch(
          showMessage({
            title: 'שגיאה',
            body: 'אירעה שגיאה בטעינת פרטי המסעדה',
            delay: 4000
          })
        );

      });

  }, [location.state, dispatch]);


  // הוספת חוות דעת
  const handleAddReview = async () => {

    if (!newReview.trim()) {

      dispatch(
        showMessage({
          title: 'שגיאה',
          body: 'אנא כתוב חוות דעת לפני השליחה',
          delay: 4000
        })
      );

      return;
    }

    if (!restaurantDetail)
      return;

    try {

      const reviewObj = {
        clientId: currentCustomerId,
        clientName: currentCustomerName,
        comment: newReview.trim()
      };

      const res =
        await AddRestaurantReview(
          restaurantDetail.id.toString(),
          reviewObj
        );

      setRestaurantDetail(res.data);

      setNewReview('');

      dispatch(
        showMessage({
          title: 'הצלחה',
          body: 'חוות הדעת נשלחה בהצלחה!',
          delay: 3000
        })
      );

    }
    catch (err) {

      console.error(err);

      dispatch(
        showMessage({
          title: 'שגיאה',
          body: 'הייתה שגיאה בשליחת חוות הדעת',
          delay: 4000
        })
      );

    }
  };


  // מחיקת חוות דעת
  const handleDeleteReview = async (
    index: number
  ) => {

    if (!restaurantDetail)
      return;

    try {

      const res =
        await deleteRestaurantReview(
          restaurantDetail.id.toString(),
          index
        );

      setRestaurantDetail(res.data);

      dispatch(
        showMessage({
          title: 'הצלחה',
          body: 'חוות הדעת נמחקה בהצלחה',
          delay: 3000
        })
      );

    }
    catch (err) {

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

    <div className="RestaurantDetails">

      {restaurantDetail ? (

        <div className="restaurant-container">

          {/* פרטי המסעדה */}

          <div className="restaurant-image-side">

            {/* {restaurantDetail.image && (

              <img
                className="restaurant-image"
                src={
                  `${API_URL}/image/${restaurantDetail.image}`
                }
                alt={restaurantDetail.name}
              />

            )} */}

          </div>


          <div className="details">

            <h1>
              {restaurantDetail.name}
            </h1>

            <h3>
              {restaurantDetail.city}
            </h3>

            <p>
              סוג: {restaurantDetail.type}
            </p>

            <p>
              כתובת: {restaurantDetail.address}
            </p>

            <p>
              ימים: {restaurantDetail.openingHours?.days}
            </p>

            <p>
              שעות פעילות: {restaurantDetail.openingHours?.hours}
            </p>

            <p>
              דירוג: {restaurantDetail.rating}
            </p>


            {/* חוות דעת */}

            <h3>
              חוות דעת:
            </h3>

            <ul className="reviews-list">

              {(restaurantDetail.reviews ?? []).map(
                (r, i) => (

                  <li key={i}>

                    <span>
                      {r.comment}
                    </span>

                    {String(r.clientId) ===
                      String(currentCustomerId) && (

                        <button
                          className="delete-review-btn"
                          onClick={() =>
                            handleDeleteReview(i)
                          }
                        >
                          למחיקה 
                        </button>

                      )}

                  </li>

                )
              )}

            </ul>


            {/* הוספת חוות דעת */}

            <div className="add-review">

              <textarea
                placeholder="כתוב חוות דעת חדשה..."
                value={newReview}
                onChange={(e) =>
                  setNewReview(e.target.value)
                }
                rows={4}
              />

              <button
                onClick={handleAddReview}
              >
                שלח חוות דעת
              </button>

            </div>


            <br />

            <button
              className="go-back-btn"
              onClick={() =>
                myNavigate('/Home/Restaurants')
              }
            >
              חזרה למסעדות
            </button>

          </div>

        </div>

      ) : (

        <p>
          טוען פרטי מסעדה...
        </p>

      )}

    </div>
  );
};

export default RestaurantDetails;