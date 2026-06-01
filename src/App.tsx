import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import type { ReactNode } from "react";
import Sidebar from "./components/main/Sidebar";
import RouteErrorBoundary from "./components/ui/RouteErrorBoundary";
import Main from "./pages/main/Main";
import Report from "./pages/report/Report";
import Session from "./pages/session/Session";
import Improve from "./pages/improve/Improve";
import ErrorPage from "./pages/error/ErrorPage";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { getLoginPathWithRedirect } from "./services/api";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const accessToken = sessionStorage.getItem("accessToken");
  const redirectPath = `${location.pathname}${location.search}${location.hash}`;

  if (!accessToken) {
    return <Navigate to={getLoginPathWithRedirect(redirectPath)} replace />;
  }

  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isLoginPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/error");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {!isLoginPage && <Sidebar />}
      <main className="flex min-w-0 flex-1 overflow-hidden bg-[#F8FAFC]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session"
            element={
              <ProtectedRoute>
                <Session />
              </ProtectedRoute>
            }
          />
          <Route
            path="/improve/*"
            element={
              <ProtectedRoute>
                <Improve />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
