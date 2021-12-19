const express = require('express')
const router = express.Router()
const Reise = require('../models/reisen')
const User = require('../models/user')

//Get alle Reisen
router.get('/:uid', getUserReisen,  async (req, res) => {
    try {
        const reisen = res.userReisen
        for (r in reisen){
            if (reisen[r].uid){

            }
        }
        res.json(reisen)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Get eine Reise
router.get('/:uid/:id', getReise, (req, res) => {
    res.json(res.reise)
})
//Create eine Reise
router.post('/:uid', async (req, res) => {
    const reise =new Reise({
        name: req.body.name,
        date1: req.body.date1,
        date2: req.body.date2,
        country: req.body.country,
        uid: req.params.uid
    })

    try {
        const newReise = await reise.save()
        res.status(201).json(newReise)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Update eine Reise
router.patch('/:uid/:id', getReise, async (req, res) => {
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
router.delete('/:uid/:id', getReise, async (req, res) => {
    try {
        await res.reise.remove()
        res.json({message: 'Deleted Reise'})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

async function getUserReisen(req, res, next){
    let getUserReisen
    try {
        getUserReisen= await Reise.find({"uid": req.params.uid})
        if (getUserReisen == null){
            return res.status(404).json({message: 'Cannot find reise for User'})
        }
    }catch (error){
        return res.status(500).json({message: error.message})
    }

    res.userReisen = getUserReisen
    next()
}

async function getReise(req, res, next){
    let reise
    try {
        reise = await Reise.findById(req.params.id)
        if (reise == null){
            return res.status(404).json({message: 'Cannot find reise'})
        }
        if (reise.uid!=req.params.uid){
            return res.status(400).json({message: 'no Access to this Ressource'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

    res.reise = reise
    next()
}

module.exports = router