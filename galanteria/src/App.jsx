import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Products from "./Components/Context/Products";
import HomePage from './Pages/HomePage/HomePage'
import Aboutus from './Pages/Aboutus/Aboutus'
import Contact from './Pages/Contact/Contact'
import Projects from "./Pages/Projects/Projects";
import Product1Page from "./Pages/Product1Page/Product1Page";
import Project1Page from "./Pages/Project1Page/Project1Page";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Layout from "./Components/Layout/Layout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import { AdminAuthProvider } from "./Components/AdminAuth/AdminAuth";
import CategoryPage from "./Pages/CategoryPage/CategoryPage";

function App() {

  return (
    <AdminAuthProvider>
      <Router>
        <ScrollToTop />
        <Products>
          <Routes>
            {/* Admin Route — no Layout wrapper */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage/>} />
              <Route path="/Aboutus" element={<Aboutus/>} />
              <Route path="/Contact" element={<Contact/>} />
              <Route path="/Projects" element={<Projects/>} />
              
              {/* Dynamic Category Pages connected to Supabase */}
              <Route path="/Bathrooms" element={<CategoryPage category="Banjë" title="Banjë" />} />
              <Route path="/OfficeChairs" element={<CategoryPage category="Karrigë Zyreje" title="Karrige Zyreje" />} />
              <Route path="/MeetingChairs" element={<CategoryPage category="Karrigë takimesh" title="Karrige Takimesh" />} />
              <Route path="/WaitingChairs" element={<CategoryPage category="Karrigë Pritjeje" title="Karrige Pritjeje" />} />
              <Route path="/WorkingTable" element={<CategoryPage category="Tavolina Pune" title="Tavolina Pune" />} />
              <Route path="/Workstation" element={<CategoryPage category="Workstation" title="Workstation" />} />
              <Route path="/MeetingTable" element={<CategoryPage category="Tavolina Takimi" title="Tavolina Takimi" />} />
              <Route path="/Cabinets" element={<CategoryPage category="Dollapë" title="Dollapë" />} />
              <Route path="/Drawers" element={<CategoryPage category="Sirtar" title="Sirtar" />} />
              <Route path="/Others" element={<CategoryPage category="Tjera" title="Tjera" />} />

              <Route path="/product/:slug" element={<Product1Page/>}/>
              <Route path="/project/:slug" element={<Project1Page/>}/>
            </Route>
          </Routes>
        </Products>
      </Router>
    </AdminAuthProvider>
  )
}

export default App


