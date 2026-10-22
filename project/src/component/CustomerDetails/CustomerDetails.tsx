// // import React, { FC, useState } from 'react';
// // import './CustomerDetails.scss';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { setUser } from '../../redux/userSlice';
// // import { updateCustomer } from '../../service/wines';
// // import { showMessage } from '../../redux/messageSlice';

// // interface CustomerDetailsProps { }

// // const CustomerDetails: FC<CustomerDetailsProps> = () => {
// //   const currentUser = useSelector((store: any) => store.userSlice.currentUser);
// //   const dispatch = useDispatch();

// //   const [isEditing, setIsEditing] = useState(false);
// //   const [name, setName] = useState(currentUser?.name || '');
// //   const [email, setEmail] = useState(currentUser?.email || '');
// //   const [password, setPassword] = useState(currentUser?.password || '');

// //   if (!currentUser) return <p>לא מחובר</p>;

// //   const handleSave = async () => {
// //     try {
// //       const response = await updateCustomer(currentUser.id, name, email, password, currentUser.isAdmin);

// //       if (response.data.success) {
// //         // dispatch(setUser({
// //         //   id: currentUser.id,
// //         //   isAdmin: currentUser.isAdmin,
// //         //   name,
// //         //   email,
// //         //   password
// //         // }));
// //         dispatch(setUser({
// //           id: currentUser.id,
// //           isAdmin: currentUser.isAdmin,
// //           name,
// //           email,
// //           password,

// //           favoriteRecipes: currentUser.favoriteRecipes || [],
// //           favoriteProducts: currentUser.favoriteProducts || [],
// //           favoriteRestaurants: currentUser.favoriteRestaurants || [],
// //           followedForums: currentUser.followedForums || []
// //         }));

// //         dispatch(showMessage({
// //           title: 'הצלחה',
// //           body: 'הפרטים עודכנו בהצלחה!',
// //           delay: 3000
// //         }));
// //       } else {
// //         dispatch(showMessage({
// //           title: 'שגיאה',
// //           body: 'אירעה שגיאה בשמירה בשרת.',
// //           delay: 4000
// //         }));
// //       }

// //       setIsEditing(false);
// //     } catch (error) {
// //       console.error("שגיאה בעדכון:", error);
// //       dispatch(showMessage({
// //         title: 'שגיאה',
// //         body: 'אירעה שגיאה בעדכון הנתונים.',
// //         delay: 4000
// //       }));
// //     }
// //   };

// //   return (
// //     <div className="CustomerDetails">
// //       <h2>שלום, {currentUser.name}!</h2>

// //       <div>
// //         <h3>פרטים אישיים:</h3>

// //         {isEditing ? (
// //           <>
// //             <p>שם: <input value={name} onChange={e => setName(e.target.value)} /></p>
// //             <p>אימייל: <input value={email} onChange={e => setEmail(e.target.value)} /></p>
// //             <p>סיסמה: <input value={password} onChange={e => setPassword(e.target.value)} type="password" /></p>
// //             <button onClick={handleSave}>שמור</button>
// //           </>
// //         ) : (
// //           <>
// //             <p>שם: {currentUser.name}</p>
// //             <p>אימייל: {currentUser.email}</p>
// //             <p>סיסמה: {currentUser.password}</p>
// //             <button onClick={() => setIsEditing(true)}>לעדכון הפרטים</button>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default CustomerDetails;

// import React, { FC, useEffect, useState } from 'react';
// import './CustomerDetails.scss';

// import { useSelector, useDispatch } from 'react-redux';
// import { setUser } from '../../redux/userSlice';

// import {
//   updateCustomer,
//   GetAllWines,
//   GetAllProducts,
//   GetAllRestaurants,
//   // בהמשך נחבר גם את הפונקציה של הפורום
// } from '../../service/wines';

// import { showMessage } from '../../redux/messageSlice';
// import { RecipeModel } from '../../models/wine';
// import { ProductModel } from '../../models/product';
// import { RestaurantModel } from '../../models/restaurant';

// interface CustomerDetailsProps {}

// const CustomerDetails: FC<CustomerDetailsProps> = () => {

//   const currentUser = useSelector(
//     (store: any) => store.userSlice.currentUser
//   );

//   const dispatch = useDispatch();

