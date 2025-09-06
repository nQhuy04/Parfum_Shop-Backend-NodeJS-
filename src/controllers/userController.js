const { createUserService, loginService, getUserService } = require("../services/userService");


//Lấy data
const createUser = async (req, res) => {

    const { name, email, password } = req.body;
    //ta gọi function tạo mới người dùng ở bên userService tại đây
    //đẩy qua service để nó tạo data cho chúng ta
    const data = await createUserService(name, email, password)
    return res.status(200).json(data)// trả data về phía frontend
}

//Lấy data
const getUser = async (req, res) => {

    const data = await getUserService();
    return res.status(200).json(data)// trả data về phía frontend
}

const getAccount = async (req, res) => {

    return res.status(200).json(req.user)// trả data về phía frontend
}


const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data)// trả data về phía frontend, data được xử lý và được lấy ra từ loginService
}


//Không sử dụng default vì ta cần xuất ra nhiều function hơn là 1 cái
module.exports = {
    createUser, handleLogin, getUser, getAccount

}