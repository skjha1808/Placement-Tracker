import { BrowserRouter, Routes, Route } from "react-router-dom";
import Students from "./pages/admin/Students";
import AdminCompanies from "./pages/admin/Companies";
import Applications from "./pages/admin/Applications";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Companies from "./pages/Companies";
import MyApplications from "./pages/MyApplications";
import AdminDashboard from "./pages/admin/AdminDashboard";

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

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                    path="/admin/students"
                    element={
                        <ProtectedRoute>
                            <Students />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/companies"
                    element={
                        <ProtectedRoute>
                            <AdminCompanies />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/applications"
                    element={
                        <ProtectedRoute>
                            <Applications />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;