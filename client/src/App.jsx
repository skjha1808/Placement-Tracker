import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Companies from "./pages/Companies";
import MyApplications from "./pages/MyApplications";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/companies"
                  element={
                    <ProtectedRoute>
                      <Companies />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute>
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;