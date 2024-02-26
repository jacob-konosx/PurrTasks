import moment from "moment";
import { NextPage } from "next";
import Link from "next/link";
import { Task } from "../api/schema";

interface TaskProps {
	task: Task;
}

const TaskCard: NextPage<TaskProps> = (props): JSX.Element => {
	// REVIEW: can destructure immediately in the function definition, instead of doing it in a separate line here
	const { task } = props;
	const date = moment.utc(task.end_date).local().format("hh:mm a DD.MM.YYYY");
	const tags: string[] = task.tags.split(",");
	const status = task.finished_at
		? "badge-success"
		: moment(task.end_date).diff(moment().utc()) < 0
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
						src={task.img_url}
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
						{tags.map((tag: string, index) => (
							<div className="badge badge-outline" key={index}>
								{tag}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default TaskCard;
