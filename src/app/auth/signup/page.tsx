"use client";

import FormInput from "@/app/components/FormInput";
import {
	StringKeyObject,
	signUpSchema,
	validateSchema,
} from "@/lib/validationSchema";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEventHandler, useState } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/warning.css";

const inputs = [
	{
		id: "firstName",
		label: "firstName",
		name: "First Name",
		type: "text",
		placeholder: "Enter first name",
		svg: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z",
	},
	{
		id: "lastName",
		label: "lastName",
		name: "Last Name",
		type: "text",
		placeholder: "Enter last name",
		svg: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z",
	},
	{
		id: "email",
		label: "email",
		name: "Email",
		type: "email",
		placeholder: "Enter email",
	},
	{
		id: "password",
		label: "password",
		name: "Password",
		type: "password",
		placeholder: "Enter password",
		svg: "M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z",
	},
];

const createUser = async (userData: StringKeyObject) => {
	const res = await fetch(`/api/auth/signup`, {
		method: "POST",
		body: JSON.stringify(userData),
	});
	if (!res.ok) {
		throw new Error("Failed to create user");
	}
};

export default function SignUp(): JSX.Element {
	const { push } = useRouter();
	const [error, setError] = useState<StringKeyObject>({});
	const [userData, setUserData] = useState<StringKeyObject>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	const { mutate, isPending, isSuccess } = useMutation({
		mutationFn: createUser,
		onSuccess: () => {
			toast("Verify email to sign in!", { theme: "success" });
			push("/auth/signin");
		},
		onError: (error: Error) => {
			toast(`${error}`, { theme: "failure" });
		},
	});

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		await validateSchema(signUpSchema, userData, mutate, setError);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUserData({ ...userData, [e.target.id]: e.target.value });
	};

	if (isPending || isSuccess) {
		return (
			<span className="loading loading-ring  loading-lg absolute top-1/2 left-1/2" />
		);
	}

	return (
		<form className="grid place-items-center mt-24" onSubmit={handleSubmit}>
			<div>
				{inputs.map((input, i) => (
					<FormInput
						key={i}
						{...input}
						onChange={onChange}
						value={userData[input.id]}
						error={error[input.id]}
						svg={input.svg!}
					/>
				))}
				<div className="label mt-2 mb-4">
					<span className="label-text-alt">
						Already have an account?
					</span>
					<span className="label-text-alt float-right">
						<Link href="/auth/signin" className="text-stone-100">
							SIGN IN
						</Link>
					</span>
				</div>
				<button className="btn btn-outline block m-auto">
					SIGN UP
				</button>
			</div>
		</form>
	);
}
