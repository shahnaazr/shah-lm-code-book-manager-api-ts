import { Request, Response } from "express";
import * as bookService from "../services/books";
import { ValidationError } from "sequelize";

export const getBooks = async (req: Request, res: Response) => {
	const books = await bookService.getBooks();
	res.json(books).status(200);
};

export const getBook = async (req: Request, res: Response) => {
	const bookId = req.params.bookId;
	const book = await bookService.getBook(Number(bookId));

	if (book) {
		res.json(book).status(200);
	} else {
		res.status(404).json("Not found");
	}
};

export const saveBook = async (req: Request, res: Response) => {
	const bookToBeSaved = req.body;
	try {
		const book = await bookService.saveBook(bookToBeSaved);
		res.status(201).json(book);
	} catch (error: any) {
		if (
			typeof error === "object" &&
			"message" in error &&
			error.message.includes("already exists")
		) {
			res.status(409).json({ message: error.message }); // Use 409 for Conflict error
		} else if (
			typeof error === "object" &&
			"message" in error &&
			error.message.includes("Invalid book object: Missing required properties")
		) {
			res.status(400).json({ message: error.message });
		} else {
			res.status(500).json({ message: "Internal server error" });
		}
	}
};

// User Story 4 - Update Book By Id Solution
export const updateBook = async (req: Request, res: Response) => {
	const bookUpdateData = req.body;
	const bookId = Number.parseInt(req.params.bookId);

	const book = await bookService.updateBook(bookId, bookUpdateData);
	res.status(204).json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
	try {
		const bookId = req.params.bookId;
		const deletedBook = await bookService.deleteBookById(Number(bookId));
		if (deletedBook) {
			res.status(200).json(`Book deleted successfully for book id, ${bookId}`);
		} else {
			res.status(404).json(`Book not found for book id, ${bookId}`);
		}
	} catch (error) {
		res.status(500).json(error);
	}
};
