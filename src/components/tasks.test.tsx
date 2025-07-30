import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fork } from 'effector';
import { Provider } from 'effector-react';
import Tasks from './tasks';
import { addTask, updateTask, deleteTask, $allTasks } from '../store/task';
import { Task } from '../models/model';

// Mock the store for isolated testing
const mockTasks: Task[] = [
    {
        id: '1',
        name: 'Test Task 1',
        description: 'Description for test task 1',
        deadline: new Date('2025-08-01')
    },
    {
        id: '2',
        name: 'Test Task 2',
        description: 'Description for test task 2',
        deadline: new Date('2025-08-15')
    },
    {
        id: '3',
        name: 'Another Task',
        description: 'Another description',
        deadline: null
    }
];

// Helper function to render component with effector scope
const renderWithScope = (initialTasks: Task[] = []) => {
    const scope = fork({
        values: [
            [$allTasks, initialTasks]
        ]
    });

    return {
        scope,
        ...render(
            <Provider value={scope}>
                <Tasks />
            </Provider>
        )
    };
};

describe('Tasks Component', () => {
    describe('Rendering', () => {
        test('renders tasks table with correct headers', () => {
            renderWithScope(mockTasks);
            
            expect(screen.getByText('Task id')).toBeInTheDocument();
            expect(screen.getByText('Task Name')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('Deadline')).toBeInTheDocument();
            expect(screen.getByText('Actions')).toBeInTheDocument();
        });

        test('renders search input with placeholder', () => {
            renderWithScope();
            
            const searchInput = screen.getByPlaceholderText('Search tasks');
            expect(searchInput).toBeInTheDocument();
        });

        test('renders Add Task button', () => {
            renderWithScope();
            
            const addButton = screen.getByRole('button', { name: /add task/i });
            expect(addButton).toBeInTheDocument();
        });

        test('displays tasks in the table', () => {
            renderWithScope(mockTasks);
            
            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
            expect(screen.getByText('Test Task 2')).toBeInTheDocument();
            expect(screen.getByText('Another Task')).toBeInTheDocument();
        });

        test('displays "No tasks found" when no tasks exist', () => {
            renderWithScope([]);
            
            expect(screen.getByText('No tasks found.')).toBeInTheDocument();
        });

        test('displays deadline correctly formatted', () => {
            renderWithScope(mockTasks);
            
            // Check for formatted dates
            expect(screen.getByText('8/1/2025')).toBeInTheDocument();
            expect(screen.getByText('8/15/2025')).toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        test('filters tasks based on task name', async () => {
            renderWithScope(mockTasks);
            
            const searchInput = screen.getByPlaceholderText('Search tasks');
            await userEvent.type(searchInput, 'Test Task 1');
            
            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
            expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
            expect(screen.queryByText('Another Task')).not.toBeInTheDocument();
        });

        test('filters tasks based on description', async () => {
            renderWithScope(mockTasks);
            
            const searchInput = screen.getByPlaceholderText('Search tasks');
            await userEvent.type(searchInput, 'Another description');
            
            expect(screen.getByText('Another Task')).toBeInTheDocument();
            expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
        });

        test('search is case insensitive', async () => {
            renderWithScope(mockTasks);
            
            const searchInput = screen.getByPlaceholderText('Search tasks');
            await userEvent.type(searchInput, 'test task');
            
            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
            expect(screen.getByText('Test Task 2')).toBeInTheDocument();
        });

        test('shows no results when search doesn\'t match', async () => {
            renderWithScope(mockTasks);
            
            const searchInput = screen.getByPlaceholderText('Search tasks');
            await userEvent.type(searchInput, 'nonexistent task');
            
            expect(screen.getByText('No tasks found.')).toBeInTheDocument();
        });
    });

    describe('Task Selection', () => {
        test('selects individual task', async () => {
            renderWithScope(mockTasks);
            
            const checkboxes = screen.getAllByRole('checkbox');
            const firstTaskCheckbox = checkboxes[1]; // Skip header checkbox
            
            await userEvent.click(firstTaskCheckbox);
            expect(firstTaskCheckbox).toBeChecked();
            
            // Delete Selected button should appear
            expect(screen.getByText('Delete Selected')).toBeInTheDocument();
        });

        test('selects all tasks with header checkbox', async () => {
            renderWithScope(mockTasks);
            
            const headerCheckbox = screen.getAllByRole('checkbox')[0];
            await userEvent.click(headerCheckbox);
            
            const allCheckboxes = screen.getAllByRole('checkbox');
            allCheckboxes.forEach(checkbox => {
                expect(checkbox).toBeChecked();
            });
        });

        test('deselects all when header checkbox is unchecked', async () => {
            renderWithScope(mockTasks);
            
            const headerCheckbox = screen.getAllByRole('checkbox')[0];
            
            // Select all first
            await userEvent.click(headerCheckbox);
            // Then deselect
            await userEvent.click(headerCheckbox);
            
            const allCheckboxes = screen.getAllByRole('checkbox');
            allCheckboxes.forEach(checkbox => {
                expect(checkbox).not.toBeChecked();
            });
        });
    });

    describe('Add Task Dialog', () => {
        test('opens add task dialog when Add Task button is clicked', async () => {
            renderWithScope();
            
            const addButton = screen.getByRole('button', { name: /add task/i });
            await userEvent.click(addButton);
            
            expect(screen.getByText('Add Task')).toBeInTheDocument();
            expect(screen.getByLabelText('Task Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Description')).toBeInTheDocument();
            expect(screen.getByLabelText('Deadline')).toBeInTheDocument();
        });

        test('closes dialog when Cancel button is clicked', async () => {
            renderWithScope();
            
            const addButton = screen.getByRole('button', { name: /add task/i });
            await userEvent.click(addButton);
            
            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            await userEvent.click(cancelButton);
            
            expect(screen.queryByText('Add Task')).not.toBeInTheDocument();
        });

        test('Add button is disabled when required fields are empty', async () => {
            renderWithScope();
            
            const addButton = screen.getByRole('button', { name: /add task/i });
            await userEvent.click(addButton);
            
            const saveButton = screen.getByRole('button', { name: /^add$/i });
            expect(saveButton).toBeDisabled();
        });

        test('Add button is enabled when required fields are filled', async () => {
            renderWithScope();
            
            const addButton = screen.getByRole('button', { name: /add task/i });
            await userEvent.click(addButton);
            
            const nameInput = screen.getByLabelText('Task Name');
            const descriptionInput = screen.getByLabelText('Description');
            
            await userEvent.type(nameInput, 'New Task');
            await userEvent.type(descriptionInput, 'New Description');
            
            const saveButton = screen.getByRole('button', { name: /^add$/i });
            expect(saveButton).toBeEnabled();
        });
    });

    describe('Edit Task Dialog', () => {
        test('opens edit dialog with task data when edit button is clicked', async () => {
            renderWithScope(mockTasks);
            
            const editButtons = screen.getAllByLabelText(/edit/i);
            await userEvent.click(editButtons[0]);
            
            expect(screen.getByText('Edit Task')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Test Task 1')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Description for test task 1')).toBeInTheDocument();
        });

        test('Update button is enabled when editing with valid data', async () => {
            renderWithScope(mockTasks);
            
            const editButtons = screen.getAllByLabelText(/edit/i);
            await userEvent.click(editButtons[0]);
            
            const updateButton = screen.getByRole('button', { name: /update/i });
            expect(updateButton).toBeEnabled();
        });
    });

    describe('Delete Functionality', () => {
        test('deletes task when individual delete button is clicked', async () => {
            const { scope } = renderWithScope(mockTasks);
            
            const deleteButtons = screen.getAllByLabelText(/delete/i);
            await userEvent.click(deleteButtons[0]);
            
            // Check that delete was called by verifying the task is removed from the store
            await waitFor(() => {
                const tasks = scope.getState($allTasks);
                expect(tasks).toHaveLength(2);
                expect(tasks.find(task => task.id === '1')).toBeUndefined();
            });
        });

        test('shows Delete Selected button when tasks are selected', async () => {
            renderWithScope(mockTasks);
            
            const checkboxes = screen.getAllByRole('checkbox');
            await userEvent.click(checkboxes[1]); // Select first task
            
            expect(screen.getByText('Delete Selected')).toBeInTheDocument();
        });

        test('deletes selected tasks when Delete Selected is clicked', async () => {
            const { scope } = renderWithScope(mockTasks);
            
            const checkboxes = screen.getAllByRole('checkbox');
            await userEvent.click(checkboxes[1]); // Select first task
            await userEvent.click(checkboxes[2]); // Select second task
            
            const deleteSelectedButton = screen.getByText('Delete Selected');
            await userEvent.click(deleteSelectedButton);
            
            await waitFor(() => {
                const tasks = scope.getState($allTasks);
                expect(tasks).toHaveLength(1);
                expect(tasks[0].name).toBe('Another Task');
            });
        });
    });

    describe('Pagination', () => {
        const manyTasks: Task[] = Array.from({ length: 12 }, (_, i) => ({
            id: `${i + 1}`,
            name: `Task ${i + 1}`,
            description: `Description ${i + 1}`,
            deadline: new Date(`2025-08-${String(i + 1).padStart(2, '0')}`)
        }));

        test('shows correct number of rows per page', () => {
            renderWithScope(manyTasks);
            
            // Should show 5 rows by default (first page)
            const tableRows = screen.getAllByRole('row');
            // 1 header row + 5 data rows
            expect(tableRows).toHaveLength(6);
        });

        test('pagination controls work correctly', async () => {
            renderWithScope(manyTasks);
            
            // Go to next page
            const nextPageButton = screen.getByRole('button', { name: /go to next page/i });
            await userEvent.click(nextPageButton);
            
            // Should show next 5 tasks
            expect(screen.getByText('Task 6')).toBeInTheDocument();
            expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
        });

        test('rows per page dropdown changes page size', async () => {
            renderWithScope(manyTasks);
            
            const rowsPerPageSelect = screen.getByRole('combobox');
            fireEvent.mouseDown(rowsPerPageSelect);
            
            const option10 = screen.getByRole('option', { name: '10' });
            await userEvent.click(option10);
            
            // Should now show 10 rows
            const tableRows = screen.getAllByRole('row');
            expect(tableRows).toHaveLength(11); // 1 header + 10 data rows
        });
    });

    describe('Form Validation', () => {
        test('validates required fields in add form', async () => {
            renderWithScope();
            
            const addButton = screen.getByRole('button', { name: /add task/i });
            await userEvent.click(addButton);
            
            const nameInput = screen.getByLabelText('Task Name');
            const descriptionInput = screen.getByLabelText('Description');
            const saveButton = screen.getByRole('button', { name: /^add$/i });
            
            // Empty fields should disable save button
            expect(saveButton).toBeDisabled();
            
            // Fill only name
            await userEvent.type(nameInput, 'Test Task');
            expect(saveButton).toBeDisabled();
            
            // Fill description too
            await userEvent.type(descriptionInput, 'Test Description');
            expect(saveButton).toBeEnabled();
        });

        test('validates whitespace-only input', async () => {
            renderWithScope();
            
            const addButton = screen.getByRole('button', { name: /add task/i });
            await userEvent.click(addButton);
            
            const nameInput = screen.getByLabelText('Task Name');
            const descriptionInput = screen.getByLabelText('Description');
            const saveButton = screen.getByRole('button', { name: /^add$/i });
            
            // Fill with whitespace only
            await userEvent.type(nameInput, '   ');
            await userEvent.type(descriptionInput, '   ');
            
            expect(saveButton).toBeDisabled();
        });
    });

    describe('Date Handling', () => {
        test('handles date input correctly', async () => {
            renderWithScope();
            
            const addButton = screen.getByRole('button', { name: /add task/i });
            await userEvent.click(addButton);
            
            const deadlineInput = screen.getByLabelText('Deadline');
            fireEvent.change(deadlineInput, { target: { value: '2025-12-25' } });
            
            expect(deadlineInput).toHaveValue('2025-12-25');
        });

        test('displays empty deadline as empty string', () => {
            renderWithScope(mockTasks);
            
            // Third task has null deadline
            const rows = screen.getAllByRole('row');
            const thirdTaskRow = rows[3]; // Header + 2 previous tasks
            
            // Check that deadline cell is empty
            const cells = thirdTaskRow.querySelectorAll('td');
            const deadlineCell = cells[4]; // Deadline is the 5th column (0-indexed)
            expect(deadlineCell).toHaveTextContent('');
        });
    });

    describe('Error Handling', () => {
        test('handles tasks with missing data gracefully', () => {
            const incompleteTask: Task = {
                id: '1',
                name: null,
                description: null,
                deadline: null
            };
            
            renderWithScope([incompleteTask]);
            
            // Should render without crashing
            expect(screen.getByText('Task id')).toBeInTheDocument();
        });
    });

    describe('Component Integration', () => {
        test('creates new task successfully', async () => {
            const { scope } = renderWithScope();
            
            // Open add dialog
            const addButton = screen.getByRole('button', { name: /add task/i });
            await userEvent.click(addButton);
            
            // Fill form
            const nameInput = screen.getByLabelText('Task Name');
            const descriptionInput = screen.getByLabelText('Description');
            const deadlineInput = screen.getByLabelText('Deadline');
            
            await userEvent.type(nameInput, 'New Test Task');
            await userEvent.type(descriptionInput, 'New test description');
            fireEvent.change(deadlineInput, { target: { value: '2025-09-01' } });
            
            // Save task
            const saveButton = screen.getByRole('button', { name: /^add$/i });
            await userEvent.click(saveButton);
            
            // Verify task was added to store
            await waitFor(() => {
                const tasks = scope.getState($allTasks);
                expect(tasks).toHaveLength(1);
                expect(tasks[0].name).toBe('New Test Task');
                expect(tasks[0].description).toBe('New test description');
            });
        });

        test('updates existing task successfully', async () => {
            const { scope } = renderWithScope(mockTasks);
            
            // Click edit on first task
            const editButtons = screen.getAllByLabelText(/edit/i);
            await userEvent.click(editButtons[0]);
            
            // Update name
            const nameInput = screen.getByDisplayValue('Test Task 1');
            await userEvent.clear(nameInput);
            await userEvent.type(nameInput, 'Updated Task Name');
            
            // Save changes
            const updateButton = screen.getByRole('button', { name: /update/i });
            await userEvent.click(updateButton);
            
            // Verify task was updated in store
            await waitFor(() => {
                const tasks = scope.getState($allTasks);
                const updatedTask = tasks.find(task => task.id === '1');
                expect(updatedTask?.name).toBe('Updated Task Name');
            });
        });
    });
});
