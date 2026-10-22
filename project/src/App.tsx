import React, { Suspense } from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import Login from './component/Login/Login';
import Home from './component/Home/Home';
import About from './component/About/About';
// import ShoppingCart from './component/ShoppingCart/ShoppingCart';
import VisitorCenter from './component/Products/Products';
import Wines from './component/Wines/Wines';
import WineDetails from './component/WineDetails/WineDetails';
//import AddWineForm from './component/AddWineForm/AddWineForm';
import Purchase from './component/Purchase/Purchase';
import CustomerDetails from './component/CustomerDetails/CustomerDetails';
import SignUp from './component/SignUp/SignUp';
import MessageToast from './component/MessageToast/MessageToast';
import Products from './component/Products/Products';
import Recipes from './component/Recipes/Recipes';
import Restaurants from './component/Restaurants/Restaurants';
import RestaurantDetails from './component/RestaurantDetails/RestaurantDetails';
import Forum from './component/forums/forum';
import Info from './component/Info/Info';

const AddWineFormLazy=React.lazy(()=>
  import('./component/AddWineForm/AddWineForm'))


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='Login' element={<Login></Login>}></Route>
        <Route path='Home' element={<Home></Home>}>
          <Route index element={<About></About>}></Route>
          <Route path='About' element={<About></About>}></Route>
          {/* <Route path='ShoppingCart' element={<ShoppingCart></ShoppingCart>}></Route> */}
          <Route path='Products' element={<Products></Products>}></Route>
          <Route path='Recipes' element={<Recipes></Recipes>}></Route>
          <Route path='Restaurants' element={<Restaurants></Restaurants>}></Route>
          <Route path='Wines' element={<Wines></Wines>}></Route>
           <Route path='CustomerDetails' element={<CustomerDetails></CustomerDetails>}></Route>
          <Route path='forum' element={<Forum></Forum>}></Route>
          <Route path='Info' element={<Info></Info>}></Route> 
        </Route>
        <Route path='SignUp' element={<SignUp></SignUp>}></Route>
         <Route path='/purchase' element={<Purchase></Purchase>}></Route>
        <Route path='/WineDetails' element={<WineDetails></WineDetails>}></Route>
        <Route path='/RestaurantDetails' element={<RestaurantDetails></RestaurantDetails>}></Route>
        <Route path="/Home/Wines/:category" element={<Wines />} />
        <Route
          path="/add-wine"
          element={
           <Suspense fallback={<div>lodding...</div>}> <AddWineFormLazy
              onClose={() => {/* לדוגמה: נווט חזרה */ }}
              onWineAdded={(newWine) => {/* לדוגמה: לעדכן רשימת יינות */ }}
            /></Suspense>
          }
        />

      </Routes>
      <MessageToast></MessageToast>
    </div>
  );
}

export default App;
