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
interface TaskPageParams {
	params: { id: string };
}

const page: NextPage<TaskPageParams> = ({
	params,
}: TaskPageParams): JSX.Element => {
	const { push } = useRouter();
	const [isLoading, setLoading] = useState(true);
	const [taskData, setTaskData] = useState<TaskData>({
		user_id: 0,
		text: "",
		tags: [],
		title: "",
		end_date: new Date(),
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
		const res = await fetch(`/api/tasks/${params.id}`, {
			method: "PATCH",
			body: JSON.stringify(taskData),
		});
		if (!res.ok) {
			toast("Error updating task!", { theme: "failure" });
			return;
		}
		toast("Task Edited!", { theme: "success" });
		push("/");
	};
	return (
		<form
			className="grid place-items-center mt-24 mx-4 pb-16"
			onSubmit={handleUpdate}
		>
			<h1 className="mb-2">EDITING</h1>
			<Form taskData={taskData} setTaskData={setTaskData} />
			<button className="btn btn-outline mt-8">EDIT TASK</button>
		</form>
	);
};
export default page;
