import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/main/Sidebar";
import Main from "./pages/main/Main";
import Report from "./pages/report/Report";
import Session from "./pages/session/Session";
import AI from "./pages/AI/AI";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex flex-1 bg-[#F8FAFC]">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/report" element={<Report />} />
            <Route path="/session" element={<Session />} />
            <Route path="/ai" element={<AI />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
