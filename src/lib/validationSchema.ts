import { Dispatch, SetStateAction } from "react";
import { ObjectSchema, ValidationError, object, string } from "yup";

export interface StringKeyObject {
	[key: string]: string;
}

export const signUpSchema = object({
	firstName: string()
		.min(3, "First name must be at least 3 characters!")
		.max(14, "First name must not exceed 14 characters!")
		.required("First name is required"),
	lastName: string()
		.min(3, "Last name must be at least 3 characters!")
		.max(14, "Last name must not exceed 14 characters!")
		.required("Last name is required"),
	email: string().email("Invalid email").required("Email is required"),
	password: string()
		.min(5, "Password must be at least 5 characters!")
		.max(16, "Password must not exceed 16 characters!")
		.required("Password is required"),
});
export const signInSchema = object({
	email: string().email("Invalid email").required("Email is required"),
	password: string()
		.min(5, "Password must be at least 5 characters!")
		.max(16, "Password must not exceed 16 characters!")
		.required("Password is required"),
});

export const validateSchema = async (
	schema: ObjectSchema<any>,
	userData: StringKeyObject,
	validationSuccessFunction: any,
	setError: Dispatch<
		SetStateAction<{
			[key: string]: string;
		}>
	>
) => {
	try {
		await schema.validate(userData, { abortEarly: false });
		await validationSuccessFunction(userData);
		setError({});
		return true;
	} catch (error: any) {
		const newError: StringKeyObject = {};

		error.inner.forEach((err: ValidationError) => {
			newError[err.path!] = err.message;
		});
		setError(newError);
		return false
	}
};
