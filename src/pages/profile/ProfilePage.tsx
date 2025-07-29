import { useUnit } from "effector-react";
import { $user} from "../../store/user";
import {
    Container,
    Paper,
    Typography,
    Box
} from "@mui/material";

const ProfilePage = () => {
    const user = useUnit($user);

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Profile
                </Typography>
                {user ? (
                    <Box>
                        {"id" in user && (
                            <Box display="flex" mb={2}>
                                <Typography variant="subtitle1" sx={{ minWidth: 80 }}>
                                    ID:
                                </Typography>
                                <Typography variant="body1">{user.id}</Typography>
                            </Box>
                        )}
                        {"email" in user && (
                            <Box display="flex" mb={2}>
                                <Typography variant="subtitle1" sx={{ minWidth: 80 }}>
                                    Email:
                                </Typography>
                                <Typography variant="body1">{user.email}</Typography>
                            </Box>
                        )}

                        {"userName" in user && (
                            <Box display="flex" mb={2}>
                                <Typography variant="subtitle1" sx={{ minWidth: 80 }}>
                                    Username:
                                </Typography>
                                <Typography variant="body1">{user.userName}</Typography>
                            </Box>
                        )}
                        {"password" in user && (
                            <Box display="flex" mb={2}>
                                <Typography variant="subtitle1" sx={{ minWidth: 80 }}>
                                    Password:
                                </Typography>
                                <Typography variant="body1">******</Typography>
                            </Box>
                        )}

                    </Box>
                ) : (
                    <Typography color="text.secondary">
                        No user data available.
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default ProfilePage;