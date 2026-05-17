import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/main/Sidebar";
import RouteErrorBoundary from "./components/ui/RouteErrorBoundary";
import Main from "./pages/main/Main";
import Report from "./pages/report/Report";
import Session from "./pages/session/Session";
import AI from "./pages/AI/AI";
import ErrorPage from "./pages/error/ErrorPage";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

function AppLayout() {
  const { pathname } = useLocation();
  const isLoginPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/error");
  const accessToken = sessionStorage.getItem("accessToken");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {!isLoginPage && <Sidebar />}
      <main className="flex flex-1 bg-[#F8FAFC]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route
            path="/"
            element={
              accessToken ? (
                <RouteErrorBoundary>
                  <Main />
                </RouteErrorBoundary>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/report"
            element={
              <RouteErrorBoundary>
                <Report />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/session"
            element={
              <RouteErrorBoundary>
                <Session />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/ai"
            element={
              <RouteErrorBoundary>
                <AI />
              </RouteErrorBoundary>
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
