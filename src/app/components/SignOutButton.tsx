"use client"

import { signOut } from 'next-auth/react';
import toast from 'react-simple-toasts';
import "react-simple-toasts/dist/theme/success.css";

export default function SignOutButton (): JSX.Element {
	return (
		<button onClick={() => {
			signOut()
			toast("Sign-out Successful!", { theme: "success" });
			localStorage.removeItem("showCompleted");
		}} className="btn">
			SIGN OUT
		</button>
	);
};
