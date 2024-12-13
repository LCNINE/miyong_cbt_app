import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import Home from "./pages/index/Home";
import Test from "./pages/test/Test";
import Retest from "./pages/retest/Retest";
import Ai from "./pages/ai/Ai";
import SignIn from "./pages/auth/sign-in/Sign-in";
import SignUp from "./pages/auth/sign-up/Sign-up";
import { AuthProvider } from "./pages/auth/AuthContext";
import ProtectedRoute from "./pages/layout/ProtectedRoute";
import Result from "./pages/test/Result";
import RetestAfterTest from "./pages/retest/RetestAfterTest";
import { ToastProvider } from "./components/ui/toast";
import ProtectedRouteForSampleAi from "./pages/layout/ProtectedRouteSampleAi";
import Schedule from "./pages/schedule/Schedule";

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
        element: <Navigate to="/test/1" replace={true} />, // /test로 접근 시 /test/1로 리디렉션
      },
      {
        path: "test/:test_id",
        element: <Test />,
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
        path: "retest/afterTest",
        element: <RetestAfterTest />,
      },
      {
        path: "ai",
        element: (
          <ProtectedRouteForSampleAi>
            <Ai />
          </ProtectedRouteForSampleAi>
        ),
      },
      {
        path: "result",
        element: <Result />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}
