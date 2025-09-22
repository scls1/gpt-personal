import Transaction from "../models/Transaction";
import Stripe from 'stripe';

const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

export const getPlans = async (req,res) => {
    try {
        res.json({
            ok: true,
            plans
        })
    } catch (error) {
        res.json({
            ok:false,
            message:error.message
        })
    }
}

export const purchasePlan = async (req, res) => {
    try {
        const {planId} = req.body;
        const userId = req.user._id;

        const plan = plans.find(plan => plan._id === planId);

        if(!plan){
            return res.json({ok:false,message:"Invalid plan"});
        }

        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        })
    } catch (error) {
        res.json({
            ok: true,
            message: error.message
        })
    }
}