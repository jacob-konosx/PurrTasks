"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Form, { TaskData } from "@/app/components/Form";
import toast from "react-simple-toasts";
import { useMutation } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/success.css";
import { createTask } from "@/lib/apicalls";

const addMins = (date: Date, minutes: number) => {
	date.setMinutes(date.getMinutes() + minutes);
	return date;
};

export default function Create(): JSX.Element {
	const { data: session } = useSession();
	const { push } = useRouter();
	const [taskData, setTaskData] = useState<TaskData>({
		userId: session?.user.id ?? 0,
		text: "",
		tags: [],
		title: "",
		endDate: addMins(new Date(), 5),
	});

	const { mutate, isPending } = useMutation({
		mutationFn: createTask,
		onSuccess: (taskId: number) => {
			toast("Task Created!", { theme: "success" });
			push(`/task/${taskId}`);
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
			buttonText="CREATE TASK"
			isPending={isPending}
		/>
	);
}
