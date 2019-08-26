const express = require('express');
const User = require('../models/User');
const Trainer = require('../models/trainer');
const jwt = require('jsonwebtoken');
const authconfig = require('../../config/auth');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authconfig.secret,{
        expiresIn: 86400,        
    });
}


router.post('/register', async (req, res) => {

    const { email } = req.body;

    try{

        if(await User.findOne({ email })){
            return res.status(400).send({ error: 'User already exists'});
        }

        const user = await User.create(req.body);

        //retirar visualização do password do retorno da gravação
        user.password = undefined;

        const { certificationNumber } = req.body;

        if (certificationNumber){
            const trainer = await Trainer.create({certificationNumber, user: user._id});                
        }        

        return res.send({ user,
            token : generateToken({ id: user.id })
        });

       // return res.status(200).send({ sucesso: user });
        
    } catch (err) {
        return res.status(400).send({ error: 'Registration  failed'});
    }
});



router.get('/', async (req, res) => {
    try{

        const trainers = await Trainer.find().populate(['user']);

        return res.send({ trainers });

    } catch (err) {

        return res.status(400).send({ error: 'Error Loading Trainers' });

    }
});


module.exports = app => app.use('/trainer', router);