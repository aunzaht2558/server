const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://bitoptimabot:Bito95549@bitoptima.c78spff.mongodb.net/?retryWrites=true&w=majority')
        console.log('DB Connected')
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB