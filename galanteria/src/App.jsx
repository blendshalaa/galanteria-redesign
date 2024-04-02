

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Products from "./Components/Context/Products";
import HomePage from './Pages/HomePage/HomePage'

function App() {
//   const router=createBrowserRouter([{
//     path:'/',
//     element:<HomePage/>,
//     errorElement:<NotFound/>

//   },
//   {
//     path:'/Aboutus',
//     element:<Aboutus/>,
//     errorElement:<NotFound/>
//   },
//   {
//     path:'/Ideas',
//     element:<Ideas/>,
//     errorElement:<NotFound/>

//   },
//   {                   
//   path:'/Contact',
//   element:<Contact/>,
//   errorElement:<NotFound/>
//   }
// ]) 

  return (
    <Router>
      <Products>
        <Routes>
          <Route path="/" element={<HomePage/>} />
        </Routes>
      </Products>
    </Router>
//  <div>
//   <RouterProvider router={router}>
  
    
//     <HomePage/>
//     <Aboutus/>
//     <Ideas/>
    
//     <Contact/>
   
//   </RouterProvider>

//  </div>
  )
}

export default App
