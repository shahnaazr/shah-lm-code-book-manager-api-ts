import { Book } from "../models/book";
import { deleteBookById } from "./books";

jest.mock("../models/book", () => ({
	Book: {
		findOne: jest.fn(),
		destroy: jest.fn(),
	},
}));

afterEach(() => {
	jest.clearAllMocks();
});

describe("test deleteBookById function", () => {
	test("should delete a book by ID when book exists", async () => {
		const mockBookId = 1;

		(Book.findOne as jest.Mock).mockResolvedValue({ bookId: mockBookId });
		(Book.destroy as jest.Mock).mockResolvedValue(mockBookId);

		const isDeleted = await deleteBookById(mockBookId);

		expect(Book.findOne).toHaveBeenCalledWith({
			where: { bookId: mockBookId },
		});
		expect(Book.destroy).toHaveBeenCalledWith({
			where: { bookId: mockBookId },
		});
		expect(isDeleted).toBe(true);
	});

	it("should return a message that the book is not found when book id does not exist", async () => {
		const mockBookId = 1;

		(Book.findOne as jest.Mock).mockResolvedValue(null);
		(Book.destroy as jest.Mock).mockResolvedValue(null);

		const isDeleted = await deleteBookById(mockBookId);

		expect(Book.findOne).toHaveBeenCalledWith({
			where: { bookId: mockBookId },
		});

		expect(isDeleted).toBe(false);
	});

	test("should throw an error when database operation fails", async () => {
		jest.spyOn(Book, "findOne").mockRejectedValue(new Error("Database error"));

		await expect(deleteBookById(3)).rejects.toThrow("Unable to delete book");
	});
});
