import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Aboutus from "./Components/Aboutus/Aboutus";
import Ideas from "./Components/Ideas/Ideas";
import Contact from "./Components/Contact/Contact";

function App() {

  return (
   <Router>
    <NavBar/>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/aboutus" element={<Aboutus/>}/>
      <Route path="/ideas" element={<Ideas/>}/>
      <Route path="/contact" element={<Contact/>}/>

    </Routes>
    <Footer/>
   </Router>
  )
}

export default App
