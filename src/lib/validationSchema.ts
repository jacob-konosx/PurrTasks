import { TaskData } from "@/app/components/Form";
import { Dispatch, SetStateAction } from "react";
import {
	ObjectSchema,
	ValidationError,
	array,
	date,
	object,
	string,
} from "yup";

export interface StringKeyObject {
	[key: string]: string;
}

export const signUpSchema = object({
	firstName: string()
		.min(3, "First name must be at least 3 characters")
		.max(14, "First name must not exceed 14 characters")
		.required("First name is required"),
	lastName: string()
		.min(3, "Last name must be at least 3 characters")
		.max(14, "Last name must not exceed 14 characters")
		.required("Last name is required"),
	email: string().email("Invalid email").required("Email is required"),
	password: string()
		.min(5, "Password must be at least 5 characters")
		.max(16, "Password must not exceed 16 characters")
		.required("Password is required"),
});

export const signInSchema = object({
	email: string().email("Invalid email").required("Email is required"),
	password: string()
		.min(5, "Password must be at least 5 characters")
		.max(16, "Password must not exceed 16 characters")
		.required("Password is required"),
});

export const taskDataTagsSchema = object({
	tags: array()
		.of(
			string()
				.min(4, "Tag must be at least 4 characters")
				.max(20, "Tag cannot exceed 20 characters")
				.matches(
					/^[\p{L}\p{N}\p{Zs}]+$/gmu,
					"Tag can only contain letters and numbers"
				)
				.required("Tag is required")
		)
		.min(1, "Tags cannot be empty")
		.max(5, "Cannot have more then 5 tags")
		.required("Tags are required"),
});

const taskDataBaseSchema = object({
	text: string()
		.min(5, "Description must be at least 5 characters")
		.max(300, "Description must not exceed 300 characters")
		.required("Description is required"),
	title: string()
		.min(5, "Title must be at least 5 characters")
		.max(50, "Title must not exceed 50 characters")
		.required("Title is required"),
	endDate: date().required("End date is required"),
});
export const taskDataSchema = taskDataBaseSchema.concat(taskDataTagsSchema);

export const validateSchema = async (
	schema: ObjectSchema<any>,
	validationData: StringKeyObject | TaskData,
	validationSuccessFunction: any,
	setError: Dispatch<
		SetStateAction<{
			[key: string]: string;
		}>
	>
) => {
	try {
		await schema.validate(validationData, { abortEarly: false });
		await validationSuccessFunction(validationData);
		setError({});
		return true;
	} catch (error: any) {
		const newError: StringKeyObject = {};

		error.inner.forEach((err: ValidationError) => {
			newError[err.path!.includes("tags") ? "tags" : err.path!] =
				err.message;
		});
		setError(newError);
		return false;
	}
};
