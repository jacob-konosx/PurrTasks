"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";

interface CompleteButtonProps {
	task_id: number;
}
const CompleteButton: NextPage<CompleteButtonProps> = (
	props: CompleteButtonProps
): JSX.Element => {
	const { task_id } = props as { task_id: number };
	const { push } = useRouter();
	const handleComplete = async (e: any) => {
		e.preventDefault();
		const res = await fetch(
			`${process.env.API_BASE_URL}/api/tasks/${task_id}`,
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
		<button className="btn btn-success" onClick={(e) => handleComplete(e)}>
			COMPLETE
		</button>
	);
};

export default CompleteButton;
