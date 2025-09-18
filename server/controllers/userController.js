import User from "../models/User.js";
import jwt from "jsonwebtoken";



const generateToken = (id)=> {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'});
}


// API to register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({email});

        if(userExists) {
            return res.json({
                ok: false,
                message: 'User already exists'
            });
        }

        const user = await User.create({name, email, password});

        const token = generateToken(user._id);
        res.json({
            ok: true,
            token,
        })
    }catch (error) {    
        res.json({
            ok: false,
            message: error.message
        })
    }
}

// API to login user
export const loginUser = async (req,res) => {
    const { email, password } = req.body;

    try{
        const userExists = User.findOne({email});
        if(userExists){
            const isMatch = await bcrypt.compare(password, userExists.password)
            if(isMatch){
                const token = generateToken(userExists._id);
                return res.json({ok: true,token})
            }
        }
        res.json({
            ok:false,
            message: 'email or password incorrect'
        });

    }catch(error){
        res.json({
            ok: false,
            message: error.message
        })
    }
}

// API to get user data
export const getUser = async (req,res) => {
    try {
        const user = req.user;
        return res.json({
            ok: true,
            user
        })
    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
} 
