import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Products from "./Components/Context/Products";
import HomePage from './Pages/HomePage/HomePage'
import Aboutus from './Pages/Aboutus/Aboutus'
import Contact from './Pages/Contact/Contact'
import Projects from "./Pages/Projects/Projects";
import HomeFurnitures from './Pages/Bathrooms/Bathrooms'
import Product1Page from "./Pages/Product1Page/Product1Page";
import OfficeChairs from "./Pages/OfficeChairs/OfficeChairs";
import MeetingChairs from "./Pages/MeetingChairs/MeetingChairs";
import WaitingChairs from "./Pages/WaitingChairs/WaitingChairs";

function App() {


  return (
    <Router>
      <Products>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/Aboutus" element={<Aboutus/>} />
          <Route path="/Contact" element={<Contact/>} />
          <Route path="/Projects" element={<Projects/>} />
          <Route path="/Bathrooms" element={<HomeFurnitures/>} />
          <Route path="/OfficeChairs" element={<OfficeChairs/>} />
          <Route path="/MeetingChairs" element={<MeetingChairs/>} />
          <Route path="/WaitingChairs" element={<WaitingChairs/>} />
          <Route path="/product/:slug" element={<Product1Page/>}/>


        </Routes>
      </Products>
    </Router>

  )
}

export default App
