
require('dotenv').config();
const mongoose = require('mongoose');

const dbState = [{
    value: 0,
    label: "Disconnected"
},
{
    value: 1,
    label: "Connected"
},
{
    value: 2,
    label: "Connecting"
},
{
    value: 3,
    label: "Disconnecting"
}];


//Đường link kết nối backend
const connection = async () => {
    await mongoose.connect(process.env.MONGO_DB_URL); //chờ mongoose gọi đến tham số MONGO_DB_URL (bên trong file .env)
    const state = Number(mongoose.connection.readyState);
    console.log(dbState.find(f => f.value === state).label, "to database"); // connected to db
}
module.exports = connection;
