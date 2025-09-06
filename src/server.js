require('dotenv').config();
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');
const cors = require('cors');//CORS
const { get } = require('mongoose');

const app = express();//ExpressJS
const port = process.env.PORT || 8888;

//Ta viết CORS ngay sau Express
//config cors
app.use(cors());// sau đó lỗi CORS sẽ hết

//config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

//config template engine
configViewEngine(app);

const webAPI = express.Router();
webAPI.get("/", getHomepage)


//khai báo route
app.use('/', webAPI);

app.use('/v1/api/', apiRoutes);




//Kết nối đến database
(async () => { 
    try {
        //using mongoose, là nơi kết nối đến đường link url của db trong .env
        await connection();

        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`)
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
