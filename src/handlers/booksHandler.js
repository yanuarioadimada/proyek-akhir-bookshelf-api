async function generateId() {
    const { nanoid } = await import('nanoid');
    return nanoid();
}
const books = require('../data/books');

// Handler untuk menambahkan buku
const addBookHandler = async (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }
  
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }
  
    const id = await generateId();
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
  
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
    };
  
    books.push(newBook);
  
    const isSuccess = books.some((book) => book.id === id);
  
    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    }
  
    return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500);
};

// Handler untuk mendapatkan semua buku
const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books: books.map(({ id, name, publisher }) => ({
            id, name, publisher
        })),
    },
});

// Handler untuk mendapatkan detail buku
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    console.log('Requested Book ID:', bookId);
    const book = books.find((b) => b.id === bookId);
 
    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return {
        status: 'success',
        data: {
            book,
        },
    };
};

// Handler untuk memperbarui buku
const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const index = books.findIndex((b) => b.id === bookId);

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    const updatedAt = new Date().toISOString();
    books[index] = {
        ...books[index],
        name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
        finished: pageCount === readPage,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

// Handler untuk delete buku
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((b) => b.id === bookId);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1);
    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };
