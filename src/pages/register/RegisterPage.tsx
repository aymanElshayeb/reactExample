import { useUnit } from "effector-react";
import { User } from "../../models/model";
import { useNavigate } from "react-router-dom";
import { $user, register } from "../../store/user";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper
} from "@mui/material";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [user, updateUser] = useUnit([$user, register]);

    const handleRegister = (user: User) => {
        updateUser(user);
        console.log("User registered:", user);
        navigate("/login");
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
                </Typography>
                <Box
                    component="form"
                    onSubmit={e => {
                        e.preventDefault();
                        handleRegister(user);
                    }}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                >
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={user.userName ?? ""}
                        onChange={e => updateUser({ ...user, userName: e.target.value })}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={user.password ?? ""}
                        onChange={e => updateUser({ ...user, password: e.target.value })}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={user.email ?? ""}
                        onChange={e => updateUser({ ...user, email: e.target.value })}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
