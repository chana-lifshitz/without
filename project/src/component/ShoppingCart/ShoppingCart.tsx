import React, { FC } from 'react';
import './ShoppingCart.scss';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../../redux/shoppingSlice';
import { RecipeModel } from '../../models/wine';
import { useNavigate } from 'react-router';

const ShoppingCart: FC = () => {
  const dispatch = useDispatch();
  const myNavigate = useNavigate();

  const shoppingCart: RecipeModel[] = useSelector(
    (state: any) => state.shoppingSlice?.shoppingCart || []
  );

  // const totalPrice = shoppingCart.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="ShoppingCart">
      <h2>סל הקניות שלך</h2>
      <br />
      {shoppingCart.length === 0 ? (
        <p>הסל ריק כרגע</p>
      ) : (
        <div className="cart-list">
          <ul>
            {shoppingCart.map((item) => (
              <li key={item.id} className="cart-item">
                <img
                  // src={`http://localhost:2000/image/${item.image}`}
                  alt={item.name}
                  className="cart-image"
                />
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p>{item.category}</p>
                  {/* <p>מחיר: {item.price} ₪</p> */}
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item.id)}
                  >
                    הסר 
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            {/* <h3>סה״כ לתשלום: {totalPrice} ₪</h3> */}
          </div>
          <button onClick={() => myNavigate("/purchase")}>לתשלום</button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