//   // -----------------------------------------
//   // מצבי הקומפוננטה
//   // -----------------------------------------

//   const [isEditing, setIsEditing] = useState(false);

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // איזה אזור מוצג
//   const [activeSection, setActiveSection] = useState<
//     'details' | 'recipes' | 'products' | 'restaurants' | 'forums'
//   >('details');

//   // הנתונים של המועדפים
//   const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeModel[]>([]);
//   const [favoriteProducts, setFavoriteProducts] = useState<ProductModel[]>([]);
//   const [favoriteRestaurants, setFavoriteRestaurants] = useState<RestaurantModel[]>([]);

//   // מצב טעינה
//   const [loadingFavorites, setLoadingFavorites] = useState(false);


//   // -----------------------------------------
//   // הכנסת פרטי המשתמש לשדות
//   // -----------------------------------------

//   useEffect(() => {

//     if (!currentUser) {
//       return;
//     }

//     setName(currentUser.name || '');
//     setEmail(currentUser.email || '');
//     setPassword(currentUser.password || '');

//   }, [currentUser]);


//   // -----------------------------------------
//   // שליפת המועדפים
//   // -----------------------------------------

//   useEffect(() => {

//     if (!currentUser) {
//       return;
//     }

//     const loadFavorites = async () => {

//       try {

//         setLoadingFavorites(true);

//         // -----------------------------------
//         // מתכונים
//         // -----------------------------------

//         if (
//           currentUser.favoriteRecipes &&
//           currentUser.favoriteRecipes.length > 0
//         ) {

//           const recipesResponse = await GetAllWines();

//           const recipesData = Array.isArray(recipesResponse.data)
//             ? recipesResponse.data
//             : recipesResponse.data?.recipes || [];

//           const recipes = recipesData.filter(
//             (recipe: RecipeModel) =>
//               currentUser.favoriteRecipes.includes(
//                 Number(recipe.id)
//               )
//           );

//           setFavoriteRecipes(recipes);

//         } else {

//           setFavoriteRecipes([]);

//         }


//         // -----------------------------------
//         // מוצרים
//         // -----------------------------------

//         if (
//           currentUser.favoriteProducts &&
//           currentUser.favoriteProducts.length > 0
//         ) {

//           const productsResponse = await GetAllProducts();

//           const productsData = Array.isArray(productsResponse.data)
//             ? productsResponse.data
//             : productsResponse.data?.glutenFreeProducts || [];

//           const products = productsData.filter(
//             (product: ProductModel) =>
//               currentUser.favoriteProducts.includes(
//                 Number(product.id)
//               )
//           );

//           setFavoriteProducts(products);

//         } else {

//           setFavoriteProducts([]);

//         }


//         // -----------------------------------
//         // מסעדות
//         // -----------------------------------

//         if (
//           currentUser.favoriteRestaurants &&
//           currentUser.favoriteRestaurants.length > 0
//         ) {

//           const restaurantsResponse = await GetAllRestaurants();

//           const restaurantsData = Array.isArray(restaurantsResponse.data)
//             ? restaurantsResponse.data
//             : restaurantsResponse.data?.restaurants || [];

//           const restaurants = restaurantsData.filter(
//             (restaurant: RestaurantModel) =>
//               currentUser.favoriteRestaurants.includes(
//                 Number(restaurant.id)
//               )
//           );

//           setFavoriteRestaurants(restaurants);

//         } else {

//           setFavoriteRestaurants([]);

//         }

//       } catch (error) {

//         console.error(
//           'שגיאה בטעינת המועדפים:',
//           error
//         );

//         dispatch(
//           showMessage({
//             title: 'שגיאה',
//             body: 'אירעה שגיאה בטעינת המועדפים',
//             delay: 4000
//           })
//         );

//       } finally {

//         setLoadingFavorites(false);

//       }

//     };

//     loadFavorites();

//   }, [currentUser, dispatch]);


//   // -----------------------------------------
//   // שמירת פרטים אישיים
//   // -----------------------------------------

//   const handleSave = async () => {

//     try {

//       const response = await updateCustomer(
//         currentUser.id,
//         name,
//         email,
//         password,
//         currentUser.isAdmin
//       );

//       if (response.data.success) {

//         const updatedUser = {

