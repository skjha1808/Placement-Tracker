import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import Students from "./pages/admin/Students";
import AdminCompanies from "./pages/admin/Companies";
import Applications from "./pages/admin/Applications";

import Overview from "./pages/student/Overview";
import Profile from "./pages/student/Profile";
import ApplicationsPage from "./pages/student/MyApplications";
import Interviews from "./pages/student/Interviews";
import AIResumeAnalyzer from "./pages/student/AIResumeAnalyzer";
import Settings from "./pages/student/Settings";

import Navbar from "./layouts/Navbar";

import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminProtectedRoute from "./components/routes/AdminProtectedRoute";

import CompanyDetails from "./pages/student/CompanyDetails";

import "./App.css";


function StudentRoute({ children }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}


function AppShell() {

    const location = useLocation();

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    const isStudentWorkspace =
        Boolean(
            token &&
            user?.role === "student"
        ) &&
        location.pathname !== "/login" &&
        location.pathname !== "/register";


    const isAdminWorkspace =
        Boolean(
            token &&
            user?.role === "admin"
        ) &&
        location.pathname.startsWith("/admin");


    let mainClassName = "app-main";

    if (isStudentWorkspace) {
        mainClassName += " student-main";
    }

    if (isAdminWorkspace) {
        mainClassName += " admin-main";
    }


    return (
        <>
            <Navbar />

            <main className={mainClassName}>

                <Routes>

                    {/* =================================================
                        PUBLIC ROUTES
                    ================================================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* =================================================
                        STUDENT ROUTES
                    ================================================= */}

                    <Route
                        path="/home"
                        element={
                            <StudentRoute>
                                <Home />
                            </StudentRoute>
                        }
                    />

                    <Route
                        path="/overview"
                        element={
                            <StudentRoute>
                                <Overview />
                            </StudentRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <Navigate
                                to="/overview"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <StudentRoute>
                                <Profile />
                            </StudentRoute>
                        }
                    />

                    <Route
                        path="/applications"
                        element={
                            <StudentRoute>
                                <ApplicationsPage />
                            </StudentRoute>
                        }
                    />

                    <Route
                        path="/company/:id"
                        element={
                            <StudentRoute>
                                <CompanyDetails />
                            </StudentRoute>
                        }
                    />

                    <Route
                        path="/companies"
                        element={
                            <Navigate
                                to="/home"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/interviews"
                        element={
                            <StudentRoute>
                                <Interviews />
                            </StudentRoute>
                        }
                    />

                    <Route
                        path="/ai-resume"
                        element={
                            <StudentRoute>
                                <AIResumeAnalyzer />
                            </StudentRoute>
                        }
                    />

                    <Route
                        path="/ai-resume-analyzer"
                        element={
                            <Navigate
                                to="/ai-resume"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <StudentRoute>
                                <Settings />
                            </StudentRoute>
                        }
                    />


                    {/* =================================================
                        ADMIN ROUTES
                    ================================================= */}

                    <Route
                        path="/admin"
                        element={
                            <AdminProtectedRoute>
                                <AdminDashboard />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/profile"
                        element={
                            <AdminProtectedRoute>
                                <AdminProfile />
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

            </main>
        </>
    );
}


function App() {

    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}


export default App;