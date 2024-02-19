"use client";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEventHandler, useEffect, useState } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

const createUser = async (userData: any): Promise<any> => {
	const res = await fetch(`/api/auth/signup`, {
		method: "POST",
		body: JSON.stringify(userData),
	});
	if (!res.ok) {
		throw new Error("Failed to create user");
	}
	return res.json();
};

const page: NextPage = (): JSX.Element => {
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const { data: session } = useSession();
	const { push } = useRouter();

	const { mutate, isPending, isSuccess } = useMutation({
		mutationFn: createUser,
		onSuccess: () => {
			toast("Verify email to sign in!", { theme: "success" });
			push("/auth/signin");
		},
		onError: () => {
			toast("Error creating user!", { theme: "failure" });
		},
	});

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
		} else if (!emailRegex.test(userData.email)) {
			toast("Invalid email!", { theme: "warning" });
			return;
		} else if (userData.password.length < 6) {
			toast("Password must be at least 6 characters long!", {
				theme: "warning",
			});
			return;
		}
		mutate(userData);
	};
	if (isPending || isSuccess) {
		return (
			<span className="loading loading-ring  loading-lg absolute top-1/2 left-1/2" />
		);
	}
	return (
		<form className="grid place-items-center mt-24" onSubmit={handleSubmit}>
			<label
				htmlFor="first_name"
				className="form-control w-full max-w-xs"
			>
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
