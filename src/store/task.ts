import { createEvent, createStore, sample } from "effector";
import { Task } from "../models/model";

export const addTask = createEvent<Task>();
export const updateTask = createEvent<Task>();
export const deleteTask = createEvent<string>();
export const searchTask = createEvent<string>();

// Store for all tasks (the source of truth)
export const $allTasks = createStore<Task[]>([])
    .on(addTask, (state, task) => [...state, task])
    .on(updateTask, (state, updatedTask) => {
        const index = state.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            const newState = [...state];
            newState[index] = updatedTask;
            return newState;
        }
        return state;
    })
    .on(deleteTask, (state, taskId) => state.filter(task => task.id !== taskId));

// Store for filtered tasks (what you show in the table)
export const $tasks = createStore<Task[]>([])
    .on($allTasks, (_, tasks) => tasks);

// Update $tasks on search
sample({
    source: $allTasks,
    clock: searchTask,
    fn: (tasks, searchTerm) => {
        if (!searchTerm) return tasks;
        return tasks.filter(task => task.name?.includes(searchTerm));
    },
    target: $tasks,
});
