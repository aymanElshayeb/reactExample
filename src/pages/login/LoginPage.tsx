import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import { useUnit } from "effector-react";
import { $user, login } from "../../store/user";

const LoginPage = () => {
    const user = useUnit($user);
    const loginEvent = useUnit(login);
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);

    const [form, setForm] = useState({ userName: "", password: "" });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginEvent({ id: "", email: "", ...form });
    };

    useEffect(() => {
        if (user.isAuthenticated) {
            setShowError(false);
            navigate("/");
        } else if ((user.userName || user.password) && !user.isAuthenticated) {
            setShowError(true);
        }
    }, [ user.isAuthenticated, user.userName , user.password , navigate]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Login Page
                </Typography>
                {showError && !user.isAuthenticated && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Invalid username or password.
                    </Alert>
                )}
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                >
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={form.userName}
                        onChange={e => setForm({ ...form, userName: e.target.value })}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                        fullWidth
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
