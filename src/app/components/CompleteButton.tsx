"use client";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

interface CompleteButtonProps {
	task_id: number;
}

const completeTask = async (task_id: number): Promise<any> => {
	const res = await fetch(`/api/tasks/${task_id}`, {
		method: "PUT",
		body: JSON.stringify({ finished_at: new Date() }),
	});
	if (!res.ok) {
		throw new Error("Failed to complete task");
	}
	return res.json();
};

const CompleteButton: NextPage<CompleteButtonProps> = (props): JSX.Element => {
	const { task_id } = props;
	const { push } = useRouter();

	const { mutate } = useMutation({
		mutationFn: completeTask,
		onSuccess: () => {
			toast("Task completed!", { theme: "success" });
			push("/");
		},
		onError: () => {
			toast(`Error completing task!`, { theme: "failure" });
		},
	});

	const handleComplete = async (e: any) => {
		e.preventDefault();
		mutate(task_id);
	};
	return (
		<button
			className="btn btn-success btn-sm sm:btn-md"
			onClick={(e) => handleComplete(e)}
		>
			COMPLETE
		</button>
	);
};

export default CompleteButton;
