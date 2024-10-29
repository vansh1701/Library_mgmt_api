const express = require('express');
const router = express.Router();
const Book = require('../models/Book_schema');
const Author = require('../models/Author_schema');

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
        const authors = await Author.find();
        res.status(200).send(authors);
    } catch(error){
        res.status(400).send(error);
    }
});

router.get('/:id', async (req,res)=>{
    try {
        const author = await Author.findById(req.params.id);
        if(!author) return res.status(404).send('Author not found');
        res.status(200).send(author);
    } catch (error){
        res.status(404).send(error);
    }
})

router.put('/:id',async(req,res)=>{
    try {
        const {author_id, name, bio, books} = req.body;
        const author = await Author.findByIdAndUpdate(req.params.id,{author_id, name, bio, books});
        if(!author) res.status(404).send(`Author not found to update`);
        res.status(200).send(author);
    } catch(error){
        res.status(400).send(error);
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const author = await Author.findByIdAndDelete(req.params.id);
        if(!author) res.status(400).send(`Author not found`);
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
        const auhtor = await Author.findByIdAndUpdate(req.params.id,{books});
        if(!auhtor){
            return res.status(404).send(`Author not found`);
        }
        res.status(200).send(`Updated successfully`)
    }catch(error){
        res.status(400).send(error);
    }
})

router.delete('/:id/books/:bookid', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).send('Author not found');

        author.books.pull(req.params.bookid);
        await author.save();

        res.status(200).send('Book removed successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});



module.exports = router;


//users renting books