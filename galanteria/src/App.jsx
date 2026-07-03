import React from "react";
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
import WorkingTable from "./Pages/WorkingTable/WorkingTable";
import Workstation from "./Pages/Wokstations/Workstation";
import MeetingTable from "./Pages/MeetingTable/MeetingTable";
import Drawers from "./Pages/Drawers/Drawers";
import Others from "./Pages/Others/Others";
import Cabinets from "./Pages/Cabinets/Cabinets"
import Project1Page from "./Pages/Project1Page/Project1Page";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Layout from "./Components/Layout/Layout";

function App() {

  return (
    <Router>
      <ScrollToTop />
      <Products>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage/>} />
            <Route path="/Aboutus" element={<Aboutus/>} />
            <Route path="/Contact" element={<Contact/>} />
            <Route path="/Projects" element={<Projects/>} />
            <Route path="/Bathrooms" element={<HomeFurnitures/>} />
            <Route path="/OfficeChairs" element={<OfficeChairs/>} />
            <Route path="/MeetingChairs" element={<MeetingChairs/>} />
            <Route path="/WaitingChairs" element={<WaitingChairs/>} />
            <Route path="/WorkingTable" element={<WorkingTable/>} />
            <Route path="/Workstation" element={<Workstation/>} />
            <Route path="/MeetingTable" element={<MeetingTable/>} />
            <Route path="/Cabinets" element={<Cabinets/>} />
            <Route path="/Drawers" element={<Drawers/>} />
            <Route path="/Others" element={<Others/>} />

            <Route path="/product/:slug" element={<Product1Page/>}/>
            <Route path="/project/:slug" element={<Project1Page/>}/>
          </Route>
        </Routes>
      </Products>
    </Router>

  )
}

export default App
