"use client";

import { Task } from "@/app/api/schema";
import Form, { TaskData } from "@/app/components/Form";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/success.css";
import { useMutation } from "@tanstack/react-query";

const editTask = async (taskData: TaskData) => {
	const res = await fetch(`/api/tasks/edit/${taskData.id}`, {
		method: "PUT",
		body: JSON.stringify({
			...taskData,
			tags: taskData.tags.toString(),
		}),
	});
	if (!res.ok) {
		throw new Error("Failed to edit task");
	}
};

export default function Edit({
	params,
}: {
	params: { id: string };
}): JSX.Element {
	const { push } = useRouter();

	const userTasks: Task[] = JSON.parse(
		localStorage.getItem("userTasks") || "[]"
	);
	const task: Task | undefined = useMemo(
		() => userTasks.find((task: Task) => task.id === parseInt(params.id)),
		[params]
	);

	if (!task) return <p className="text-center mt-24">Task not found!</p>;

	const [taskData, setTaskData] = useState<TaskData>({
		...task,
		tags: task.tags.split(","),
		endDate: new Date(task.endDate),
	});

	const { mutate } = useMutation({
		mutationFn: editTask,
		onSuccess: () => {
			toast("Task Edited!", { theme: "success" });
			push("/");
		},
		onError: (error: Error) => {
			toast(`${error}`, { theme: "failure" });
		},
	});

	return (
		<Form
			taskData={taskData}
			setTaskData={setTaskData}
			mutate={mutate}
			buttonText="EDIT TASK"
		/>
	);
}
