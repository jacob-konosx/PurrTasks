"use client";
import Link from "next/link";
import CompleteButton from "@/app/components/CompleteButton";
import DeleteButton from "@/app/components/DeleteButton";
import type { Task } from "@/app/api/schema";
import { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function Task({
	params,
}: {
	params: { id: string };
}): JSX.Element {
	const userTasks: Task[] = JSON.parse(
		localStorage.getItem("userTasks") || "[]"
	);

	const task: Task | undefined = useMemo(
		() => userTasks.find((task: Task) => task.id === parseInt(params.id)),
		[params]
	);

	if (!task) return <p className="text-center mt-24">Task not found!</p>;

	const date = dayjs.utc(task.endDate).local().format("HH:mm DD.MM.YYYY");
	const tags: string[] = task.tags.split(",");
	const status = task.finishedAt
		? "badge-success"
		: dayjs(task.endDate).diff(dayjs().utc()) < 0
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
					src={task.imgUrl}
					alt="cat"
				/>
			</figure>
			<div className="card-body">
				<h2 className="card-title">{task.title}</h2>
				<p>{task.text}</p>
				<div className="relative">
					Tags:{" "}
					{tags.map((tag, index) => (
						<div className="badge badge-base mr-2" key={index}>
							{tag}
						</div>
					))}
				</div>
				<div className="card-actions justify-end m-auto mt-4 whitespace-nowrap">
					{!task.finishedAt && (
						<>
							<Link
								href={`/edit/${task.id}`}
								className="btn btn-warning btn-sm sm:btn-md"
							>
								EDIT
							</Link>
							<CompleteButton taskId={task.id} />
						</>
					)}
					<DeleteButton taskId={task.id} />
				</div>
			</div>
		</div>
	);
}
