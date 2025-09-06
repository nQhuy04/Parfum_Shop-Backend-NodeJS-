const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');

const routerAPI = express.Router();

routerAPI.all("*", auth);


routerAPI.get("/",(req, res) => {
    return res.status(200).json("Hello world api")
})


routerAPI.post("/register", createUser) //Lưu ý rằng, function này sẽ không có dấu (), nếu như có () tức có nghĩa là ta đang thực thi một function, và nó sẽ thực thi luôn tại file này, thứ mình cần chỉ là gọi gián tiếp function này thôi, và nó sẽ được thực thi bên userController nên ta không cần thêm dấu ()

routerAPI.post("/login", handleLogin)

routerAPI.get("/user", getUser) //dùng GET 

routerAPI.get("/account", getAccount) //dùng GET 


module.exports = routerAPI; //export default