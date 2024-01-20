"use client";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FormEventHandler, useEffect, useState } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/success.css";

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
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (userData.firstName === "") {
			toast("First name cannot be empty!", { theme: "warning" });
			return;
		} else if (userData.lastName === "") {
			toast("Last name cannot be empty!", { theme: "warning" });
			return;
		} else if (userData.email === "") {
			toast("Email cannot be empty!", { theme: "warning" });
			return;
		}else if (!emailRegex.test(userData.email)) {
			toast("Invalid email!", { theme: "warning" });
			return;
		}else if (userData.password.length < 6) {
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
		toast("Sign-up Successful!", { theme: "success" });

	};
	return (
		<form className="grid place-items-center mt-24" onSubmit={handleSubmit}>
			<label htmlFor="first_name" className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">First Name</span>
				</div>
				<input
				id="first_name"
					type="text"
					placeholder="Enter first name"
					className="input input-bordered w-full max-w-xs"
					value={userData.firstName}
					onChange={(e) =>
						setUserData({ ...userData, firstName: e.target.value })
					}
				/>
			</label>
			<label htmlFor="last_name" className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Last Name</span>
				</div>
				<input
				id="last_name"
					type="text"
					placeholder="Enter last name"
					className="input input-bordered w-full max-w-xs"
					value={userData.lastName}
					onChange={(e) =>
						setUserData({ ...userData, lastName: e.target.value })
					}
				/>
			</label>
			<label htmlFor="email" className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Email</span>
				</div>
				<input
				id="email"
					type="email"
					placeholder="Enter email"
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
					placeholder="Enter password"
					className="input input-bordered w-full max-w-xs"
					value={userData.password}
					onChange={(e) =>
						setUserData({ ...userData, password: e.target.value })
					}
				/>
				<div className="label mt-2 mb-4">
					<span className="label-text-alt">
						Already have an account?
					</span>
					<span className="label-text-alt">
						<Link href="/auth/signin" className="text-stone-100">
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
