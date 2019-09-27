const express = require('express')

const app = express();

const mongoose = require('mongoose')

const User = require('./models/users')
const DATABASE_URL = "mongodb+srv://root:Sdrops!23@cluster0-jstn0.azure.mongodb.net/pagination?retryWrites=true&w=majority";

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', async () => {
    if (await User.countDocuments().exec() > 0) return
    Promise.all([
        User.create({ name: "User 1" }),
        User.create({ name: "User 2" }),
        User.create({ name: "User 3" }),
        User.create({ name: "User 4" }),
        User.create({ name: "User 5" }),
        User.create({ name: "User 6" }),
        User.create({ name: "User 7" }),
        User.create({ name: "User 8" }),
        User.create({ name: "User 9" }),
        User.create({ name: "User 10" }),
        User.create({ name: "User 11" }),
    ]).then(() => console.log('Added users'))
})


app.get('/users', paginatedResults(User), (req, res) => {
    res.json(res.paginatedResults)
})



function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {};

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (err) {
            res.status(500).json({ message: err.message })
        }


    }
}


app.listen(3000, () => console.log(`Server Listening 3000`))