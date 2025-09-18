import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        mongoose.connection.on('connected', () => console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/personalgpt`);
    }catch(err){
        console.error('Database connection error:', err.message);
    }
}

export default connectDB;