export interface User {
    id: string | null;
    userName: string | null;
    password: string | null;
    email: string | null;
    isAuthenticated?: boolean; // Optional property to indicate if the user is authenticated
}

export interface Task {
    id: string| "";
    name: string | null;
    description: string| null;
    deadline: Date| null;
}