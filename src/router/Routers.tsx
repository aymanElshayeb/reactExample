import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import ProfilePage from "../pages/profile/ProfilePage";
import RegisterPage from "../pages/register/RegisterPage";

import Layout from "../themes/layout";
import TaskPage from "../pages/task/taskPage";


const AppRoutes = () => (
    <Routes>
        {/* Routes using Layout */}
        <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tasks" element={<TaskPage />} />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
        {/* Login route without Layout */}
        <Route path="/login" element={<LoginPage />} />
    </Routes>
);

export default AppRoutes;