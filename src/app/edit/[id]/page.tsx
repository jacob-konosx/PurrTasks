"use client";

import Form, { TaskData } from "@/app/components/Form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/success.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTask } from "@/app/task/[id]/page";

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
	params: { id },
}: {
	params: { id: string };
}): JSX.Element {
	const { push } = useRouter();
	const { isLoading, data } = useQuery({
		queryKey: ["task", id],
		queryFn: () => fetchTask(id),
		retry: false,
	});

	if (isLoading)
		return (
			<span className="loading loading-ring  loading-lg absolute top-1/2 left-1/2" />
		);

	if (!data) return <p className="text-lg text-center mt-32">Task not found!</p>;

	const [taskData, setTaskData] = useState<TaskData>({
		...data,
		tags: data.tags.split(","),
		endDate: new Date(data.endDate),
	});

	const { mutate } = useMutation({
		mutationFn: editTask,
		onSuccess: () => {
			toast("Task Edited!", { theme: "success" });
			push(`/task/${id}`);
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
