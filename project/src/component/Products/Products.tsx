import './Products.scss';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { ProductModel } from '../../models/product';
import { showMessage } from '../../redux/messageSlice';
import { AddProductReview, DeleteProduct, DeleteProductReview, GetAllProducts } from '../../service/wines';
import ItemDetailsModal from '../ItemDetailsModal/ItemDetailsModal';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import { AllergenBadges, AllergenFilter, useAllergenFilter } from '../Allergens/Allergens';
import { LuScale, LuShoppingBasket, LuSmile, LuTrash2, LuWallet, LuBadgeCheck } from 'react-icons/lu';

interface ProductsProps {}

const Products: FC<ProductsProps> = () => {
  const myNavigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [displayedCount, setDisplayedCount] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState('כל המוצרים');
    // אפשר לפתוח מוצר ישירות מ"הרשימה שלי"
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    location.state?.openId !== undefined ? String(location.state.openId) : null
  );
    const currentUser = JSON.parse(sessionStorage.getItem('user-data') || '{}');
  const isAdmin = currentUser?.isAdmin === true;

  useEffect(() => {
    GetAllProducts()
      .then((response: any) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.glutenFreeProducts || [];

        setProducts(data);
        setDisplayedCount(20);
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          showMessage({
            title: 'שגיאה',
            body: 'אירעה שגיאה בעת טעינת המוצרים',
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

  const filteredProducts = useMemo(
    () =>
      products.filter((p: ProductModel) => {
        const matchesCategory =
          !selectedCategory ||
          selectedCategory === 'כל המוצרים' ||
          p.category === selectedCategory;
        return matchesCategory;
      }),
    [products, selectedCategory]
  );

    const { filtered: safeProducts, filterProps } = useAllergenFilter(
    filteredProducts,
    (p: ProductModel) => p.freeFrom
  );

  const visibleProducts = useMemo(
    () => safeProducts.slice(0, displayedCount),
    [safeProducts, displayedCount]
  );

  const handleLoadMore = () => {
    setDisplayedCount((prev) => Math.min(prev + 10, safeProducts.length));
  };

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === selectedProductId) || null,
    [products, selectedProductId]
  );

  const handleProductClick = (product: ProductModel) => {
    setSelectedProductId(String(product.id));
  };

  const closeDetails = useCallback(() => setSelectedProductId(null), []);

  const replaceProduct = (updated: ProductModel) =>
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(updated.id) ? updated : p))
    );

  const handleAddReview = async (comment: string, stars: number) => {
    if (!selectedProduct) return;
    try {
      const res = await AddProductReview(String(selectedProduct.id), {
        clientId: currentUser?.id,
        clientName: currentUser?.name,
        comment,
        stars,
      });
      replaceProduct(res.data);
      dispatch(showMessage({ title: 'הצלחה', body: 'הביקורת נשמרה', delay: 3000 }));
    } catch (err) {
      console.error(err);
      dispatch(showMessage({ title: 'שגיאה', body: 'שמירת הביקורת נכשלה', delay: 4000 }));
      throw err;
    }
  };

    const handleDeleteProduct = async (product: ProductModel) => {
    if (!window.confirm(`למחוק את "${product.name}" מהאתר?`)) return;
    try {
      await DeleteProduct(String(product.id), currentUser?.id);
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(product.id)));
      if (selectedProductId === String(product.id)) setSelectedProductId(null);
      dispatch(showMessage({ title: 'הצלחה', body: 'המוצר נמחק', delay: 3000 }));
    } catch (err) {
      console.error(err);
      dispatch(showMessage({ title: 'שגיאה', body: 'מחיקת המוצר נכשלה', delay: 4000 }));
    }
  };

  const handleDeleteReview = async (index: number) => {
    if (!selectedProduct) return;
    try {
      const res = await DeleteProductReview(String(selectedProduct.id), index, currentUser?.id);
      replaceProduct(res.data);
    } catch (err) {
      console.error(err);
      dispatch(showMessage({ title: 'שגיאה', body: 'מחיקת הביקורת נכשלה', delay: 4000 }));
    }
  };

  return (
    <div className="Products">
      <div className="Products-shell">
        <header className="page-header">
          <h1>מוצרים</h1>
          <p>מוצרים מהסופר עם פירוט מרכיבים, כשרות וביקורות של הקהילה.</p>
        </header>

        <nav className="navbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className={`nav-link ${selectedCategory === 'כל המוצרים' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('כל המוצרים')}
              >
                הכל
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${selectedCategory === 'מאפים' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('מאפים')}
              >
                קמחים
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${selectedCategory === 'חטיפים ועוגיות' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('חטיפים ועוגיות')}
              >
                חטיפים
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${selectedCategory === 'פסטות' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('פסטות')}
              >
                מוצרים
              </button>
            </li>
          </ul>
        </nav>

                <AllergenFilter {...filterProps} />

        {visibleProducts.length === 0 && (
          <p className="no-results">לא נמצאו מוצרים שמתאימים לסינון.</p>
        )}

        {selectedProduct && (
          <ItemDetailsModal
            title={selectedProduct.name}
            subtitle={selectedProduct.brand}
            imageUrl={selectedProduct.image ? `http://localhost:2000/image/${selectedProduct.image}` : undefined}
            fallbackIcon={<LuShoppingBasket />}
            badges={[selectedProduct.category, selectedProduct.contains]}
            rating={selectedProduct.rating}
            favorite={{ itemId: Number(selectedProduct.id), type: 'product' }}
                        allergens={{ freeFrom: selectedProduct.freeFrom }}
            facts={[
              { icon: <LuWallet />, label: 'מחיר', value: selectedProduct.price !== undefined ? `₪${selectedProduct.price}` : undefined },
              { icon: <LuScale />, label: 'משקל', value: selectedProduct.weight },
              { icon: <LuBadgeCheck />, label: 'כשרות', value: selectedProduct.kosher },
              { icon: <LuSmile />, label: 'טעם', value: selectedProduct.flavor }
            ]}
            sections={[
              { title: 'תיאור', text: selectedProduct.description },
              { title: 'מרכיבים', items: selectedProduct.ingredients },
              {
                title: 'ערכים תזונתיים (ל-100 גרם)',
                items: selectedProduct.nutritionalValues
                  ? [
                      `קלוריות: ${selectedProduct.nutritionalValues.calories}`,
                      `חלבון: ${selectedProduct.nutritionalValues.protein}`,
                      `פחמימות: ${selectedProduct.nutritionalValues.carbs}`,
                      `שומן: ${selectedProduct.nutritionalValues.fat}`
                    ]
                  : []
              },
              { title: 'איפה קונים', items: selectedProduct.availableIn }
            ]}
            reviews={selectedProduct.reviews}
            currentUserId={currentUser?.id}
            onAddReview={handleAddReview}
            onDeleteReview={handleDeleteReview}
            onClose={closeDetails}
          />
        )}

        <div className="products-grid">
          {visibleProducts.map((p: ProductModel) => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => handleProductClick(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleProductClick(p);
                }
              }}
            >
              {/* {p.image ; (
                <img
                  className="product-image"
                  src={`http://localhost:2000/image/${p.image}`}
                  alt={p.name}
                />
              )} */}
                            <div className="card-favorite">
                <FavoriteButton itemId={Number(p.id)} type="product" />
              </div>
              <span className="card-category">{p.category}</span>
              <h3>{p.name}</h3>
              {p.brand && <p className="meta-text">{p.brand}</p>}
              {p.description && <p className="card-description">{p.description}</p>}
              <AllergenBadges freeFrom={p.freeFrom} />
              <div className="card-footer">
                <span className="price">₪{p.price}</span>
                {p.kosher && <span className="muted">{p.kosher}</span>}
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="admin-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProduct(p);
                  }}
                >
                  <LuTrash2 size={15} aria-hidden="true" />
                  מחק מוצר
                </button>
              )}
            </div>
          ))}
        </div>

        {displayedCount < safeProducts.length && (
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

export default Products;
