import React from 'react';
import { Box, Typography } from '@mui/material';
import Tasks from '../../components/tasks';

const TaskPage: React.FC = () => {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Task Management
            </Typography>
            <Tasks />
        </Box>
    );
};

export default TaskPage;