import React, { useEffect, useState } from 'react';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import { addTask, updateTask, deleteTask, $allTasks } from '../store/task';
import { useUnit } from 'effector-react';
import { Task } from '../models/model';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Toolbar,
    Checkbox,
} from '@mui/material';

const Tasks: React.FC = () => {
    const tasks = useUnit($allTasks);
    const addTaskUnit = useUnit(addTask);
    const updateTaskUnit = useUnit(updateTask);
    const deleteTaskUnit = useUnit(deleteTask);

    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [form, setForm] = useState<{
        id: string;
        name: string | null;
        description: string | null;
        deadline: Date | null;
    }>({
        id: "",
        name: null,
        description: null,
        deadline: null,
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Filtered tasks
    const filteredTasks = tasks.filter(
        (task) =>
            task?.name?.toLowerCase().includes(search.toLowerCase()) ||
            task?.description?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const paginatedTasks = filteredTasks.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Handlers
    const handleOpenDialog = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setForm({
                id: task.id || "",
                name: task.name,
                description: task.description,
                deadline: task.deadline ? new Date(task.deadline) : null,
            });
        } else {
            setEditingTask(null);
            setForm({
                id: "",
                name: '',
                description: '',
                deadline: null,
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingTask(null);
        setForm({
            id: "",
            name: '',
            description: '',
            deadline: null,
        });
    };

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === 'deadline') {
            setForm({ ...form, deadline: value ? new Date(value) : null });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSave = () => {
        const payload = {
            ...form,
            deadline: form.deadline ? new Date(form.deadline) : null,
        };
        if (editingTask) {
            updateTaskUnit(payload);
        } else {
            addTaskUnit(payload);
        }
        handleCloseDialog();
    };

    const handleDelete = (ids: string[]) => {
        ids.forEach((id) => deleteTaskUnit(id));
        setSelected([]);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(paginatedTasks.map((task) => task.id || ""));
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        setSelected([]);
    }, [page, rowsPerPage, search]);

    return (
        <>
            <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search tasks"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1 }} />,
                    }}
                    sx={{ mr: 2, width: 300 }}
                />
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ mr: 2 }}
                >
                    Add Task
                </Button>
                {selected.length > 0 && (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(selected)}
                    >
                        Delete Selected
                    </Button>
                )}
            </Toolbar>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={
                                        selected.length > 0 &&
                                        selected.length < paginatedTasks.length
                                    }
                                    checked={
                                        paginatedTasks.length > 0 &&
                                        selected.length === paginatedTasks.length
                                    }
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                             <TableCell>Task id</TableCell>
                            <TableCell>Task Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedTasks.map((task) => (
                            <TableRow
                                key={task.id}
                                selected={selected.includes(task.id || "")}
                                hover
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.includes(task.id || "")}
                                        onChange={() => handleSelect(task.id || "")}
                                    />
                                </TableCell>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.name}</TableCell>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>
                                    {task.deadline
                                        ? new Date(task.deadline).toLocaleDateString()
                                        : ''}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(task)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete([task.id])}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedTasks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No tasks found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredTasks.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Task Name"
                        name="name"
                        value={form.name ?? ''}
                        onChange={handleFormChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={form.description ?? ''}
                        onChange={handleFormChange}
                        fullWidth
                        multiline
                        rows={3}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Deadline"
                        name="deadline"
                        type="date"
                        value={
                            form.deadline
                                ? new Date(form.deadline).toISOString().split('T')[0]
                                : ''
                        }
                        onChange={handleFormChange}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={
                            !form.name?.trim() ||
                            !form.description?.trim()
                        }
                    >
                        {editingTask ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Tasks;
