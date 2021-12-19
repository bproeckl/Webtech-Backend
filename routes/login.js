const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
    const user = User.find(user => user.email = req.body.email)
    if (user==null){
        return res.status(400).send('Cannot find User')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)){
            res.send('success')
        }else{
            res.send('denied')
        }
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router