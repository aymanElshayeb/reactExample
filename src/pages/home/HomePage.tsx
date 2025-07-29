import React, { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { $user } from "../../store/user"; // Adjust the import path as needed
import {
    Typography,
    Button,
    Paper,
    Container,
} from "@mui/material";

const HomePage: React.FC = () => {
    const user = useUnit($user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.userName) {
            navigate("/login");
        }
    }, [navigate, user]);

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: "center" }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to Ambition Task Management
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Empower your productivity with a smarter way to organize, track, and accomplish your goals.
                </Typography>
                <Typography variant="body1" sx={{ mt: 3, mb: 2 }}>
                    In today's fast-paced world, managing tasks efficiently is crucial for both personal and professional success. A task management system helps you:
                </Typography>
                <ul style={{ textAlign: "left", maxWidth: 600, margin: "0 auto 24px auto" }}>
                    <li>
                        <Typography variant="body1">
                            <strong>Stay organized:</strong> Keep all your tasks in one place and never miss a deadline.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            <strong>Prioritize effectively:</strong> Focus on what matters most and allocate your time wisely.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            <strong>Track progress:</strong> Monitor your accomplishments and identify areas for improvement.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            <strong>Collaborate seamlessly:</strong> Work with your team, assign tasks, and share updates in real time.
                        </Typography>
                    </li>
                </ul>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    How to use Ambition Task Management:
                </Typography>
                <ol style={{ textAlign: "left", maxWidth: 600, margin: "0 auto 24px auto" }}>
                    <li>
                        <Typography variant="body1">
                            <strong>Add Tasks:</strong> Click on <b>"View Tasks"</b> to access your task list and add new tasks with details and deadlines.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            <strong>Organize:</strong> Categorize tasks, set priorities, and group them for better clarity.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            <strong>Track & Update:</strong> Mark tasks as complete, edit details, or delete them as your work progresses.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1">
                            <strong>Collaborate:</strong> Assign tasks to team members and monitor their progress.
                        </Typography>
                    </li>
                </ol>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={RouterLink}
                    to="/tasks"
                    sx={{ mt: 3 }}
                >
                    View Tasks
                </Button>
            </Paper>
        </Container>
    );
};

export default HomePage;