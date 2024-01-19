"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

interface CompleteButtonProps {
	task_id: number;
}
const CompleteButton: NextPage<CompleteButtonProps> = (
	props
): JSX.Element => {
	const { task_id } = props;
	const { push } = useRouter();
	const handleComplete = async (e: any) => {
		e.preventDefault();
		const res = await fetch(
			`/api/tasks/${task_id}`,
			{
				method: "PUT",
				body: JSON.stringify({ finished_at: new Date() }),
			}
		);
		if (!res.ok) {
			toast("Error completing task!", { theme: "failure" });
			return;
		}
		toast("Task completed!", { theme: "success" });
		push("/");
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