//           id: currentUser.id,

//           isAdmin: currentUser.isAdmin,

//           name,

//           email,

//           password,

//           // חשוב מאוד:
//           // לא לאבד את המועדפים הקיימים
//           favoriteRecipes:
//             currentUser.favoriteRecipes || [],

//           favoriteProducts:
//             currentUser.favoriteProducts || [],

//           favoriteRestaurants:
//             currentUser.favoriteRestaurants || [],

//           followedForums:
//             currentUser.followedForums || []

//         };

//         dispatch(setUser(updatedUser));

//         // שמירה גם ב-sessionStorage
//         sessionStorage.setItem(
//           'user-data',
//           JSON.stringify(updatedUser)
//         );

//         dispatch(
//           showMessage({
//             title: 'הצלחה',
//             body: 'הפרטים עודכנו בהצלחה!',
//             delay: 3000
//           })
//         );

//         setIsEditing(false);

//       } else {

//         dispatch(
//           showMessage({
//             title: 'שגיאה',
//             body: 'אירעה שגיאה בשמירה בשרת.',
//             delay: 4000
//           })
//         );

//       }

//     } catch (error) {

//       console.error(
//         'שגיאה בעדכון:',
//         error
//       );

//       dispatch(
//         showMessage({
//           title: 'שגיאה',
//           body: 'אירעה שגיאה בעדכון הנתונים.',
//           delay: 4000
//         })
//       );

//     }

//   };


//   // -----------------------------------------
//   // משתמש לא מחובר
//   // -----------------------------------------

//   if (!currentUser) {

//     return (
//       <div className="CustomerDetails">
//         <p>לא מחובר</p>
//       </div>
//     );

//   }


//   // -----------------------------------------
//   // תצוגת פרטים אישיים
//   // -----------------------------------------

//   const renderPersonalDetails = () => {

//     return (

//       <div className="personal-details">

//         <h3>פרטים אישיים:</h3>

//         {isEditing ? (

//           <div className="edit-details">

//             <label>
//               שם:
//               <input
//                 value={name}
//                 onChange={(e) =>
//                   setName(e.target.value)
//                 }
//               />
//             </label>

//             <label>
//               אימייל:
//               <input
//                 value={email}
//                 onChange={(e) =>
//                   setEmail(e.target.value)
//                 }
//               />
//             </label>

//             <label>
//               סיסמה:
//               <input
//                 value={password}
//                 onChange={(e) =>
//                   setPassword(e.target.value)
//                 }
//                 type="password"
//               />
//             </label>

//             <button
//               onClick={handleSave}
//             >
//               שמור
//             </button>

//             <button
//               className="secondary-button"
//               onClick={() =>
//                 setIsEditing(false)
//               }
//             >
//               ביטול
//             </button>

//           </div>

//         ) : (

//           <div className="details-display">

//             <p>
//               <strong>שם:</strong>{' '}
//               {currentUser.name}
//             </p>

//             <p>
//               <strong>אימייל:</strong>{' '}
//               {currentUser.email}
//             </p>

//             <p>
//               <strong>סיסמה:</strong>{' '}
//               ••••••••
//             </p>

//             <button
//               onClick={() =>
//                 setIsEditing(true)
//               }
//             >
//               לעדכון הפרטים
//             </button>

//           </div>

//         )}

//       </div>

//     );

//   };


//   // -----------------------------------------
//   // מתכונים מועדפים
//   // -----------------------------------------

//   const renderFavoriteRecipes = () => {

//     return (

//       <div className="favorites-section">

//         <h3>⭐ המתכונים שלי</h3>

//         {loadingFavorites ? (

//           <p>טוען מתכונים...</p>

//         ) : favoriteRecipes.length === 0 ? (

//           <div className="empty-section">
//             <p>עדיין לא סימנת מתכונים כמועדפים.</p>
//           </div>

//         ) : (

//           <div className="favorites-grid">

//             {favoriteRecipes.map((recipe) => (

//               <div
//                 className="favorite-card"
//                 key={recipe.id}
//               >

//                 <h4>
//                   {recipe.name}
//                 </h4>

//                 <p>
//                   קטגוריה: {recipe.category}
//                 </p>

//                 {recipe.difficulty && (

