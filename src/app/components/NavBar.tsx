import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/app/lib/auth";
import LoginBtn from "@/app/components/LoginBtn";
import SignOutButton from "@/app/components/SignOutButton";

export default async function NavBar(): Promise<JSX.Element> {
	const session = await getServerSession(authOptions);

	return (
		<div className="navbar bg-neutral fixed top-0 z-10">
			<div className="navbar-start">
				{session && (
					<div className="flex-none">
						<ul className="menu menu-horizontal px-1">
							<Link href="/create" className="btn">
								CREATE
							</Link>
						</ul>
					</div>
				)}
			</div>
			<div className="navbar-center block">
				<Link
					href="/"
					className="btn btn-ghost text-lg sm:text-xl lg:text-2xl"
				>
					Purr &#128049; Tasks
				</Link>
			</div>
			{session ? (
				<div className="navbar-end">
					<p className="mr-2 hidden sm:block">{session.user.email}</p>

					<div className="flex-none">
						<ul className="menu menu-horizontal px-1">
							<SignOutButton />
						</ul>
					</div>
				</div>
			) : (
				<div className="navbar-end">
					<ul className="menu menu-horizontal px-1">
						<LoginBtn />
					</ul>
				</div>
			)}
		</div>
	);
};
