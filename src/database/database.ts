import { Dialect, Sequelize } from "sequelize";

export let sequelize = new Sequelize("sqlite::memory:");
if (process.env.NODE_ENV !== "test") {
	sequelize = new Sequelize(
		process.env.DB_NAME ?? "bookshop",

		process.env.DB_USERNAME ?? "",

		process.env.DB_PASSWORD ?? "",
		{
			host: process.env.DB_HOST ?? "",
			port: parseInt(process.env.DB_PORT as string) ?? 5432,
			dialect: (process.env.DB_DIALECT as Dialect) ?? "postgres",
		}
	);
}
