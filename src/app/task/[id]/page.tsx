import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Task } from "@/app/api/schema";
import moment from "moment";
import CompleteButton from "../../components/CompleteButton";
import DeleteButton from "../../components/DeleteButton";

interface TaskPageParams {
	params: { id: string };
}

const page: NextPage<TaskPageParams> = async ({
	params,
}: TaskPageParams): Promise<JSX.Element> => {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/auth/signin");
	}
	const res = await fetch(
		`${process.env.API_BASE_URL}/api/tasks/${params.id}`,
		{
			method: "GET",
			headers: headers(),
		}
	);

	if (!res.ok) {
		return <p className="text-center mt-10">Tasks not found.</p>;
	}

	const task: Task = await res.json();
	const date = moment.utc(task.end_date).local().format("HH:mm DD.MM.YYYY ");
	const tags: string[] = task.tags.split(",");
	const status = task.finished_at
		? "badge-success"
		: moment(task.end_date).diff(moment().utc()) < 0
		? "badge-error"
		: "badge-primary";
	return (
		<div className="card lg:card-side bg-base-100 shadow-xl mb-16 mt-28 mx-4 md:mx-16 lg:mx-[15%]">
			<figure className="md:min-h-[360px] sm:min-h-[340px]">
				<div className={`absolute top-2 badge badge-primary ${status}`}>
					{date}
				</div>
				<img
					className="w-full h-full block max-w-[340px] max-h-[340px]  md:max-w-[380px] md:max-h-[380px] object-cover"
					src={task.img_url}
					alt="cat"
				/>
			</figure>
			<div className="card-body">
				<h2 className="card-title">{task.title}</h2>
				<p>{task.text}</p>
				<div className="relative">
					Tags:{" "}
					{tags.map((tag: string, index) => (
						<div className="badge badge-base mr-2" key={index}>
							{tag}
						</div>
					))}
				</div>
				<div className="card-actions justify-end">
					{!task.finished_at && <CompleteButton task_id={task.id} />}
					<DeleteButton task_id={task.id} />
				</div>
			</div>
		</div>
	);
};
export default page;
