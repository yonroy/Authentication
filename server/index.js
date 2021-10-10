import express from 'express';
import cors from 'cors';
import mongoose  from 'mongoose';
import model from './models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/Authentication')

app.get('/hello',(req,res)=>{
    res.send('hello world')
})

app.post('/api/register',async (req,res)=>{
    console.log(req.body)
    try{
        const newPassword = await bcrypt.hash(req.body.password,10)
        await model.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({status: 'ok'}) 
    }
    catch(err){
        res.json({status: 'error', error: 'Duplicate email'})
    }
})
app.post('/api/login', async (req,res)=>{
    try{
        const user = await model.findOne({
            email: req.body.email,
        })
        if(!user){
            return res.json({status: 'error', error:'Invalid login'})
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

        if(isPasswordValid){
            const token = jwt.sign(
                {
                    name:user.name,
                    email:user.email,
                },
                'secret123'
            )
            return res.json({status: 'ok', user: token})
        }
        else{
            return res.json({status:'error', user: false })
        }
    }
    catch(err){
        return res.json({status: 'error', error: err})
    }
})
app.get('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await model.findOne({ email: email })
        if(user){
            return res.json({ status: 'ok', quote: user.quote })
        }
		else{
            return res.json({ status: 'error', quote: false })
        }
	} catch (error) {
		res.json({ status: 'error', error: 'invalid token' }) //
	}
})

app.post('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await model.updateOne(
			{ email: email },
			{ $set: { quote: req.body.quote } }
		)
		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})
app.listen(5000,()=>{
    console.log('Server started on 5000')
})