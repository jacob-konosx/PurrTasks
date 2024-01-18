"use client";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { FormEventHandler, useEffect, useState } from "react";
import toast from "react-simple-toasts";

const page: NextPage = (): JSX.Element => {
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			window.location.href = "/";
		}
	}, [session]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (userData.firstName === "") {
			toast("First name cannot be empty!", { theme: "warning" });
			return;
		} else if (userData.lastName === "") {
			toast("Last name cannot be empty!", { theme: "warning" });
			return;
		} else if (userData.email === "") {
			toast("Email cannot be empty!", { theme: "warning" });
			return;
		} else if (userData.password.length < 6) {
			toast("Password must be at least 6 characters long!", {theme: "warning"});
			return;
		}
		const res = await signIn("signUp", {
			redirect: false,
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			password: userData.password,
		});
		if (res?.status == 401) {
			toast(res?.error, { theme: "failure" });
		}
	};
	return (
		<form className="grid place-items-center mt-24" onSubmit={handleSubmit}>
			<label className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">First Name</span>
				</div>
				<input
					type="text"
					placeholder="Enter first name"
					className="input input-bordered w-full max-w-xs"
					value={userData.firstName}
					onChange={(e) =>
						setUserData({ ...userData, firstName: e.target.value })
					}
				/>
			</label>
			<label className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Last Name</span>
				</div>
				<input
					type="text"
					placeholder="Enter last name"
					className="input input-bordered w-full max-w-xs"
					value={userData.lastName}
					onChange={(e) =>
						setUserData({ ...userData, lastName: e.target.value })
					}
				/>
			</label>
			<label className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Email</span>
				</div>
				<input
					type="email"
					placeholder="Enter email"
					className="input input-bordered w-full max-w-xs"
					value={userData.email}
					onChange={(e) =>
						setUserData({ ...userData, email: e.target.value })
					}
				/>
			</label>
			<label className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Password</span>
				</div>
				<input
					type="password"
					placeholder="Enter password"
					className="input input-bordered w-full max-w-xs"
					value={userData.password}
					onChange={(e) =>
						setUserData({ ...userData, password: e.target.value })
					}
				/>
				<div className="label">
					<span className="label-text-alt">Have an account?</span>
					<span className="label-text-alt">
						<Link href="/login" className="btn">
							SIGN IN
						</Link>
					</span>
				</div>
			</label>
			<button className="btn btn-outline">SIGN UP</button>
		</form>
	);
};

export default page;