//                   <p>
//                     רמת קושי: {recipe.difficulty}
//                   </p>

//                 )}

//                 <p>
//                   זמן הכנה: {recipe.preparationTime}
//                 </p>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     );

//   };


//   // -----------------------------------------
//   // מוצרים מועדפים
//   // -----------------------------------------

//   const renderFavoriteProducts = () => {

//     return (

//       <div className="favorites-section">

//         <h3>🛒 המוצרים שלי</h3>

//         {loadingFavorites ? (

//           <p>טוען מוצרים...</p>

//         ) : favoriteProducts.length === 0 ? (

//           <div className="empty-section">
//             <p>עדיין לא סימנת מוצרים כמועדפים.</p>
//           </div>

//         ) : (

//           <div className="favorites-grid">

//             {favoriteProducts.map((product) => (

//               <div
//                 className="favorite-card"
//                 key={product.id}
//               >

//                 <h4>
//                   {product.name}
//                 </h4>

//                 <p>
//                   מותג: {product.brand}
//                 </p>

//                 <p>
//                   קטגוריה: {product.category}
//                 </p>

//                 <p className="favorite-price">
//                   ₪{product.price}
//                 </p>

//                 <p>
//                   כשרות: {product.kosher}
//                 </p>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     );

//   };


//   // -----------------------------------------
//   // מסעדות מועדפות
//   // -----------------------------------------

//   const renderFavoriteRestaurants = () => {

//     return (

//       <div className="favorites-section">

//         <h3>🍽️ המסעדות שלי</h3>

//         {loadingFavorites ? (

//           <p>טוען מסעדות...</p>

//         ) : favoriteRestaurants.length === 0 ? (

//           <div className="empty-section">
//             <p>עדיין לא סימנת מסעדות כמועדפות.</p>
//           </div>

//         ) : (

//           <div className="favorites-grid">

//             {favoriteRestaurants.map((restaurant) => (

//               <div
//                 className="favorite-card"
//                 key={restaurant.id}
//               >

//                 <h4>
//                   {restaurant.name}
//                 </h4>

//                 <p>
//                   עיר: {restaurant.city}
//                 </p>

//                 <p>
//                   כתובת: {restaurant.address}
//                 </p>

//                 <p>
//                   סוג: {restaurant.type}
//                 </p>

//                 <p>
//                   כשרות: {restaurant.kosher}
//                 </p>

//                 <p>
//                   דירוג: ⭐ {restaurant.rating}
//                 </p>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     );

//   };


//   // -----------------------------------------
//   // פורומים
//   // -----------------------------------------

//   const renderFollowedForums = () => {

//     const forums =
//       currentUser.followedForums || [];

//     return (

//       <div className="favorites-section">

//         <h3>💬 הפורומים שלי</h3>

//         {forums.length === 0 ? (

//           <div className="empty-section">

//             <p>
//               עדיין לא סימנת פורומים למעקב.
//             </p>

//           </div>

//         ) : (

//           <div className="favorites-grid">

//             {forums.map((forumId: string) => (

//               <div
//                 className="favorite-card"
//                 key={forumId}
//               >

//                 <h4>
//                   פורום #{forumId}
//                 </h4>

//                 <p>
//                   את עוקבת אחרי הפורום הזה.
//                 </p>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     );

//   };


//   // -----------------------------------------
//   // בחירת אזור
//   // -----------------------------------------

//   const renderActiveSection = () => {

//     switch (activeSection) {

//       case 'recipes':
//         return renderFavoriteRecipes();

//       case 'products':
//         return renderFavoriteProducts();

//       case 'restaurants':
//         return renderFavoriteRestaurants();

//       case 'forums':
//         return renderFollowedForums();

//       default:
//         return renderPersonalDetails();

//     }

//   };


//   // -----------------------------------------
//   // JSX ראשי
//   // -----------------------------------------

//   return (

//     <div className="CustomerDetails">

//       <h2>
//         שלום, {currentUser.name}! 👋
//       </h2>


//       {/* תפריט האזור האישי */}

//       <div className="customer-menu">

//         <button
//           className={
//             activeSection === 'details'
//               ? 'active'
//               : ''
//           }
//           onClick={() =>
//             setActiveSection('details')
//           }
//         >
//           👤 פרטים אישיים
//         </button>


