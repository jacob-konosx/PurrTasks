"use client"
// REVIEW: does this need a "use client"? I do not see any use of state here, and the server render will never execute the onclick function anyway
import { NextPage } from 'next';
import { signOut } from 'next-auth/react';
import toast from 'react-simple-toasts';
import "react-simple-toasts/dist/theme/success.css";

const SignOutButton: NextPage = (): JSX.Element => {
	// REVIEW: I would place each attribute on a newline to be more easily readable
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

// REVIEW: missing ; (use Prettier auto formatting)
export default SignOutButton