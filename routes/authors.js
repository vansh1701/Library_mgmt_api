const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');

router.post('/', async (req, res) => {
    try {
        const {author_id, name, bio, books} = req.body;
        const author = new Author({author_id, name, bio, books});
        await author.save().then(() => console.log("Author saved!"))
            .catch(err => console.error("Error saving author:", err));
        res.status(201).send(author);
    } catch(error){
        res.status(400).send(error);
    }
});

router.get('/',async(req,res)=>{
    try {
        const authors = await Author.find().populate('books');
        res.status(200).send(authors);
    } catch(error){
        res.status(400).send(error);
    }
});

router.get('/:id', async (req,res)=>{
    try {
        const authors = await Author.findById(req.params.id);
        if(!authors) return res.status(404).send('Author not found');
        res.status(200).send(authors);
    } catch (error){
        res.status(404).send(error);
    }
})

router.put('/:id',async(req,res)=>{
    try {
        const {author_id, name, bio, books} = req.body;
        const authors = await Author.findByIdAndUpdate(req.params.id,{author_id, name, bio, books});
        if(!authors) res.status(404).send(`Author not found to update`);
        res.status(200).send(authors);
    } catch(error){
        res.status(400).send(error);
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const authors = await Author.findByIdAndDelete(req.params.id);
        if(!authors) res.status(400).send(`Author not found`);
        res.status(200).send(`Deleted Succesffully`);
    } catch(error){
        res.status(400).send(error);
    }
})

router.get('/:id/books', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).send('Author not found');
        }
        const books = await Book.find({ _id: { $in: author.books } });
        if (!books || books.length === 0) {
            return res.status(404).send('No books found for this author');
        }
        res.status(200).send(books);
    } catch (error) {
        res.status(400).send(error.message); // Improved error response
    }
});

router.patch('/:id/books', async(req,res)=>{
    try {
        const {books} = req.body;
        const authors = await Author.findByIdAndUpdate(req.params.id,{books});
        if(!authors){
            return res.status(404).send(`Author not found`);
        }
        res.status(200).send(`Updated successfully`)
    }catch(error){
        res.status(400).send(error);
    }
})

router.delete('/:id/books/:bookid', async(req,res)=>{
    try {
        const authors = await Author.findById(req.params.id);
        if(!authors) res.status(404).send(`Author not found`);
        authors.books.pull(req.params.bookid);
        await authors.save();
        res.status(200).send(`success`);
    }catch (error){
        res.status(400).send(error);
    }
})

module.exports = router;