"use client"
import { NextPage } from 'next';
import { signOut } from 'next-auth/react';
import toast from 'react-simple-toasts';
import "react-simple-toasts/dist/theme/success.css";

const SignOutButton: NextPage = (): JSX.Element => {
	return (
		<button onClick={() => {
			signOut()
			toast("Sign-out Successful!", { theme: "success" });
			localStorage.removeItem("showCompleted");
			localStorage.removeItem("userTasks");
		}} className="btn">
			SIGN OUT
		</button>
	);
};

export default SignOutButton