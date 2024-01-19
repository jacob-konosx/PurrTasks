"use client"
import { NextPage } from 'next';
import { signOut } from 'next-auth/react';

const SignOutButton: NextPage = (): JSX.Element => {
	return (
		<button onClick={() => {
			signOut()
			localStorage.removeItem("showCompleted");
			localStorage.removeItem("userTasks");
		}} className="btn">
			SIGN OUT
		</button>
	);
};

export default SignOutButton