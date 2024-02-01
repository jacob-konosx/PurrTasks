"use client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEventHandler, useEffect, useState } from "react";
import Form, { TaskData, addMins } from "../components/Form";
import toast from "react-simple-toasts";
import "react-datepicker/dist/react-datepicker.css";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/success.css";
import { useMutation } from "@tanstack/react-query";

const createTask = async (taskData: TaskData) => {
	const res = await fetch(`/api/tasks/`, {
		method: "POST",
		body: JSON.stringify(taskData),
	});
	if (!res.ok) {
		throw new Error("Failed to create task");
	}
	return res.json();
};
const page: NextPage = (): JSX.Element => {
	const { data: session } = useSession();
	const { push } = useRouter();
	const [taskData, setTaskData] = useState<TaskData>({
		user_id: 0,
		text: "",
		tags: [],
		title: "",
		end_date: addMins(new Date(), 5),
	});

	const { mutate } = useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			toast("Task Created!", { theme: "success" });
			push("/");
		},
		onError: () => {
			toast("Error creating task!", { theme: "failure" });
		},
	});

	useEffect(() => {
		if (session) {
			setTaskData({ ...taskData, user_id: session.user.id });
		}
	}, [session]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
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
		mutate(taskData);
	};

	return (
		<Form
			taskData={taskData}
			setTaskData={setTaskData}
			handleSubmit={handleSubmit}
			buttonText="CREATE TASK"
		/>
	);
};

export default page;
