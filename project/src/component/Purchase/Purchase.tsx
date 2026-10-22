import React, { FC, useEffect } from 'react';
import './Purchase.scss';
import { useNavigate } from 'react-router-dom';
import { LuCircleCheck } from 'react-icons/lu';

interface PurchaseProps {}

const Purchase: FC<PurchaseProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/Home/About');
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="Purchase">
      <div className="card">
        <LuCircleCheck className="purchase-icon" size={44} aria-hidden="true" />
        <h2>ההזמנה התקבלה</h2>
        <p>המשלוח בדרך אליך. תודה שקניתם אצלנו!</p>
      </div>
    </div>
  );
};

export default Purchase;
