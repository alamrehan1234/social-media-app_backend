const mongoose = require("mongoose")

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Databse Connection Eshtablished!")
    } catch (err) {
        console.error("Databse Failed to Connect! " + err)
    }
};

module.exports = connection;