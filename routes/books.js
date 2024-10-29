const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

router.post('/',async (req, res) => {
    try {
        const { book_id, title, genre, authorIds } = req.body;
        const book = new Book({book_id, title, genre, authorIds});
        await book.save().then(() => console.log("Book saved!"))
            .catch(err => console.error("Error saving book:", err));
        res.status(201).send(book);
    } catch (error){
        res.status(400).send(error);
    }
});

router.get('/',async (req,res)=>{
    try{
        const books = await Book.find();
        res.status(200).send(books);
    } catch(error){
        res.status(400).send(error);
    }
});

router.get('/:id', async (req,res)=>{
    try{
        const books = await Book.findById(req.params.id);
        if(!books) return res.status(404).send('Book not found');
        res.status(200).send(books);
    } catch(error){
        res.status(400).send(error);
    }
});

router.put('/:id', async(req,res)=>{
    try{
        const { book_id, title, genre, authorIds } = req.body;
        const books = await Book.findByIdAndUpdate(req.params.id, {book_id, title, genre, authorIds}, {new : true});
        if(!books) return res.status(404).send(`book not found so created new one`);
        res.status(200).send(books);
    }catch(error){
        res.status(400).send(error);
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const books = await Book.findByIdAndDelete(req.params.id);
        if(!books) return res.status(404).send('Book not found');
        res.status(200).send(`Book Deleted`);
    } catch (error){
        res.status(404).send(error);
    }
})

router.get('/:id/authors', async (req,res)=>{
    try{
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).send('Book not found');
        const authors = await Author.find({_id: {$in:book.authorIds}});
        if(!authors || authors.length===0){
            return res.status(404).send('Author not found');
        }
        res.status(200).send(authors);
    } catch(error){
        res.status(400).send(error);
    }
})

router.delete('/:id/authors/:author_id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send(`Book not found`);
        book.authors.pull(req.params.author_id);
        await books.save();

        // const auhtors = await Author.findByIdAndDelete(req.params.author_id);
        // if (!authors) return res.status(404).send(`No any author found`);
        // res.status(204).send();
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;