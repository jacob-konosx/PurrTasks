"use client";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FormEventHandler, useEffect, useState } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/success.css";

const page: NextPage = (): JSX.Element => {
	const { data: session } = useSession();
	const [userData, setUserData] = useState({
		email: "",
		password: "",
	});
	useEffect(() => {
		if (session) {
			window.location.href = "/";
		}
	}, [session]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (userData.email === "") {
			toast("Email cannot be empty!", { theme: "warning" });
			return;
		} else if (userData.password.length < 6) {
			toast("Password must be at least 6 characters long!", {
				theme: "warning",
			});
			return;
		} else if (!emailRegex.test(userData.email)) {
			toast("Invalid email!", { theme: "warning" });
			return;
		}
		const res = await signIn("credentials", {
			redirect: false,
			email: userData.email,
			password: userData.password,
		});
		if (res?.status == 401) {
			toast(res?.error, { theme: "failure" });
			return;
		}
		toast("Sign-in Successful!", { theme: "success" });
	};

	return (
		<form className="grid place-items-center mt-24" onSubmit={handleSubmit}>
			<label htmlFor="email" className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Email</span>
				</div>
				<input
					id="email"
					type="email"
					placeholder="Enter Email"
					className="input input-bordered w-full max-w-xs"
					value={userData.email}
					onChange={(e) =>
						setUserData({ ...userData, email: e.target.value })
					}
				/>
			</label>
			<label htmlFor="password" className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Password</span>
				</div>
				<input
					id="password"
					type="password"
					placeholder="Enter Password"
					className="input input-bordered w-full max-w-xs"
					value={userData.password}
					onChange={(e) =>
						setUserData({ ...userData, password: e.target.value })
					}
				/>
				<div className="label mt-2 mb-4">
					<span className="label-text-alt">
						Don't have an account?
					</span>
					<span className="label-text-alt">
						<Link href="/auth/signup" className="text-stone-100">
							SIGN UP
						</Link>
					</span>
				</div>
			</label>
			<button className="btn btn-outline">SIGN IN</button>
		</form>
	);
};

export default page;
