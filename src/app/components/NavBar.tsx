import Link from "next/link";
import React, { use, useEffect } from "react";
import LoginBtn from "./LoginBtn";
import { signOut, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import SignOutButton from "./SignOutButton";
import { NextPage } from "next";

const NavBar: NextPage = async (): Promise<JSX.Element> => {
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
			<div className="navbar-center">
				<Link href="/" className="btn btn-ghost text-lg sm:text-xl">
					Purr &#128049; Tasks
				</Link>
			</div>
			{session ? (
				<div className="navbar-end">
					{/* <div className="form-control pr-2">
						<input
							type="text"
							placeholder="Search"
							className="input input-bordered w-24 md:w-auto"
						/>
					</div> */}
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

export default NavBar;
