"use client";
import Link from "next/link";
import CompleteButton from "@/app/components/CompleteButton";
import DeleteButton from "@/app/components/DeleteButton";
import type { Task } from "@/app/api/schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useQuery } from "@tanstack/react-query";

dayjs.extend(utc);

export const fetchTask = async (id: String): Promise<Task> => {
	const res = await fetch(`/api/tasks/${id}`);

	if (!res.ok) {
		throw new Error(res.statusText);
	}

	const data = await res.json();
	return data.userTask;
};

export default function Task({
	params: { id },
}: {
	params: { id: string };
}): JSX.Element {
	const { isLoading, data } = useQuery({
		queryKey: ["task", id],
		queryFn: () => fetchTask(id),
		retry: false,
	});

	if (isLoading)
		return (
			<span className="loading loading-ring  loading-lg absolute top-1/2 left-1/2" />
		);

	if (!data)
		return <p className="text-lg text-center mt-32">Task not found!</p>;

	const date = dayjs.utc(data.endDate).local().format("HH:mm DD.MM.YYYY");
	const tags: string[] = data.tags.split(",");
	const status = data.finishedAt
		? "badge-success"
		: dayjs(data.endDate).diff(dayjs().utc()) < 0
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
					src={data.imgUrl}
					alt="cat"
				/>
			</figure>
			<div className="card-body">
				<h2 className="card-title">{data.title}</h2>
				<p>{data.text}</p>
				<div className="relative">
					Tags:{" "}
					{tags.map((tag, index) => (
						<div className="badge badge-base mr-2" key={index}>
							{tag}
						</div>
					))}
				</div>
				<div className="card-actions justify-end m-auto mt-4 whitespace-nowrap">
					{!data.finishedAt && (
						<>
							<Link
								href={`/edit/${data.id}`}
								className="btn btn-warning btn-sm sm:btn-md"
							>
								EDIT
							</Link>
							<CompleteButton taskId={data.id} />
						</>
					)}
					<DeleteButton taskId={data.id} />
				</div>
			</div>
		</div>
	);
}
