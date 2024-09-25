import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./pages/layout/Layout"
import Home from "./pages/index/Home"
import Test from "./pages/test/Test"
import Retest from "./pages/retest/Retest"
import Ai from "./pages/ai/Ai"
import Result from "./pages/test/result"
import SignIn from "./pages/auth/sign-in"
import SignUp from "./pages/auth/sign-up"


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
      {
        path: "sign-in",
        element: <SignIn/>
      },
      {
        path: "sign-up",
        element: <SignUp/>
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