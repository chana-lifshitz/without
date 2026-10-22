import './FavoriteButton.scss';
import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LuBookmark, LuHeart } from 'react-icons/lu';

import { setUser } from '../../redux/userSlice';
import { showMessage } from '../../redux/messageSlice';
import { FavoriteType, ToggleFavorite } from '../../service/wines';

interface FavoriteButtonProps {
  itemId: number;
  type: FavoriteType;
  // מציג גם טקסט ליד האייקון (למשל בחלון פרטים)
  showLabel?: boolean;
}

const LIST_BY_TYPE = {
  recipe: 'favoriteRecipes',
  product: 'favoriteProducts',
  restaurant: 'favoriteRestaurants',
  forum: 'followedForums'
} as const;

const FavoriteButton: FC<FavoriteButtonProps> = ({
  itemId,
  type,
  showLabel = false
}) => {

  const currentUser = useSelector(
    (store: any) => store.userSlice.currentUser
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  if (!currentUser) {
    return null;
  }

  const listName = LIST_BY_TYPE[type];
  const currentList: number[] = (currentUser[listName] || []).map(Number);
  const isFavorite = currentList.includes(Number(itemId));
  const isForum = type === 'forum';

  const saveUser = (user: any) => {
    dispatch(setUser(user));
    sessionStorage.setItem('user-data', JSON.stringify(user));
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (loading) {
      return;
    }

    const previousUser = currentUser;

    // עדכון מיידי במסך, ואז שמירה בשרת
    saveUser({
      ...currentUser,
      [listName]: isFavorite
        ? currentList.filter(id => id !== Number(itemId))
        : [...currentList, Number(itemId)]
    });
    if (!isFavorite) {
      setAnimate(true);
      window.setTimeout(() => setAnimate(false), 450);
    }

    setLoading(true);
    try {
      const response = await ToggleFavorite(currentUser.id, type, Number(itemId));
      const { saved, ...lists } = response.data.data;
      saveUser({ ...previousUser, ...lists });

      dispatch(showMessage({
        title: saved ? 'נשמר' : 'הוסר',
        body: saved ? 'נוסף לרשימה שלי' : 'הוסר מהרשימה שלי',
        delay: 2000
      }));
    } catch (error) {
      console.error('שגיאה בעדכון הרשימה שלי:', error);
      saveUser(previousUser);
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'לא ניתן לשמור כרגע. יש לנסות שוב.',
        delay: 4000
      }));
    } finally {
      setLoading(false);
    }
  };

  const label = isFavorite
    ? 'נשמר ברשימה שלי'
    : 'שמירה לרשימה שלי';

  return (
    <button
      type="button"
      className={[
        'favorite-button',
        isFavorite ? 'favorite-active' : '',
        isForum ? 'favorite-bookmark' : '',
        showLabel ? 'with-label' : '',
        animate ? 'pop' : ''
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
    >
      <span className="favorite-icon">
        {isForum
          ? <LuBookmark fill={isFavorite ? 'currentColor' : 'none'} />
          : <LuHeart fill={isFavorite ? 'currentColor' : 'none'} />}
      </span>
      {showLabel && (
        <span className="favorite-label">
          {isFavorite ? 'נשמר' : 'שמירה'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
