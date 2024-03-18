import Link from "next/link";
import { Task } from "@/app/api/schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function TaskCard({ task }: { task: Task }): JSX.Element {
	const date = dayjs.utc(task.endDate).local().format("HH:mm DD.MM.YYYY");
	const tags: string[] = task.tags.split(",");
	const status = task.finishedAt
		? "badge-success"
		: dayjs(task.endDate).diff(dayjs().utc()) < 0
		? "badge-error"
		: "badge-primary";

	return (
		<div className="card w-80 sm:w-96 bg-base-100 shadow-xl mb-4 m-auto">
			<div
				className={`badge badge-primary ${status}
				absolute top-2 left-2`}
			>
				{date}
			</div>

			<div className="hover:shadow-[0px_0px_30px_15px_rgba(255,255,255,0.1)] w-full">
				<Link href={`/task/${task.id}`}>
					<img
						className="w-full block max-w-[385px] max-h-[215px] object-cover"
						src={task.imgUrl}
						alt="cat"
					/>
				</Link>
			</div>
			<div className="card-body">
				<h2 className="card-title hover:text-stone-300">
					<Link href={`/task/${task.id}`}>{task.title}</Link>
				</h2>
				<p>{task.text}</p>
				{tags.length > 0 && (
					<div className="card-actions justify-end">
						{tags.map((tag, index) => (
							<div className="badge badge-outline" key={index}>
								{tag}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
