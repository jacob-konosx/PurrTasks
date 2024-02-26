"use client";
import { Task } from "@/app/api/schema";
import moment from "moment";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import CompleteButton from "../../components/CompleteButton";
import DeleteButton from "../../components/DeleteButton";

// REVIEW: this is not bad, but you can inline this in the function definition, like:
/**
 * export default function Task({ params }: { params: { id: string }})
 */
interface TaskPageParams {
	params: { id: string };
}

/** REVIEW
 * Inconsistent page naming, in here and others, you name it "page", but in root page, it is "Home", specific to what it is
 * Choose one or the other (ideally specific to the page, like Task)
 */
const page: NextPage<TaskPageParams> = ({
	params,
}: TaskPageParams): JSX.Element => {
	const [userTasks, setUserTasks] = useState<Task[]>([]);
	const [isLoading, setLoading] = useState(true);

	// REVIEW: is there anything that prevents you from immediately reading this?
	useEffect(() => {
		setUserTasks(JSON.parse(localStorage.getItem("userTasks") || "[]"));
		setLoading(false);
	}, []);

	// REVIEW: this is called on every re-render, which can have a performance problem, though with the new React compiler soonTM, it should hopefully automatically memoize this
	const task: Task | undefined = userTasks.find(
		(task: Task) => task.id === parseInt(params.id)
	);

	if (isLoading)
		return (
			<span className="loading loading-ring  loading-lg absolute top-1/2 left-1/2" />
		);

	if (!task) return <p className="text-center mt-24">Task not found!</p>;

	// REVIEW: momentjs is deprecated, use dayjs (or Temporal API when browsers finally support it reee)
	const date = moment.utc(task.end_date).local().format("HH:mm DD.MM.YYYY ");
	const tags: string[] = task.tags.split(",");
	const status = task.finished_at
		? "badge-success"
		: moment(task.end_date).diff(moment().utc()) < 0
		? "badge-error"
		: "badge-primary";

	return (
		<div className="card lg:card-side bg-base-100 shadow-xl mb-16 mt-28 mx-4 md:mx-16 lg:mx-[15%]">
			<figure className="m-auto w-full h-full max-h-[380px] max-w-[450px] md:max-h-[400px] xl:max-w-[550px]">
				<div className={`absolute top-2 badge badge-primary ${status}`}>
					{date}
				</div>
				<img
					className="block object-cover"
					//
					src={task.img_url}
					alt="cat"
				/>
			</figure>
			<div className="card-body">
				<h2 className="card-title">{task.title}</h2>
				<p>{task.text}</p>
				<div className="relative">
					Tags:{" "}
					{/* REVIEW: you can skip the type definition for tag, just write tag instead of tag: string */}
					{tags.map((tag: string, index) => (
						<div className="badge badge-base mr-2" key={index}>
							{tag}
						</div>
					))}
				</div>
				<div className="card-actions justify-end m-auto mt-4 whitespace-nowrap">
					{!task.finished_at && (
						<>
							<Link
								href={`/edit/${task.id}`}
								className="btn btn-warning btn-sm sm:btn-md"
							>
								EDIT
							</Link>
							<CompleteButton task_id={task.id} />
						</>
					)}
					<DeleteButton task_id={task.id} />
				</div>
			</div>
		</div>
	);
};

export default page;
