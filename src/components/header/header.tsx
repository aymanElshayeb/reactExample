import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { $user, logout } from "../../store/user";
import { useUnit } from "effector-react";
import { useEffect } from "react";


const Header = () => {
    const user = useUnit($user);
    const logoutEvent = useUnit(logout);
    const navigate = useNavigate();
    const handleLogout = () => {
        logoutEvent(user);
    };
    useEffect(() => {
        if (!user.isAuthenticated) {
           navigate("/login");
        }
    }, [user.isAuthenticated, navigate]);
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    User Management
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/profile">
                        Profile
                    </Button>
                    {user.isAuthenticated ? (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Button color="inherit" component={RouterLink} to="/login">
                            Login
                        </Button>
                    )}
                    <Button color="inherit" component={RouterLink} to="/register">
                        Register
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/tasks">
                        Tasks
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;