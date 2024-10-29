const express = require('express');
const router = express.Router();
const Book = require('../models/Book_schema');
const Author = require('../models/Author_schema');

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
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).send('Book not found');
        res.status(200).send(book);
    } catch(error){
        res.status(400).send(error);
    }
});

router.put('/:id', async(req,res)=>{
    try{
        const { book_id, title, genre, authorIds } = req.body;
        const book = await Book.findByIdAndUpdate(req.params.id, {book_id, title, genre, authorIds}, {new : true});
        if(!book) return res.status(404).send(`book not found so created new one`);
        res.status(200).send(book);
    }catch(error){
        res.status(400).send(error);
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const book = await Book.findByIdAndDelete(req.params.id);
        if(!book) return res.status(404).send('Book not found');
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
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;