//         <button
//           className={
//             activeSection === 'recipes'
//               ? 'active'
//               : ''
//           }
//           onClick={() =>
//             setActiveSection('recipes')
//           }
//         >
//           ⭐ המתכונים שלי
//         </button>


//         <button
//           className={
//             activeSection === 'products'
//               ? 'active'
//               : ''
//           }
//           onClick={() =>
//             setActiveSection('products')
//           }
//         >
//           🛒 המוצרים שלי
//         </button>


//         <button
//           className={
//             activeSection === 'restaurants'
//               ? 'active'
//               : ''
//           }
//           onClick={() =>
//             setActiveSection('restaurants')
//           }
//         >
//           🍽️ המסעדות שלי
//         </button>


//         <button
//           className={
//             activeSection === 'forums'
//               ? 'active'
//               : ''
//           }
//           onClick={() =>
//             setActiveSection('forums')
//           }
//         >
//           💬 הפורומים שלי
//         </button>

//       </div>


//       {/* התוכן */}

//       <div className="customer-content">

//         {renderActiveSection()}

//       </div>

//     </div>

//   );

// };

// export default CustomerDetails;

import React, { FC, useEffect, useMemo, useState } from 'react';
import './CustomerDetails.scss';

import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { setUser } from '../../redux/userSlice';

import {
  updateCustomer,
  GetAllWines,
  GetAllProducts,
  GetAllRestaurants,
    GetAllPosts,
  FavoriteType,
  UpdateSensitivities
} from '../../service/wines';
import { ALLERGENS, AllergenKey } from '../../models/allergens';

import { showMessage } from '../../redux/messageSlice';

import { RecipeModel } from '../../models/wine';
import { ProductModel } from '../../models/product';
import { RestaurantModel } from '../../models/restaurant';
import { PostModel } from '../../models/forum';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import { AllergenIcon } from '../Allergens/Allergens';
import { IconType } from 'react-icons';
import {
  LuArrowLeft,
  LuCheck,
  LuChefHat,
  LuHeart,
  LuMessagesSquare,
  LuSearch,
  LuShieldCheck,
  LuShoppingBasket,
  LuUser,
  LuUtensils
} from 'react-icons/lu';
import { API_URL } from '../../config/api';

interface CustomerDetailsProps {}

type Section = 'all' | FavoriteType | 'sensitivities' | 'details';

interface SavedItem {
  key: string;
  type: FavoriteType;
  id: number;
  title: string;
  meta: string[];
  imageUrl?: string;
}

const TYPE_INFO: Record<FavoriteType, { label: string; icon: IconType; route: string; listName: string }> = {
  recipe: { label: 'מתכונים', icon: LuChefHat, route: '/Home/Recipes', listName: 'favoriteRecipes' },
  product: { label: 'מוצרים', icon: LuShoppingBasket, route: '/Home/Products', listName: 'favoriteProducts' },
  restaurant: { label: 'מסעדות', icon: LuUtensils, route: '/Home/Restaurants', listName: 'favoriteRestaurants' },
  forum: { label: 'פורום', icon: LuMessagesSquare, route: '/Home/forum', listName: 'followedForums' }
};

const TYPE_ORDER: FavoriteType[] = ['recipe', 'product', 'restaurant', 'forum'];

const Thumb: FC<{ imageUrl?: string; icon: IconType }> = ({ imageUrl, icon: Icon }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="saved-thumb">
      {imageUrl && !failed
        ? <img src={imageUrl} alt="" onError={() => setFailed(true)} />
        : <Icon size={24} aria-hidden="true" />}
    </div>
  );
};

