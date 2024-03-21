"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

const completeTask = async (taskId: number) => {
	const res = await fetch(`/api/tasks/complete/${taskId}`, {
		method: "PATCH",
		body: JSON.stringify({ finishedAt: new Date() }),
	});
	if (!res.ok) {
		throw new Error("Failed to complete task");
	}
};

export default function CompleteButton({
	taskId,
}: {
	taskId: number;
}): JSX.Element {
	const { push } = useRouter();

	const { mutate } = useMutation({
		mutationFn: completeTask,
		onSuccess: () => {
			toast("Task completed!", { theme: "success" });
			push("/");
		},
		onError: (error: Error) => {
			toast(`${error}`, { theme: "failure" });
		},
	});

	const handleComplete = async (e: any) => {
		e.preventDefault();
		mutate(taskId);
	};

	return (
		<button
			className="btn btn-success btn-sm sm:btn-md"
			onClick={handleComplete}
		>
			COMPLETE
		</button>
	);
}
