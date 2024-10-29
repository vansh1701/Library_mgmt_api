const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    book_id: {type : String, required: true, unique : true},
    title: { type: String, required: true },
    genre: { type: String, required: true },
    authorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }]
});

module.exports = mongoose.models.books || mongoose.model('books', bookSchema);