const CustomerDetails: FC<CustomerDetailsProps> = () => {

  const currentUser = useSelector(
    (store: any) => store.userSlice.currentUser
  );

  const dispatch = useDispatch();
    const navigate = useNavigate();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [recipes, setRecipes] = useState<RecipeModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantModel[]>([]);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

    const [activeSection, setActiveSection] = useState<Section>(
    location.state?.section === 'sensitivities' ? 'sensitivities' : 'all'
  );
  const [savingSensitivity, setSavingSensitivity] = useState(false);
  const [search, setSearch] = useState('');

  const hasUser = Boolean(currentUser);

  useEffect(() => {

    if (!currentUser) {
      return;
    }

    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setPassword(currentUser.password || '');

  }, [currentUser]);

  // הנתונים נטענים פעם אחת - הסינון לפי הרשימה נעשה בזמן הצגה
  useEffect(() => {

    if (!hasUser) {
      return;
    }

    const toArray = (data: any, key: string) =>
      Array.isArray(data) ? data : data?.[key] || [];

    Promise.allSettled([
      GetAllWines(),
      GetAllProducts(),
      GetAllRestaurants(),
      GetAllPosts()
    ]).then(([recipesRes, productsRes, restaurantsRes, postsRes]) => {
      if (recipesRes.status === 'fulfilled')
        setRecipes(toArray(recipesRes.value.data, 'recipes'));
      if (productsRes.status === 'fulfilled')
        setProducts(toArray(productsRes.value.data, 'glutenFreeProducts'));
      if (restaurantsRes.status === 'fulfilled')
        setRestaurants(toArray(restaurantsRes.value.data, 'restaurants'));
      if (postsRes.status === 'fulfilled')
        setPosts(toArray(postsRes.value.data, 'posts'));

      if ([recipesRes, productsRes, restaurantsRes, postsRes].some(r => r.status === 'rejected')) {
        console.error('חלק מהנתונים של הרשימה שלי לא נטענו');
      }
    }).finally(() => setIsLoading(false));

  }, [hasUser]);

  const savedItems = useMemo<Record<FavoriteType, SavedItem[]>>(() => {

    const savedIds = (type: FavoriteType): number[] =>
      ((currentUser?.[TYPE_INFO[type].listName]) || []).map(Number);

    // שומרים על סדר השמירה - האחרון שנשמר מופיע ראשון
    const pick = <T extends { id: number | string }>(type: FavoriteType, items: T[], toSaved: (item: T) => Omit<SavedItem, 'key' | 'type' | 'id'>) =>
      savedIds(type)
        .slice()
        .reverse()
        .map(id => items.find(item => Number(item.id) === id))
        .filter((item): item is T => Boolean(item))
        .map(item => ({
          key: `${type}-${item.id}`,
          type,
          id: Number(item.id),
          ...toSaved(item)
        }));

    return {
      recipe: pick('recipe', recipes, r => ({
        title: r.name,
        meta: [r.category, r.preparationTime, r.difficulty].filter(Boolean) as string[],
        imageUrl: r.image ? `${API_URL}/image/${r.image}` : undefined
      })),
      product: pick('product', products, p => ({
        title: p.name,
        meta: [p.brand, p.price !== undefined ? `₪${p.price}` : '', p.category].filter(Boolean) as string[],
        imageUrl: p.image ? `${API_URL}/image/${p.image}` : undefined
      })),
      restaurant: pick('restaurant', restaurants, r => ({
        title: r.name,
        meta: [r.city, r.type, r.rating ? `דירוג ${r.rating}` : ''].filter(Boolean) as string[]
      })),
      forum: pick('forum', posts, p => ({
        title: p.title,
        meta: [p.author, p.category, `${(p.replies || []).length} תגובות`].filter(Boolean) as string[],
        imageUrl: p.image || undefined
      }))
    };

  }, [currentUser, recipes, products, restaurants, posts]);

  const totalSaved = TYPE_ORDER.reduce((sum, type) => sum + savedItems[type].length, 0);

  const visibleItems = useMemo(() => {
    const items = activeSection === 'all'
      ? TYPE_ORDER.flatMap(type => savedItems[type])
            : activeSection === 'details' || activeSection === 'sensitivities'
        ? []
        : savedItems[activeSection];

    const term = search.trim().toLowerCase();
    if (!term)
      return items;
    return items.filter(item =>
      [item.title, ...item.meta].some(text => text.toLowerCase().includes(term))
    );
  }, [activeSection, savedItems, search]);

  const openItem = (item: SavedItem) => {
    navigate(TYPE_INFO[item.type].route, { state: { openId: item.id } });
  };

    const toggleSensitivity = async (key: AllergenKey) => {
    if (savingSensitivity) return;

    const previous: string[] = currentUser.sensitivities || [];
    const next = previous.includes(key)
      ? previous.filter(k => k !== key)
      : [...previous, key];

    const saveUser = (sensitivities: string[]) => {
      const updatedUser = { ...currentUser, sensitivities };
      dispatch(setUser(updatedUser));
      sessionStorage.setItem('user-data', JSON.stringify(updatedUser));
    };

    // עדכון מיידי, ואז שמירה בשרת
    saveUser(next);
    setSavingSensitivity(true);
    try {
      const response = await UpdateSensitivities(currentUser.id, next);
      saveUser(response.data.data);
    } catch (error) {
      console.error('שגיאה בשמירת רגישויות:', error);
      saveUser(previous);
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'לא ניתן לשמור את הרגישויות כרגע.',
        delay: 4000
      }));
    } finally {
      setSavingSensitivity(false);
    }
  };

  const handleSave = async () => {

    try {

      const response = await updateCustomer(
        currentUser.id,
        name,
        email,
        password,
        currentUser.isAdmin,
        currentUser.favoriteRecipes || [],
        currentUser.favoriteProducts || [],
        currentUser.favoriteRestaurants || [],
        currentUser.followedForums || []
      );

      if (response.data.success) {

        const updatedUser = {
          ...currentUser,
          name,
          email,
          password
        };

        dispatch(setUser(updatedUser));

        sessionStorage.setItem(
          'user-data',
          JSON.stringify(updatedUser)
        );

        dispatch(
          showMessage({
            title: 'הצלחה',
            body: 'הפרטים עודכנו בהצלחה!',
            delay: 3000
          })
        );

        setIsEditing(false);

      } else {

        dispatch(
          showMessage({
            title: 'שגיאה',
            body: 'אירעה שגיאה בשמירת הנתונים.',
            delay: 4000
          })
        );

      }

    } catch (error) {

      console.error(
        'שגיאה בעדכון:',
        error
      );

      dispatch(
        showMessage({
          title: 'שגיאה',
          body: 'אירעה שגיאה בעדכון הנתונים.',
          delay: 4000
        })
      );

    }

  };

  if (!currentUser) {

    return (
      <div className="CustomerDetails">
        <p>לא מחובר</p>
      </div>
    );

  }

    const mySensitivities: string[] = currentUser.sensitivities || [];

  const emptyText = activeSection === 'all' || activeSection === 'details' || activeSection === 'sensitivities'
    ? 'עדיין לא שמרת כלום. לחצו על סמל הלב ליד מתכון, מוצר או מסעדה, או על סמל השמירה בפוסט בפורום, והם יופיעו כאן.'
    : `עדיין לא שמרת ${TYPE_INFO[activeSection].label}.`;

  return (

    <div className="CustomerDetails">

      <div className="my-list-header">
        <h2>הרשימה שלי</h2>
        <p>
          שלום {currentUser.name}, {totalSaved > 0
            ? `${totalSaved} פריטים שמורים`
            : 'כאן יופיעו כל הפריטים שנשמרו'}
        </p>
      </div>

      <div className="profile-menu">

        <button
          className={activeSection === 'all' ? 'active' : ''}
          onClick={() => setActiveSection('all')}
        >
          <LuHeart size={17} aria-hidden="true" />
          <span className="tab-label">הכל</span>
          <span className="tab-count">{totalSaved}</span>
        </button>

        {TYPE_ORDER.map(type => (
          <button
            key={type}
            className={activeSection === type ? 'active' : ''}
            onClick={() => setActiveSection(type)}
          >
            {React.createElement(TYPE_INFO[type].icon, { size: 17, 'aria-hidden': true })}
            <span className="tab-label">{TYPE_INFO[type].label}</span>
            <span className="tab-count">{savedItems[type].length}</span>
          </button>
        ))}

                <button
          className={activeSection === 'sensitivities' ? 'active' : ''}
          onClick={() => setActiveSection('sensitivities')}
        >
          <LuShieldCheck size={17} aria-hidden="true" />
          <span className="tab-label">הרגישויות שלי</span>
          <span className="tab-count">{mySensitivities.length}</span>
        </button>

        <button
          className={activeSection === 'details' ? 'active' : ''}
          onClick={() => setActiveSection('details')}
        >
          <LuUser size={17} aria-hidden="true" />
          <span className="tab-label">פרטים אישיים</span>
        </button>

      </div>

            {activeSection !== 'sensitivities' && mySensitivities.length === 0 && (
        <div className="sensitivity-banner">
          <LuShieldCheck size={20} aria-hidden="true" />
          <span>עוד לא הגדרת רגישויות. אחרי ההגדרה, מוצרים, מתכונים ומסעדות יסוננו בשבילך אוטומטית.</span>
          <button onClick={() => setActiveSection('sensitivities')}>להגדרת רגישויות</button>
        </div>
      )}

      {activeSection === 'sensitivities' ? (

        <div className="profile-section">

          <h3>הרגישויות שלי</h3>

          <p className="sensitivity-intro">
            סמנו את הרגישויות שלכם. בעמודי המוצרים, המתכונים והמסעדות יוצג רק מה שמתאים לכם,
            וליד כל פריט יופיע אם הוא מתאים. השינוי נשמר מיד.
          </p>

          <div className="sensitivity-grid">
            {ALLERGENS.map(allergen => {
              const selected = mySensitivities.includes(allergen.key);
              return (
                <button
                  key={allergen.key}
                  type="button"
                  className={`sensitivity-card${selected ? ' selected' : ''}`}
                  onClick={() => toggleSensitivity(allergen.key)}
                  aria-pressed={selected}
                  disabled={savingSensitivity}
                >
                  <span className="sensitivity-icon">
                    <AllergenIcon allergenKey={allergen.key} size={22} />
                  </span>
                  <span className="sensitivity-name">{allergen.label}</span>
                  <span className="sensitivity-check" aria-hidden="true">
                    {selected && <LuCheck size={14} />}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      ) : activeSection === 'details' ? (

        <div className="profile-section">

          <h3>
            פרטים אישיים
          </h3>

          {isEditing ? (

            <div className="edit-form">

              <label>
                שם:
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </label>

              <label>
                אימייל:
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>

              <label>
                סיסמה:
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                />
              </label>

              <button onClick={handleSave}>
                שמור
              </button>

              <button
                className="secondary-button"
                onClick={() => setIsEditing(false)}
              >
                ביטול
              </button>

            </div>

          ) : (

            <div className="personal-details">

              <p>
                <strong>שם:</strong>{' '}
                {currentUser.name}
              </p>

              <p>
                <strong>אימייל:</strong>{' '}
                {currentUser.email}
              </p>

              <p>
                <strong>סיסמה:</strong>{' '}
                ••••••••
              </p>

              <button onClick={() => setIsEditing(true)}>
                לעדכון הפרטים
              </button>

            </div>

          )}

        </div>

      ) : (

        <div className="profile-section">

          {totalSaved > 0 && (
            <label className="saved-search">
              <LuSearch size={17} aria-hidden="true" />
              <input
                type="text"
                placeholder="חיפוש ברשימה שלי"
                aria-label="חיפוש ברשימה שלי"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </label>
          )}

          {isLoading ? (

            <p className="empty-message">טוען את הרשימה שלך...</p>

          ) : visibleItems.length === 0 ? (

            <div className="empty-message">
              <p>{search.trim() ? 'לא נמצאו פריטים מתאימים.' : emptyText}</p>
              {!search.trim() && activeSection !== 'all' && (
                <button onClick={() => navigate(TYPE_INFO[activeSection].route)}>
                  למעבר ל{TYPE_INFO[activeSection].label}
                </button>
              )}
            </div>

          ) : (

            <div className="saved-grid">

              {visibleItems.map(item => (

                <div
                  key={item.key}
                  className="saved-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => openItem(item)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') openItem(item);
                  }}
                >

                  <Thumb imageUrl={item.imageUrl} icon={TYPE_INFO[item.type].icon} />

                  <div className="saved-info">
                    <span className="saved-type">
                      {TYPE_INFO[item.type].label}
                    </span>
                    <h4>{item.title}</h4>
                    <div className="saved-meta">
                      {item.meta.map((text, index) => (
                        <span key={index}>{text}</span>
                      ))}
                    </div>
                  </div>

                  <div className="saved-actions">
                    <FavoriteButton itemId={item.id} type={item.type} />
                    <span className="saved-open">
                      פתיחה
                      <LuArrowLeft size={14} aria-hidden="true" />
                    </span>
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </div>
  );
};

export default CustomerDetails;
