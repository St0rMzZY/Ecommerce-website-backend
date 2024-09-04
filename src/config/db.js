const mongoose = require("mongoose")

const mongodbUrl="mongodb+srv://aditya:XL7Xqz1hUkKiZ6Rt@cluster0.zcpoplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb=()=>{
    return mongoose.connect(mongodbUrl);
}

module.exports={connectDb}

