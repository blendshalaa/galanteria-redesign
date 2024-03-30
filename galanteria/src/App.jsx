
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import HomePage from "./Pages/HomePage/HomePage";


import Aboutus from "./Pages/Aboutus/Aboutus";
import Ideas from "./Pages/Ideas/Ideas";
import Contact from "./Pages/Contact/Contact";
import NotFound from './Components/NotFound';

function App() {

  const router=createBrowserRouter([{
    path:'/',
    element:<HomePage/>,
    errorElement:<NotFound/>

  },
  {
    path:'/Aboutus',
    element:<Aboutus/>,
    errorElement:<NotFound/>
  },
  {
    path:'/Ideas',
    element:<Ideas/>,
    errorElement:<NotFound/>

  },
  {                   
  path:'/Contact',
  element:<Contact/>,
  errorElement:<NotFound/>
  }
])
  return (
 <div>
  <RouterProvider router={router}>
    
    <HomePage/>
    <Aboutus/>
    <Ideas/>
    
    <Contact/>
  </RouterProvider>

 </div>
  )
}

export default App
