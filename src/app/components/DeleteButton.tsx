"use client";

import { deleteTask } from "@/lib/apicalls";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

export default function DeleteButton({
	taskId,
}: {
	taskId: number;
}): JSX.Element {
	const { push } = useRouter();
	const { mutate, isPending } = useMutation({
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
			disabled={isPending}
			className="btn btn-error btn-sm sm:btn-md"
			onClick={handleDelete}
		>
			DELETE
		</button>
	);
}
