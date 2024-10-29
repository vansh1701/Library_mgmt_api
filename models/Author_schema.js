const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    author_id: { type : String, required: true , unique : true },
    name: { type: String, required: true },
    bio: String,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

module.exports = mongoose.models.authors || mongoose.model('authors', authorSchema);
