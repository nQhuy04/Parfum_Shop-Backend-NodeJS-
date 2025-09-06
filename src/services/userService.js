require("dotenv").config();
const User = require("../models/user"); //import mogoose, bên models ta xuất ra User nên ta import User
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;


//function để tạo mới một người dùng
const createUserService = async (name, email, password) => {

    //Sử dụng try and catch, để khi trường hợp có lỗi thì sẽ log ra phần lỗi
    try {
        //Check user exist, kiểm tra email xem có trùng hay không
        const user = await User.findOne({email});
        if(user){
            console.log(">>> User Exist, please choose another email");
            return null;
        }
        //Hash user password
        //hashSync là để khi ta không sử dụng await, còn nếu có await thì hash() thôi
        const hashPassword = await bcrypt.hash(password, saltRounds)


        //save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword, //thay vì lưu thẳng password thì lưu hashPassword, bảo mật hơn
            role: "HUYQUANG",
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserService = async () => {

    //Sử dụng try and catch, để khi trường hợp có lỗi thì sẽ log ra phần lỗi
    try {

        let result = await User.find({}).select("-password"); //{} là biến object rỗng, object rỗng có nghĩa là ta sẽ lấy tất cả người dùng, -password là để ta không gửi đi password cho người dùng
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginService = async (emailInput, password) => {


    try {
        //fetch user by email, emailInput là email người dùng nhập vào 
        const user = await User.findOne({ email: emailInput })
        if (user) {
            // Compare password, sử dụng bcrypt
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2, //Error Code
                    EM: "Email/ Password không hợp lệ" //Error Message
                }

            } else {
                //create an access token, tạo ra token để gửi kèm đi ghi đăng nhập thành công
                const payload = {
                    email: user.email,
                    name: user.name
                }
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        //điều kiện cấu hình token này
                        expiresIn: process.env.JWT_EXPIRE//Thời gian hết hạn
                    }
                )
                return {
                    EC: 0,
                    access_token,
                    user: {//Trả data của người dùng để hiển thị thông tin người dùng bên frontend
                        email: user.email,
                        name: user.name,
                    }
                };
            }
        } else {
            return {
                EC: 1, //Error Code
                EM: "Email/ Password không hợp lệ" //Error Message
            }
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}



module.exports = {
    createUserService, loginService, getUserService
}