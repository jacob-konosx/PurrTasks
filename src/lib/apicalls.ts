import { Task } from "@/app/api/schema";
import { TaskData } from "@/app/components/Form";
import { StringKeyObject } from "@/lib/validationSchema";

// Task functions
export const fetchTasks = async (): Promise<Task[]> => {
	const res = await fetch(`/api/tasks`);

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message);
	}
	const data = await res.json();
	return data.userTasks;
};

export const fetchTask = async (id: String): Promise<Task> => {
	const res = await fetch(`/api/tasks/${id}`);

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message);
	}

	const data = await res.json();
	return data.userTask;
};

export const createTask = async (taskData: TaskData) => {
	const res = await fetch(`/api/tasks/`, {
		method: "POST",
		body: JSON.stringify(taskData),
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message);
	}
	const data = await res.json();
	return data.taskId;
};

export const editTask = async (taskData: TaskData) => {
	const res = await fetch(`/api/tasks/edit/${taskData.id}`, {
		method: "PUT",
		body: JSON.stringify({
			...taskData,
			tags: taskData.tags.toString(),
		}),
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message);
	}
};

export const deleteTask = async (taskId: number) => {
	const res = await fetch(`/api/tasks/${taskId}`, {
		method: "DELETE",
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message);
	}
};

export const completeTask = async (taskId: number) => {
	const res = await fetch(`/api/tasks/complete/${taskId}`, {
		method: "PATCH",
		body: JSON.stringify({ finishedAt: new Date() }),
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message);
	}
};

// User functions
export const verifyUser = async (token: String) => {
	const res = await fetch(`/api/users/verify`, {
		method: "POST",
		body: JSON.stringify({ token }),
	});

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message);
	}
};

export const createUser = async (userData: StringKeyObject) => {
	const res = await fetch(`/api/auth/signup`, {
		method: "POST",
		body: JSON.stringify(userData),
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message);
	}
};
