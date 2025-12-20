import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import GroupsPage from "./pages/GroupsPage";
import FriendsPage from "./pages/FriendsPage";
import HistoryPage from "./pages/HistoryPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { Toaster } from "react-hot-toast";
import AgentPage from "./pages/AgentPage";
import AccountVerified from "./pages/AccountVerified";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Sidebar />

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/verify/:id/:token" element={<AccountVerified />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />

        <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />

        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

        <Route path="/agent" element={
          <ProtectedRoute><AgentPage /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}
