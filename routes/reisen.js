const express = require('express')
const router = express.Router()
const Reise = require('../models/reisen')

//Get alle Reisen
router.get('/', async (req, res) => {
    try {
        const reisen = await Reise.find()
        res.json(reisen)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Get eine Reise
router.get('/:id', getReise, (req, res) => {
    res.json(res.reise)
})
//Create eine Reise
router.post('/', async (req, res) => {
    const reise =new Reise({
        name: req.body.name,
        date1: req.body.date1,
        date2: req.body.date2,
        country: req.body.country
    })

    try {
        const newReise = await reise.save()
        res.status(201).json(newReise)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Update eine Reise
router.patch('/:id', getReise, async (req, res) => {
    if (req.body.name != null){
        res.reise.name= req.body.name
    }
    if (req.body.date1 != null){
        res.reise.date1= req.body.date1
    }
    if (req.body.date2 != null){
        res.reise.date2= req.body.date2
    }
    if (req.body.country != null){
        res.reise.country= req.body.country
    }

    try {
        const updatedReise = await res.reise.save()
        res.json(updatedReise)
    } catch (error) {
        res.res.status(400).json({message: error.message})
    }
})
//Delete eine Reise
router.delete('/:id', getReise, async (req, res) => {
    try {
        await res.reise.remove()
        res.json({message: 'Deleted Reise'})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

async function getReise(req, res, next){
    let reise
    try {
        reise = await Reise.findById(req.params.id)
        if (reise == null){
            return res.status(404).json({message: 'Cannot find reise'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

    res.reise = reise
    next()
}

module.exports = router