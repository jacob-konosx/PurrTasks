"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, FormEventHandler, useState } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/success.css";
import {
	StringKeyObject,
	signInSchema,
	validateSchema,
} from "@/lib/validationSchema";
import FormInput from "@/app/components/FormInput";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { is } from "drizzle-orm";

const inputs = [
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

const loginFunction = async (userData: StringKeyObject) => {
	const res = await signIn("credentials", {
		redirect: false,
		email: userData.email,
		password: userData.password,
	});
	if (!res?.ok) {
		throw new Error(res?.error!);
	}
};

export default function SignIn(): JSX.Element {
	const { push } = useRouter();
	const [error, setError] = useState<StringKeyObject>({});
	const [userData, setUserData] = useState<StringKeyObject>({
		email: "",
		password: "",
	});

	const { mutate, isPending } = useMutation({
		mutationFn: loginFunction,
		onSuccess: () => {
			toast("Login successful!", { theme: "success" });
			// For some reason the useRouter push redirect is not working
			window.location.href = "/";
		},
		onError: (error: Error) => {
			toast(`${error}`, { theme: "failure" });
		},
	});

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		await validateSchema(signInSchema, userData, mutate, setError);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUserData({ ...userData, [e.target.id]: e.target.value });
	};

	return (
		<form className="grid place-items-center mt-24" onSubmit={handleSubmit}>
			{isPending && (
				<span className="loading loading-ring  loading-lg absolute top-1/2 left-4/12" />
			)}
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
						Don't have an account?
					</span>
					<span className="label-text-alt">
						<Link href="/auth/signup" className="text-stone-100">
							SIGN UP
						</Link>
					</span>
				</div>
				<button
					disabled={isPending}
					className="btn btn-outline block m-auto"
				>
					SIGN IN
				</button>
			</div>
		</form>
	);
}
