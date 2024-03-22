"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/success.css";

const verifyUser = async (token: String) => {
	const res = await fetch(`/api/users/verify`, {
		method: "POST",
		body: JSON.stringify({ token }),
	});

	if (!res.ok) {
		throw new Error("Failed to verify user");
	}
};

export default function Verify(): JSX.Element {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const { push } = useRouter();
	const { mutate } = useMutation({
		mutationFn: verifyUser,
		onSuccess: () => {
			toast("User Verified!", { theme: "success" });
			push("/auth/signin");
		},
		onError: (error: Error) => {
			toast(`${error}`, { theme: "failure" });
			push("/auth/signin");
		},
	});

	useEffect(() => {
		if (token) {
			mutate(token);
		}
	}, []);

	return (
		<div className="m-auto mt-40">
			<p className="text-center mx-2">User Verification In Progress...</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 256 256"
				width="200px"
				height="200px"
				className="m-auto"
			>
				<path
					d="M221.4,36.3a16.3,16.3,0,0,0-17,4L187.5,57.2a111.5,111.5,0,0,0-119,0L51.6,40.3a16.3,16.3,0,0,0-17-4A15.9,15.9,0,0,0,24,51.3V136c0,49.1,40.1,89.6,91.6,95.3a4,4,0,0,0,4.4-4v-32l-13.4-13.4a8.3,8.3,0,0,1-.4-11.4,8.1,8.1,0,0,1,11.5-.2L128,180.7l10.3-10.4a8.1,8.1,0,0,1,11.5.2,8.3,8.3,0,0,1-.4,11.4L136,195.3v32a4,4,0,0,0,4.4,4c51.5-5.7,91.6-46.2,91.6-95.3V51.3A15.9,15.9,0,0,0,221.4,36.3ZM84,152a12,12,0,1,1,12-12A12,12,0,0,1,84,152Zm20-64a8,8,0,0,1-16,0V69a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V64a8,8,0,0,1,16,0Zm16,0V69a8,8,0,0,1,16,0V88a8,8,0,0,1-16,0Zm20,64a12,12,0,1,1,12-12A12,12,0,0,1,172,152Z"
					fill="#fffa"
				></path>
			</svg>
			<span className="loading loading-ring loading-lg absolute top-1/2 left-[48.9%]" />
		</div>
	);
}
