import React from "react"; 
import Header from "./Header";
//import Footer from './Footer';
import Spinner from "./Spinner";
import '../styles/index.css'
import Booking from "./Booking";

const App = () => {
  
  return (
    <div>
      <Spinner />
      <Header />
      <Booking /> 
      {/* <Footer /> */}
    </div>
  );
};
export default App;
