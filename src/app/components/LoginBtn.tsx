"use client";

import { signIn } from "next-auth/react";

export default function LoginBtn(): JSX.Element {
	return (
		<button
			onClick={() => {
				signIn();
			}}
			className="btn"
		>
			SIGN IN
		</button>
	);
}
