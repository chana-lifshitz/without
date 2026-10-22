import './ItemDetailsModal.scss';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import { AllergenDetails } from '../Allergens/Allergens';
import { useSelector } from 'react-redux';
import { LuStar, LuX } from 'react-icons/lu';

export interface DetailFact {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
}

export interface DetailSection {
  title: string;
  // רשימה מוצגת כתגיות, טקסט מוצג כפסקה
  items?: string[];
  text?: ReactNode;
}

export interface DetailReview {
  clientId?: number | string;
  clientName?: string;
  user?: string;
  comment: string;
  stars?: number;
}

interface ItemDetailsModalProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  fallbackIcon: ReactNode;
  badges?: string[];
  rating?: number;
  favorite?: {
    itemId: number;
    type: 'recipe' | 'product' | 'restaurant';
  };
    facts: DetailFact[];
  // מידע על רגישויות - מוצג כאזור "התאמה לרגישויות"
  allergens?: {
    freeFrom?: unknown;
    isRestaurant?: boolean;
  };
  sections?: DetailSection[];
  reviews?: DetailReview[];
  currentUserId?: number | string;
  onAddReview?: (comment: string, stars: number) => Promise<void>;
  onDeleteReview?: (index: number) => Promise<void>;
  onClose: () => void;
}

const Stars: FC<{ value: number }> = ({ value }) => (
  <span className="item-stars" aria-label={`${value} כוכבים`}>
    {[1, 2, 3, 4, 5].map(star => (
      <LuStar
        key={star}
        className={star <= Math.round(value) ? 'on' : ''}
        fill="currentColor"
        aria-hidden="true"
      />
    ))}
  </span>
);

const ItemDetailsModal: FC<ItemDetailsModalProps> = ({
  title,
  subtitle,
  imageUrl,
  fallbackIcon,
  badges = [],
  rating,
  favorite,
    facts,
  allergens,
  sections = [],
  reviews = [],
  currentUserId,
  onAddReview,
  onDeleteReview,
  onClose
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  // סגירה ב-Esc ונעילת גלילת הדף מאחורי החלון
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        onCloseRef.current();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const submitReview = async () => {
    if (!onAddReview || !newReview.trim() || isSaving)
      return;
    setIsSaving(true);
    try {
      await onAddReview(newReview.trim(), newStars);
      setNewReview('');
      setNewStars(5);
    } catch {
      // ההודעה מוצגת ע"י הקומפוננטה האב, והטקסט נשאר בתיבה
    } finally {
      setIsSaving(false);
    }
  };

    const currentUser = useSelector((store: any) => store.userSlice.currentUser);

  // מי שכתב את הביקורת או מנהל. ביקורות ישנות בלי מזהה מזוהות לפי השם
  const canDeleteReview = (review: DetailReview) => {
    if (!onDeleteReview || !currentUser)
      return false;
    if (currentUser.isAdmin)
      return true;
    if (review.clientId !== undefined && review.clientId !== null)
      return String(review.clientId) === String(currentUserId ?? currentUser.id);
    const authorName = review.clientName || review.user;
    return Boolean(authorName) && authorName === currentUser.name;
  };

  const deleteReview = async (index: number) => {
    if (!onDeleteReview)
      return;
    if (!window.confirm('למחוק את הביקורת?'))
      return;
    setDeletingIndex(index);
    try {
      await onDeleteReview(index);
    } finally {
      setDeletingIndex(null);
    }
  };

  const visibleFacts = facts.filter(fact =>
    fact.value !== undefined && fact.value !== null && fact.value !== ''
  );
  const visibleSections = sections.filter(section =>
    (section.items && section.items.length > 0) || section.text
  );
  const showImage = imageUrl && !imageFailed;

  return (
    <div className="item-modal-overlay" onClick={onClose}>
      <div
        className="item-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
      >
        <button className="item-modal-close" onClick={onClose} aria-label="סגור">
          <LuX size={20} />
        </button>

        <div className="item-modal-scroll">
        <div className={`item-modal-hero${showImage ? '' : ' no-image'}`}>
          {showImage ? (
            <img src={imageUrl} alt={title} onError={() => setImageFailed(true)} />
          ) : (
            <span className="item-modal-icon">{fallbackIcon}</span>
          )}
        </div>

        <div className="item-modal-body">
          <div className="item-modal-header">
            <div>
              {badges.filter(Boolean).length > 0 && (
                <div className="item-badges">
                  {badges.filter(Boolean).map(badge => (
                    <span key={badge} className="item-badge">{badge}</span>
                  ))}
                </div>
              )}
              <h2>{title}</h2>
              {subtitle && <p className="item-subtitle">{subtitle}</p>}
              {rating !== undefined && (
                <div className="item-rating">
                  <Stars value={rating} />
                  <strong>{rating}</strong>
                  <span>({reviews.length} ביקורות)</span>
                </div>
              )}
            </div>
            {favorite && (
              <FavoriteButton itemId={favorite.itemId} type={favorite.type} showLabel />
            )}
          </div>

          {visibleFacts.length > 0 && (
            <div className="item-facts">
              {visibleFacts.map(fact => (
                <div key={fact.label} className="item-fact">
                  <span className="item-fact-icon">{fact.icon}</span>
                  <div>
                    <span className="item-fact-label">{fact.label}</span>
                    <span className="item-fact-value">{fact.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

                    {allergens && (
            <section className="item-section">
              <h3>{allergens.isRestaurant ? 'מנות לרגישויות' : 'התאמה לרגישויות'}</h3>
              <AllergenDetails freeFrom={allergens.freeFrom} isRestaurant={allergens.isRestaurant} />
            </section>
          )}

          {visibleSections.map(section => (
            <section key={section.title} className="item-section">
              <h3>{section.title}</h3>
              {section.items && section.items.length > 0 ? (
                <div className="item-chips">
                  {section.items.map((item, index) => (
                    <span key={index} className="item-chip">{item}</span>
                  ))}
                </div>
              ) : (
                <p>{section.text}</p>
              )}
            </section>
          ))}

          <section className="item-section">
            <h3>ביקורות ({reviews.length})</h3>

            {reviews.length === 0 ? (
              <p className="item-muted">עדיין אין ביקורות. היו הראשונים לכתוב!</p>
            ) : (
              <ul className="item-reviews">
                {reviews.map((review, index) => (
                  <li key={index} className="item-review">
                    <div className="item-review-header">
                      <strong>{review.clientName || review.user || 'אנונימי'}</strong>
                      {review.stars ? <Stars value={review.stars} /> : null}
                      {canDeleteReview(review) && (
                          <button
                            className="item-review-delete"
                            onClick={() => deleteReview(index)}
                            disabled={deletingIndex !== null}
                            title="מחק ביקורת"
                          >
                            {deletingIndex === index ? '...' : 'מחק'}
                          </button>
                        )}
                    </div>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}

            {onAddReview && (
              <div className="item-review-form">
                <div className="item-star-picker">
                  <span>הדירוג שלך:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={star <= newStars ? 'on' : ''}
                      onClick={() => setNewStars(star)}
                      aria-label={`${star} כוכבים`}
                    >
                      <LuStar fill="currentColor" aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="כתבו ביקורת... (Ctrl+Enter לשליחה)"
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      submitReview();
                    }
                  }}
                  rows={3}
                />
                <button
                  className="item-submit"
                  onClick={submitReview}
                  disabled={isSaving || !newReview.trim()}
                >
                  {isSaving ? 'שולח...' : 'שלח ביקורת'}
                </button>
              </div>
            )}
          </section>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;
