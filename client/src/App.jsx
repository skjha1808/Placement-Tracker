import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import AdminCompanies from "./pages/admin/Companies";
import Applications from "./pages/admin/Applications";

import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Companies from "./pages/student/Companies";
import MyApplications from "./pages/student/MyApplications";

import Navbar from "./layouts/Navbar";

import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminProtectedRoute from "./components/routes/AdminProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Student Routes */}
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

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/students"
                    element={
                        <AdminProtectedRoute>
                            <Students />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/companies"
                    element={
                        <AdminProtectedRoute>
                            <AdminCompanies />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/applications"
                    element={
                        <AdminProtectedRoute>
                            <Applications />
                        </AdminProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;