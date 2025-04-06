const express = require('express');
const zod = require('zod');
const User = require('../db')
const router = express.Router();
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware')



const signupSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    username: zod.string().email(),
    password: zod.string() 

})

router.post('/signup', async (req,res) => {
    const { success } = signupSchema.safeParse(req.body)

    if(!success) {
        return res.status(401).json({
            massage: "Email already taken/ incorrect input"
        })
    }

    const userExist = await user.findOne({
        username: req.body.username
    })

    if(!userExist) {
        return res.status(401).json({
            massage: "Email already taken / incorrect input"
        })
    }

    const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,

    })

    const userid = User._id

    await User.Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({userid}, JWT_SECRET)

    res.json({
        massage: "User created successfully",
        token: token
    })
})


const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }


    res.status(411).json({
        message: "Error while logging in"
    })
})


const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put('/update', authMiddleware, async (req,res) =>{
    const {success} = updateBody.safeParse(req.body)

    if(!success) {
        res.status(411).json({
            massage: "error while updating information"
        })
    }

    await User.updateOne({
        _id: req.userId
    }, req.body)

    res.json({
        massage: "Update Successfully"
    })

})


router.get('/bulk', async (req,res) => {
    const filter = req.query.filter || ''

    const users = await User.find({
        $or: [{
            firstName: {
                '$regex': filter
            }
        },{
            lastName: {
                '$regex': filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
    
        }))
    })
})





module.exports = router;