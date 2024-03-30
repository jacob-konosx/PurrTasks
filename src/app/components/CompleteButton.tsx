"use client";

import { completeTask } from "@/lib/apicalls";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

export default function CompleteButton({
	taskId,
}: {
	taskId: number;
}): JSX.Element {
	const { push } = useRouter();

	const { mutate, isPending } = useMutation({
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
			disabled={isPending}
			className="btn btn-success btn-sm sm:btn-md"
			onClick={handleComplete}
		>
			COMPLETE
		</button>
	);
}
