import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Products from "./Components/Context/Products";
import HomePage from './Pages/HomePage/HomePage'
import Aboutus from './Pages/Aboutus/Aboutus'
import Contact from './Pages/Contact/Contact'
import Ideas from './Pages/Ideas/Ideas'

function App() {


  return (
    <Router>
      <Products>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/Aboutus" element={<Aboutus/>} />
          <Route path="/Contact" element={<Contact/>} />
          <Route path="/Ideas" element={<Ideas/>} />
        </Routes>
      </Products>
    </Router>

  )
}

export default App
