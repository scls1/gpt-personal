import imagekit from "../configs/imagekit.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";


export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
         if(req.user.credits < 1){
            return res.json({ok: false, message: "You don't have enough credits to use this feature"})
        }

        const {chatId, prompt} = req.body; 

        const chat = await Chat.findOne({_id: chatId, userId});
        chat.messages.push({role: "user", content: prompt, timestamp: Date.now(), isImage: false});

        const {choices} = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [{role: "user",content: prompt}],
        });

        const reply = {...choices[0].message, timestamp: Date.now(), isImage:false}
        res.json({
            ok:true,
            reply
        })
        
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({_id: userId}, {$inc: {credits:-1}});


    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
}

export const imageMessageController = async (req,res) =>{
    try {
        const userId = req.user._id;
        if(req.user.credits < 2){
            return res.json({ok: false, message: "You don't have enough credits to use this feature"})
        }

        const {prompt, chatId, isPublished} = req.body;
        const chat = await Chat.findOne({_id: chatId, userId});

        chat.messages.push({
            role: "user",
            content: prompt, 
            timestamp: Date.now(), 
            isImage: false
        });

        //encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        //contruct imagekit ai generation url
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/${Date.now()}.png?tr=w-800,h-800`;
        
        //trigger generation by fetching form imagekit
        const aiImageResponse = await axios.get(generatedImageUrl, {responseType: "arraybuffer"});
        
        //convert to base64
        const base64image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`;

        // uload to imagekit media library
        const uploadResponse = await imagekit.upload({
            file: base64image,
            fileName: `${Date.now()}.png`,
            folder: "personalgpt"  
        });

        const reply = {
            role: 'assistant',
            content: uploadResponse.url, 
            timestamp: Date.now(), 
            isImage: true,
            isPublished
        }
        res.json({
            ok:true,
            reply
        })

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({_id: userId}, {$inc: {credits:-2}});

    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
}