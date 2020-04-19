const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(
            process.env.DB_CLOUD,
            {useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false });
        console.log('mongoDb: connected')
    }catch (e) {
        console.error(e.message);
        process.exit(1);
    }
};
module.exports = connectDB;
