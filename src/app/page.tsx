"use client";
import { NextPage } from "next";
import TaskCard from "./components/TaskCard";
import { Task } from "./api/schema";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskSettings from "./components/TaskSettings";

const Home: NextPage = (): JSX.Element => {
	const { push } = useRouter();
	const [userTasks, setUserTasks] = useState<Task[]>([]);
	const [userCompletedTasks, setUserCompletedTasks] = useState<Task[]>([]);
	const [isLoading, setLoading] = useState(true);
	const [showCompleted, setShowCompleted] = useState<boolean | null>();

	useEffect(() => {
		const getUserTasks = async () => {
			const res = await fetch(`/api/tasks`, {
				method: "GET",
			});
			const user_tasks = await res.json();
			localStorage.setItem("userTasks", JSON.stringify(user_tasks));
			setUserTasks(user_tasks.filter((task: Task) => !task.finished_at));
			setUserCompletedTasks(
				user_tasks.filter((task: Task) => task.finished_at).reverse()
			);
			setLoading(false);
		};
		getUserTasks();
		setShowCompleted(
			!localStorage.getItem("showCompleted") ||
				localStorage.getItem("showCompleted") === "false"
				? false
				: true
		);
	}, []);

	if (isLoading)
		return (
			<span className="loading loading-ring  loading-lg absolute top-1/2 left-1/2" />
		);
	if (userTasks.length === 0 && userCompletedTasks.length === 0)
		return (
			<p className="text-center mt-10">
				No tasks found. To create a task go to the{" "}
				<span
					className="cursor-pointer text-white "
					onClick={(e) => {
						e.preventDefault();
						push("/create");
					}}
				>
					CREATE
				</span>{" "}
				page.
			</p>
		);

	window.addEventListener("storage", () => {
		setShowCompleted(localStorage.getItem("showCompleted") === "true");
	});
	return (
		<div className="mt-24 !mb-12">
			{userCompletedTasks.length > 0 && (
				<div className="justify-center flex">
					<TaskSettings />
				</div>
			)}
			<div className=" sm:grid p-5 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] sm:justify-items-center">
				{userTasks.map((task: Task) => (
					<TaskCard task={task} key={task.id} />
				))}
				{showCompleted &&
					userCompletedTasks.map((task: Task) => (
						<TaskCard task={task} key={task.id} />
					))}
			</div>
		</div>
	);
};
export default Home;
