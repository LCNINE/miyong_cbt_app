import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from './pages/index/Home';
import Test from './pages/test/Test';
import Retest from './pages/retest/Retest';
import Ai from './pages/ai/Ai';
import Layout from './pages/layout/Layout';
import Result from './pages/test/result';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
      {
        path: "test",
        element: <Test/>
      },
      {
        path: "retest",
        element: <Retest/>
      },
      {
        path: "ai",
        element: <Ai/>
      },
      {
        path: "result",
        element: <Result/>
      },
    ]
  }
])

export default function App (){
  return (
      <RouterProvider router={router}/>
    // <Router>
    //   <Routes>
    //     <Route path="" element={<Layout/>}>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/test" element={<Test />} />
    //       <Route path="/retest" element={<Retest />} />
    //       <Route path="/ai" element={<Ai />} />
    //     </Route>
    //   </Routes>
    // </Router>
  )
}