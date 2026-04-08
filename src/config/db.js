import mongoose from "mongoose"


 const connectDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.DB_URL)
        if(connect){
            console.log(`process connect successfully ${connect.connection.host}`);    
        }
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1)
    }
}

export default connectDB