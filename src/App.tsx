import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/main/Sidebar";
import Main from "./pages/main/Main";
import Report from "./pages/report/Report";
import Session from "./pages/session/Session";
import AI from "./pages/AI/AI";
import Login from "./pages/login/Login";

function AppLayout() {
  const { pathname } = useLocation();
  const isLoginPage = pathname.startsWith("/login");
  const accessToken = sessionStorage.getItem("accessToken");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {!isLoginPage && <Sidebar />}
      <main className="flex flex-1 bg-[#F8FAFC]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={accessToken ? <Main /> : <Navigate to="/login" replace />}
          />
          <Route path="/report" element={<Report />} />
          <Route path="/session" element={<Session />} />
          <Route path="/ai" element={<AI />} />
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
