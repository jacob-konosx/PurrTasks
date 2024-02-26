"use client";
import { Task } from "@/app/api/schema";
import Form, { TaskData } from "@/app/components/Form";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/success.css";
import { useMutation } from "@tanstack/react-query";

// REVIEW: add more newlines after imports and definitions for clearer readability
interface TaskPageParams {
	params: { id: string };
}

const editTask = async ({
	task_id, // REVIEW: reminder about not using snake case for variable names if you use camelCase everywhere else
	task_data,
}: {
	task_id: string;
	task_data: TaskData;
}): Promise<any> => {
	const res = await fetch(`/api/tasks/${task_id}`, {
		method: "PATCH",
		body: JSON.stringify({
			...task_data,
			tags: task_data.tags.toString(),
		}),
	});
	if (!res.ok) {
		throw new Error("Failed to edit task");
	}
	return res.json();
};

const page: NextPage<TaskPageParams> = ({
	params,
}: TaskPageParams): JSX.Element => {
	const { push } = useRouter();
	const [isLoading, setLoading] = useState(true);
	// REVIEW: this default TaskData worries me - I would recommend just setting it to undefined if ther edefault is not present yet
	const [taskData, setTaskData] = useState<TaskData>({
		user_id: 0,
		text: "",
		tags: [],
		title: "",
		end_date: new Date(),
	});
	const { mutate } = useMutation({
		mutationFn: editTask,
		onSuccess: () => {
			toast("Task Edited!", { theme: "success" });
			push("/");
		},
		onError: () => {
			toast("Error editing task!", { theme: "failure" });
		},
	});
	useEffect(() => {
		const userTasks: Task[] = JSON.parse(
			localStorage.getItem("userTasks") || "[]"
		);
		const task: Task | undefined = userTasks.find(
			(task: Task) => task.id === parseInt(params.id)
		);
		if (task) {
			setTaskData({
				user_id: task.user_id,
				text: task.text,
				tags: task.tags.split(","),
				title: task.title,
				end_date: new Date(task.end_date),
				img_url: task.img_url,
			});
			setLoading(false);
		}
	}, []);

	if (isLoading)
		return (
			<span className="loading loading-ring  loading-lg absolute top-1/2 left-1/2" />
		);

	// REVIEW: I may be missing it, but I do not see anywhere this can be set to be undefined?
	if (!taskData) return <p className="text-center mt-24">Task not found!</p>;

	const handleUpdate = async (e: any) => {
		e.preventDefault();
		if (taskData.title === "") {
			toast("Title cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.text === "") {
			toast("Description cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.tags.length === 0) {
			toast("Tags cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.tags.length > 5) {
			toast("Tags cannot be more than 5!", { theme: "warning" });
			return;
		}
		mutate({ task_id: params.id, task_data: taskData });
	};
	return (
		<Form
			taskData={taskData}
			setTaskData={setTaskData}
			handleSubmit={handleUpdate}
			buttonText="EDIT TASK"
		/>
	);
};
export default page;
