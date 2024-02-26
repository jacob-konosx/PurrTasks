"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
/** REVIEW:
 * you should avoid using relative imports, instead using absolute imports from the root, like from src 
 * Absolute imports would make this be like @/app/api/schema, you can check tutorials on how to enable this in NextJS/Typescript
*/
import { Task } from "./api/schema";
import TaskCard from "./components/TaskCard";
import TaskSettings from "./components/TaskSettings";
import { useQuery } from "@tanstack/react-query";

const fetchTasks = (): Promise<Task[]> =>
	fetch(`/api/tasks`).then((res) => {
		if (!res.ok) {
			throw new Error("Failed to fetch");
		}
		return res.json();
	})

/** REVIEW: I would recommend using the export default function Home() syntax as it is simpler and does not require another export at the bottom */
const Home: NextPage = (): JSX.Element => {
	const { push } = useRouter();
	const [uncompletedTasks, setUncompletedTasks] = useState<Task[]>([]);
	const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
	const [showCompleted, setShowCompleted] = useState<boolean | null>();

	const { isLoading, data, error } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks,
	});

	useEffect(() => {
		if (data) {
			localStorage.setItem("userTasks", JSON.stringify(data));

			setUncompletedTasks(data.filter((task: Task) => !task.finished_at));
			setCompletedTasks(
				data.filter((task: Task) => task.finished_at).reverse()
			);
			setShowCompleted(
				!localStorage.getItem("showCompleted") ||
					localStorage.getItem("showCompleted") === "false"
					? false
					: true
			);
		}
		if (error) {
			console.log(error);
		}
	}, [data]);

	if (isLoading)
		return (
			<span className="loading loading-ring  loading-lg absolute top-1/2 left-1/2" />
		);

	if (uncompletedTasks.length === 0 && completedTasks.length === 0)
		return (
			<div className="m-auto  mt-40">
				<p className="text-center mx-2">
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 256 256"
					width="200px"
					height="200px"
					className="m-auto"
				>
					<path
						d="M221.4,36.3a16.3,16.3,0,0,0-17,4L187.5,57.2a111.5,111.5,0,0,0-119,0L51.6,40.3a16.3,16.3,0,0,0-17-4A15.9,15.9,0,0,0,24,51.3V136c0,49.1,40.1,89.6,91.6,95.3a4,4,0,0,0,4.4-4v-32l-13.4-13.4a8.3,8.3,0,0,1-.4-11.4,8.1,8.1,0,0,1,11.5-.2L128,180.7l10.3-10.4a8.1,8.1,0,0,1,11.5.2,8.3,8.3,0,0,1-.4,11.4L136,195.3v32a4,4,0,0,0,4.4,4c51.5-5.7,91.6-46.2,91.6-95.3V51.3A15.9,15.9,0,0,0,221.4,36.3ZM84,152a12,12,0,1,1,12-12A12,12,0,0,1,84,152Zm20-64a8,8,0,0,1-16,0V69a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V64a8,8,0,0,1,16,0Zm16,0V69a8,8,0,0,1,16,0V88a8,8,0,0,1-16,0Zm20,64a12,12,0,1,1,12-12A12,12,0,0,1,172,152Z"
						fill="#fffa"
					></path>
				</svg>
			</div>
		);

	window.addEventListener("storage", () => {
		setShowCompleted(localStorage.getItem("showCompleted") === "true");
	});
	return (
		<div className="mt-24 !mb-12">
			{completedTasks.length > 0 && (
				<div className="justify-center flex">
					<TaskSettings />
				</div>
			)}
			<div className=" sm:grid p-5 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] sm:justify-items-center">
				{uncompletedTasks.map((task: Task) => (
					<TaskCard task={task} key={task.id} />
				))}
				{showCompleted &&
					completedTasks.map((task: Task) => (
						<TaskCard task={task} key={task.id} />
					))}
			</div>
		</div>
	);
};

export default Home;
