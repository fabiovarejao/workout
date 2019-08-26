const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const Trainer = require('../models/trainer');

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


router.post('/authenticate', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user)
        return res.status(400).send({error: 'User not found'});

    if(!await bcrypt.compare(password,user.password))
        return res.status(400).send({error: 'Invalid password'});

    user.password = undefined;        

    res.send({ user, 
        token : generateToken({ id: user.id }) 
    });
});

router.post('/forgot_password', async (req, res) => {

    const { email } = req.body;

    try{

        const user = await User.findOne({ email });

        if(!user)
            return res.status(400).send({ error: 'User not found'});

        //gerar um token para que a recuperacao de senha saiba quem tem permissão.

        const token = crypto.randomBytes(20).toString('hex');

        //adicionando tempo de expiração do token
        const now = new Date();
        now.setHours(now.getHours() + 1);

        //alterar usuario, incluindo token
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'fabiovarejao@hotmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err)
                return res.status(400).send( { error : 'Cannot send forgot password' });
            
            return res.send();
        }

        );

    } catch (err) {

        res.status(400).send( { error : 'Error on forgot password, try again' });
    }

});

router.post('/reset_password', async (req, res) => {

    const { email, token, password } = req.body;

    try{
        const user = await User.findOne({email})
            .select('+passwordResetToken passwordResetExpires');
        
        if(!user)
            return res.status(400).send({error: 'User not found'});

        if(token !== user.passwordResetToken)
            return res.status(400).send({error: 'Token invalid'});
        
        const now = new Date();

        if(now > user.passwordResetExpires)
            return res.status(400).send({error: 'Token expired, generate a new one'});

        user.password = password;

        await user.save();

        res.send();

    } catch (err){
        res.status(400).send( { error : 'Cannot resete password, try again' });
    }

});


module.exports = app => app.use('/auth', router);

