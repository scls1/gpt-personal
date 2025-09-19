import Chat from "../models/Chat.js";

export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }

        await Chat.create(chatData);
        res.json({
            ok: true,
            message: "Chat created"
        });
    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
}

export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({userId}).sort({updatedAt: -1});
        
        res.json({
            ok: true,
            chats
        })
    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
}
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const {chatId} = req.body.id;
        await Chat.deleteOne({_id: chatId, userId});
        
        res.json({
            ok: true,
            message: "Chat deleted"
        })
    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
}
