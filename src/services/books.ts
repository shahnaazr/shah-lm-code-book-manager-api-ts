import { Book } from "../models/book";

export const getBooks = async () => {
	return Book.findAll();
};

export const getBook = async (bookId: number) => {
	return Book.findOne({
		where: { bookId },
	});
};

export const validateBookObject = (book: Book): boolean => {
	const expectedKeys: Array<keyof Book> = [
		"bookId",
		"title",
		"author",
		"description",
	]; // Add other keys as needed

	for (const key of expectedKeys) {
		if (!(key in book)) {
			return false;
		}
	}
	return true;
};

export const saveBook = async (book: Book) => {
	const bookId = book.bookId;

	const retrievedBook = await Book.findOne({
		where: { bookId },
	});
	if (retrievedBook !== null) {
		throw new Error(`The book with this bookId, ${bookId} already exists`);
	}
	if (retrievedBook === null) {
		if (!validateBookObject(book)) {
			throw new Error("Invalid book object: Missing required properties");
		} else {
			return Book.create<Book>(book);
		}
	} else {
		throw "Unable to save book"; // Handle database errors or other issues
	}
};

// User Story 4 - Update Book By Id Solution
export const updateBook = async (bookId: number, book: Book) => {
	return Book.update(book, {
		where: {
			bookId,
		},
	});
};

export const deleteBookById = async (bookId: number): Promise<boolean> => {
	try {
		const book = await Book.findOne({
			where: { bookId },
		});
		if (book) {
			Book.destroy({
				where: { bookId },
			});
			return true; // Book was found and deleted
		}
		return false; // Book not found
	} catch (error) {
		throw new Error("Unable to delete book"); // Handle database errors or other issues
	}
};
