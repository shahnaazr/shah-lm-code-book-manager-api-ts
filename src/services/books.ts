import { Book } from "../models/book";

export const getBooks = async () => {
	return Book.findAll();
};

export const getBook = async (bookId: number) => {
	return Book.findOne({
		where: { bookId },
	});
};

export const saveBook = async (book: Book) => {
	return Book.create<Book>(book);
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
