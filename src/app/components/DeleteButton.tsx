"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

interface DeleteButtonProps {
	task_id: number;
}
const DeleteButton: NextPage<DeleteButtonProps> = (
	props
): JSX.Element => {
	const { task_id } = props;
	const { push } = useRouter();
	const handleDelete = async (e: any) => {
		e.preventDefault();
		const res = await fetch(
			`/api/tasks/${task_id}`,
			{
				method: "DELETE",
			}
		);
		if (!res.ok) {
			toast("Error deleting task!", { theme: "failure" });
			return;
		}
		toast("Task deleted!", { theme: "success" });
		push("/");
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
