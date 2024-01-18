"use client"
import { NextPage } from 'next';
import { signOut } from 'next-auth/react';
import React from 'react'

const SignOutButton: NextPage = (): JSX.Element => {
	return (
		<button onClick={() => signOut()} className="btn">
			SIGN OUT
		</button>
	);
};

export default SignOutButton