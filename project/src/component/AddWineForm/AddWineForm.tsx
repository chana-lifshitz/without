// import React, { useState } from 'react';
// import { AddWine, UploadWineImage } from '../../service/wines';
// import { useNavigate } from 'react-router-dom';
// import './AddWineForm.scss';

// interface AddWineFormProps {
//   onClose: () => void;
//   onWineAdded: (wine: any) => void;
// }

// const AddWineForm: React.FC<AddWineFormProps> = ({ onClose, onWineAdded }) => {
//   const [name, setName] = useState('');
//   const [category, setCategory] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [error, setError] = useState('');
//   const [newWine, setnewWine] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setnewWine('');

//     if (!name || !category || !price || !imageFile) {
//       setError('אנא מלא את כל השדות והעלה תמונה');
//       return;
//     }

//     try {
//       const imageRes = await UploadWineImage(imageFile);
//       const imageName = imageRes.data.filename;

//       const response = await AddWine({
//         name,
//         category,
//         price: parseFloat(price),
//         description,
//         image: imageName,
//       });

//       onWineAdded(response.data);

//       // הצגת הודעת הצלחה
//       setnewWine('היין נוסף בהצלחה!');
      
//       // ניקוי טופס
//       setName('');
//       setCategory('');
//       setPrice('');
//       setDescription('');
//       setImageFile(null);

//       // הפניה לדף הבית אחרי שנייה
//       setTimeout(() => {
//         navigate('/Home/Wines');
//       }, 1000);
//     } catch (err: any) {
//       console.error('שגיאה בהוספת יין:', err);
//       setError(err.response?.data?.error || err.message || 'שגיאה בשרת');
//     }
//   };

//   return (
//     <div className="add-wine-form">
//       <h3>הוסף יין חדש</h3>
//       {error && <p className="error">{error}</p>}
//       {newWine && <p className="success">{newWine}</p>}

//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <input
//           type="text"
//           placeholder="שם היין"
//           value={name}
//           onChange={e => setName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="קטגוריה"
//           value={category}
//           onChange={e => setCategory(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="מחיר"
//           value={price}
//           onChange={e => setPrice(e.target.value)}
//           step="0.01"
//         />
//         <textarea
//           placeholder="תיאור"
//           value={description}
//           onChange={e => setDescription(e.target.value)}
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
//         />

//         <button type="submit">הוסף</button>
//         <button type="button" onClick={()=>navigate('/Home')}>ביטול</button>
//       </form>
//     </div>
//   );
// };

// export default AddWineForm;
import React, { useState } from 'react';
import { AddWine, UploadWineImage } from '../../service/wines';
import { useNavigate } from 'react-router-dom';
import './AddWineForm.scss';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../redux/messageSlice';

interface AddWineFormProps {
  onClose: () => void;
  onWineAdded: (wine: any) => void;
}

const AddWineForm: React.FC<AddWineFormProps> = ({ onClose, onWineAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [preparationTime, setPreparationTime] = useState({ hours: 0, minutes: 0 });
  const [difficulty, setDifficulty] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  // const [price, setPrice] = useState('');
  // const [description, setDescription] = useState('');
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !ingredients || !preparationTime || !difficulty || !rating || !reviews) {
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'אנא מלא את כל השדות',
        delay: 4000
      }));
      return;
    }

    try {
      // const imageRes = await UploadWineImage(imageFile);
      // const imageName = imageRes.data.filename;

      // const response = await AddWine({
      //   name,
      //   category,
      //   ingredients,
      //   preparationTime,
      //   difficulty,
      //   rating,
      //   // price: parseFloat(price),
      //   // description,
      //   // image: imageName,
      // });
      // onWineAdded(response.data);

      dispatch(showMessage({
        title: 'הצלחה',
        body: 'היין נוסף בהצלחה!',
        delay: 3000
      }));

      // ניקוי טופס
      // setName('');
      // setCategory('');
      // setPrice('');
      // setDescription('');
      // setImageFile(null);

      // הפניה לדף היינות
      setTimeout(() => {
        navigate('/Home/Wines');
      }, 1000);

    } catch (err: any) {
      console.error('שגיאה בהוספת יין:', err);
      dispatch(showMessage({
        title: 'שגיאה',
        body: err.response?.data?.error || err.message || 'שגיאה בשרת',
        delay: 4000
      }));
    }
  };

  return (
    <div className="add-wine-form">
      <h3>הוסף יין חדש</h3>
{/* 
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="שם היין"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="קטגוריה"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="מחיר"
          value={price}
          onChange={e => setPrice(e.target.value)}
          step="0.01"
        />
        <textarea
          placeholder="תיאור"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
        />

        <button type="submit">הוסף</button>
        <button type="button" onClick={() => navigate('/Home')}>ביטול</button>
      </form> */}
    </div>
  );
};

export default AddWineForm;
