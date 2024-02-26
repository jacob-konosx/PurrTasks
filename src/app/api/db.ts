import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";

// REVIEW: redundant comment
// create the connection
const connection = connect({
	host: process.env.DATABASE_HOST,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
});

// REVIEW: I highly suggest using newlines between imports, exports, and function/constant definitions
export const db = drizzle(connection, { schema });