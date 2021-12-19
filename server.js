require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
const User = require('./models/user')
const bcrypt = require('bcrypt')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Conected to Database'))

async function deleteAll() {
    const user = await User.find()
    if (user != null) {
        for (let u in user) {
            await user[u].remove()
        }
    }

}

deleteAll()

async function encrypt(pw, email) {
    try {
        const pw1 = await bcrypt.hash(pw, 10)
        const user = new User({
            email: email,
            password: pw1
        })
        user.save()
    } catch (error) {
        console.log(error)
    }

}

encrypt('hunter2','huene@htw-berlin.de')
encrypt('abc123','admin@htw-berlin.de')

app.use(express.json())

const reiseRouter = require('./routes/reisen')
app.use('/reisen', reiseRouter)

app.post('/login', async (req, res) => {
    const user = await User.find()
    if (user == null) {
        return res.status(400).send('No Users')
    }
    for (let u in user) {
        if (req.body.email == user[u].email) {
            try {
                if (await bcrypt.compare(req.body.password, user[u].password)) {
                    return res.send('success')
                }
            } catch (error) {
                return res.status(500).json({ message: error.message })
            }
        }
    }
    return res.status(400).send('Falsches Passwort oder Email')
})

app.listen(port, () => console.log('Server started on 127.0.0.1:' + port))
