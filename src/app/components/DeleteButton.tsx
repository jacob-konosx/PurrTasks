"use client";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

interface DeleteButtonProps {
	task_id: number;
}
const deleteTask = async (task_id: number): Promise<any> => {
	const res = await fetch(`/api/tasks/${task_id}`, {
		method: "DELETE",
	});
	if (!res.ok) {
		throw new Error("Failed to delete task");
	}
	return res.json();
};
const DeleteButton: NextPage<DeleteButtonProps> = (props): JSX.Element => {
	const { task_id } = props;
	const { push } = useRouter();

	const { mutate } = useMutation({
		mutationFn: deleteTask,
		onSuccess: () => {
			toast("Task deleted!", { theme: "success" });
			push("/");
		},
		onError: () => {
			toast("Error deleting task!", { theme: "failure" });
		},
	});

	const handleDelete = async (e: any) => {
		e.preventDefault();
		mutate(task_id);
	};
	return (
		<button
			className="btn btn-error btn-sm sm:btn-md"
			onClick={(e) => handleDelete(e)}
		>
			DELETE
		</button>
	);
};

export default DeleteButton;
