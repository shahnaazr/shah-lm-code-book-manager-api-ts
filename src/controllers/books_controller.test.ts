import request from "supertest";
import { app } from "../app";
import { Book } from "../models/book";

import * as bookService from "../services/books";

jest.mock("../services/books");

afterEach(() => {
	jest.clearAllMocks();
});

const dummyBookData = [
	{
		bookId: 1,
		title: "The Hobbit",
		author: "J. R. R. Tolkien",
		description: "Someone finds a nice piece of jewellery while on holiday.",
	},
	{
		bookId: 2,
		title: "The Shop Before Life",
		author: "Neil Hughes",
		description:
			"Before being born, each person must visit the magical Shop Before Life, where they choose what kind of person they will become down on Earth...",
	},
];

describe("GET /api/v1/books endpoint", () => {
	test("status code successfully 200", async () => {
		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.statusCode).toEqual(200);
	});

	test("books successfully returned as empty array when no data returned from the service", async () => {
		// Arrange
		jest.spyOn(bookService, "getBooks").mockResolvedValue([]);
		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.body).toEqual([]);
		expect(res.body.length).toEqual(0);
	});

	test("books successfully returned as array of books", async () => {
		// Arrange

		// NB the "as" to `Book[]` takes care of all the missing properties added by sequelize
		//    such as createdDate etc, that we don't care about for the purposes of this test
		jest
			.spyOn(bookService, "getBooks")
			.mockResolvedValue(dummyBookData as Book[]);

		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.body).toEqual(dummyBookData);
		expect(res.body.length).toEqual(2);
	});
});

describe("GET /api/v1/books/{bookId} endpoint", () => {
	test("status code successfully 200 for a book that is found", async () => {
		// Arrange
		const mockGetBook = jest
			.spyOn(bookService, "getBook")
			.mockResolvedValue(dummyBookData[1] as Book);

		// Act
		const res = await request(app).get("/api/v1/books/2");

		// Assert
		expect(res.statusCode).toEqual(200);
	});

	test("status code successfully 404 for a book that is not found", async () => {
		// Arrange

		jest
			.spyOn(bookService, "getBook")
			// this is a weird looking type assertion!
			// it's necessary because TS knows we can't actually return unknown here
			// BUT we want to check that in the event a book is missing we return a 404
			.mockResolvedValue(undefined as unknown as Book);
		// Act
		const res = await request(app).get("/api/v1/books/77");

		// Assert
		expect(res.statusCode).toEqual(404);
	});

	test("controller successfully returns book object as JSON", async () => {
		// Arrange
		jest
			.spyOn(bookService, "getBook")
			.mockResolvedValue(dummyBookData[1] as Book);

		// Act
		const res = await request(app).get("/api/v1/books/2");

		// Assert
		expect(res.body).toEqual(dummyBookData[1]);
	});
});

describe("POST /api/v1/books endpoint", () => {
	test("should return a saved book", async () => {
		// Arrange
		const bookToBeSaved = {
			bookId: 3,
			title: "Fantastic Mr. Fox",
			author: "Roald Dahl",
			description: "this is a Fantastic book by Roald Dahl",
		};

		const createdBook = Object.assign(new Book(), bookToBeSaved);

		jest.spyOn(bookService, "saveBook").mockResolvedValueOnce(createdBook);

		// Act
		const res = await request(app).post("/api/v1/books").send(bookToBeSaved);

		// Assert
		expect(res.statusCode).toEqual(201);
		expect(res.body).toEqual(createdBook.toJSON()); // Convert Sequelize instance to plain object
	});

	test("should return a message that the book already exists", async () => {
		//Arrange
		jest.spyOn(bookService, "saveBook").mockImplementation(() => {
			throw new Error(`The book with this bookId, 2 already exists`);
		});

		// Act
		const res = await request(app).post("/api/v1/books").send(dummyBookData[1]);

		// Assert
		expect(res.statusCode).toEqual(409);
		expect(res.body).toEqual({
			message: "The book with this bookId, 2 already exists",
		});
	});

	test("should return a message that there are missing required properties", async () => {
		//Arrange
		const dummyBook = {
			bookId: 3,
			title: "Fantastic Mr. Fox",
			author: "Roald Dahl",
		};

		jest.spyOn(bookService, "saveBook").mockImplementation(() => {
			throw new Error("Invalid book object: Missing required properties");
		});

		// Act
		const res = await request(app).post("/api/v1/books").send(dummyBook);

		// Assert
		expect(res.statusCode).toEqual(400);
		expect(res.body).toEqual({
			message: "Invalid book object: Missing required properties",
		});
	});

	test("should return an internal server error", async () => {
		//Arrange
		const dummyBook = {
			title: "Fantastic Mr. Fox",
			author: "Roald Dahl",
		};
		jest.spyOn(bookService, "saveBook").mockImplementation(() => {
			throw new Error("Internal server error");
		});

		// Act
		const res = await request(app).post("/api/v1/books").send(dummyBook);

		// Assert
		expect(res.statusCode).toEqual(500);
		expect(res.body).toEqual({
			message: "Internal server error",
		});
	});
});

describe("DELETE /api/v1/books/{bookId} endpoint", () => {
	test("Calling delete book endpoint with book id which exists should successfully delete the book", async () => {
		// Arrange
		const mockDeleteBookById = jest
			.spyOn(bookService, "deleteBookById")
			.mockResolvedValue(true);

		// Act
		const res = await request(app).delete("/api/v1/books/2");

		// Assert
		expect(mockDeleteBookById).toHaveBeenCalledWith(2);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual("Book deleted successfully for book id, 2");
	});

	test("Calling delete book endpoint with an book id which does not exist should return book not found", async () => {
		// Arrange

		const mockDeleteBookById = jest
			.spyOn(bookService, "deleteBookById")
			.mockResolvedValue(false);

		// Act
		const res = await request(app).delete("/api/v1/books/77");

		// Assert
		expect(mockDeleteBookById).toHaveBeenCalledWith(77);
		expect(res.statusCode).toEqual(404);
		expect(res.body).toEqual("Book not found for book id, 77");
	});

	test("Calling delete book endpoint when database is down should return internal server error", async () => {
		// Arrange
		const mockDeleteBookById = jest
			.spyOn(bookService, "deleteBookById")
			.mockRejectedValue("Internal server error");

		// Act
		const res = await request(app).delete("/api/v1/books/2");

		// Assert
		expect(mockDeleteBookById).toHaveBeenCalledWith(2);
		expect(res.statusCode).toEqual(500);
		expect(res.body).toEqual("Internal server error");
	});
});
