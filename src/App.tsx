import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import Home from "./pages/index/Home";
import Test from "./pages/test/Test";
import Retest from "./pages/retest/Retest";
import Ai from "./pages/ai/Ai";
import Result from "./pages/test/Result";
import SignIn from "./pages/auth/sign-in/Sign-in";
import SignUp from "./pages/auth/sign-up/Sign-up";
import { AuthProvider } from "./pages/auth/AuthContext";
import ProtectedRoute from "./pages/layout/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "test",
        element: (
          <ProtectedRoute>
            <Test />
          </ProtectedRoute>
        ),
      },
      {
        path: "retest",
        element: (
          <ProtectedRoute>
            <Retest />
          </ProtectedRoute>
        ),
      },
      {
        path: "ai",
        element: (
          <ProtectedRoute>
            <Ai />
          </ProtectedRoute>
        ),
      },
      {
        path: "result",
        element: (
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        ),
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
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
  );
}
