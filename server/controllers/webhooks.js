import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded":{
                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });

                const session = sessionList.data[0];
                const {transactionId, appId} = session.metadata;

                if(appId ==='personalgpt'){
                    const transaction = await Transaction.findOne({_id:transactionId, idPaid: false});

                    //Update credits in user account
                    await User.updateOne({_id:transaction.userId}, {$inc: {credits: transaction.credits}});
                    
                    transaction.isPaid = true;
                    await transaction.save();
                }else{
                    return res.json({ok:true, message:"Ignored event: Invalid app"});
                }
                break;
            }
                
        
            default:
                console.log("Unhandled event type:", event.type);
                break;
        }
        res.json({ok:true});
    } catch (error) {
        console.error("Webhook processing error:", error);
        response.status(500).send("Internal Server Error");
    }
}