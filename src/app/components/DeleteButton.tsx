"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

const deleteTask = async (taskId: number) => {
	const res = await fetch(`/api/tasks/${taskId}`, {
		method: "DELETE",
	});
	if (!res.ok) {
		throw new Error("Failed to delete task");
	}
};

export default function DeleteButton({
	taskId,
}: {
	taskId: number;
}): JSX.Element {
	const { push } = useRouter();

	const { mutate } = useMutation({
		mutationFn: deleteTask,
		onSuccess: () => {
			toast("Task deleted!", { theme: "success" });
			push("/");
		},
		onError: (error: Error) => {
			toast(`${error}`, { theme: "failure" });
		},
	});

	const handleDelete = async (e: any) => {
		e.preventDefault();
		mutate(taskId);
	};

	return (
		<button
			className="btn btn-error btn-sm sm:btn-md"
			onClick={handleDelete}
		>
			DELETE
		</button>
	);
}
