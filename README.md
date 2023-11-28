# 📖 Minimalist Book Manager API

## Introduction

This is the starter repository for the Further APIs session. It provides a start to creating a Minimalist Book Manager API.

### Pre-Requisites

- NodeJS installed (v18.12.1 Long Term Support version at time of writing)

### Technologies & Dependencies

- [TypeScript](https://www.typescriptlang.org/)
- [ExpressJS](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [SQLite3](https://www.npmjs.com/package/sqlite3)
- [Jest](https://jestjs.io/)
- [Supertest](https://www.npmjs.com/package/supertest)
- [ESLint](https://eslint.org/)

### How to Get Started

- Fork this repo to your Github and then clone the forked version of this repo

### Running the application

In order to run the unit tests run, firstly install the dependencies (if you haven't already done so)

```
npm install
```

Followed by:

```
npm start
```

### Running the Unit Tests

In order to run the unit tests run, firstly install the dependencies (if you haven't already done so)

```
npm install
```

Followed by:

```
npm test
```

## The Book Manager API provides endpoints to manage a collection of books.

## Endpoints

### Get All Books

Retrieve all books available in the collection.

URL: /api/v1/books
Method: GET
Response: Returns a list of all books in the database.

### Get Book by ID

Retrieve a specific book by its unique identifier.

URL: /api/v1/books/:id
Method: GET
Parameters:
id (required): The unique identifier of the book.
Response: Returns the details of the book corresponding to the provided ID.

### Update Book by ID

Update information for a specific book using its unique identifier.

URL: /api/v1/books/:id
Method: PUT
Parameters:
id (required): The unique identifier of the book.
Request Body: Includes the updated information for the book.
Response: Returns the updated details of the book.

### Add a New Book

Add a new book to the collection.

URL: /api/v1/books
Method: POST
Request Body: Contains the details of the new book to be added.
Response: Returns the details of the newly added book.

### Delete Book by ID

Delete a specific book from the collection by its unique identifier.

URL: /api/v1/books/:id
Method: DELETE
Parameters:
id (required): The unique identifier of the book to be deleted.
Response: Returns a success message upon successful deletion of the book.
