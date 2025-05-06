import bcrypt from "bcrypt";
import dbExecute from "../db/dbContext.js";
import { genAccessJWT } from "../helper/jwtHelper.js";



///Arrow function
export const register = async(rq, rs) => {
    const { username, password, role } = rq.body;//const username = rq.body.username;

    //// Validate data or validation data
    if(!username || !password || !role){
        return res.status(422).json({statusCode: 422, message: "Parameter empty!" });
    }

    try {

        bcrypt.genSalt(10, (err, salt) => {
            if(err){
                return res.status(400).json({ resultCode: 400, message: "Can not register user" });
            }

            bcrypt.hash(password, salt, async(err, newPassword) => {
                if(err){
                    return res.status(400).json({ resultCode: 400, message: "Can not register user" });
                }


                const sql = "INSERT INTO tbusers(username, password, role) VALUES(?,?,?)";
                const params = [username, newPassword, role];
        
                const data = await dbExecute(sql, params);
        
                //data = undefined | null | '' | 0 | empty | false
        
                if(!data){
                    return rs.status(422).json({statusCode: 422, message: "Create user failed" });
                }
        
                return rs.status(201).json({statusCode: 201, message: "Create user success" });
            });
        });
 
    } catch (error) {
        return rs.status(500).json({ message: "server error" });
    }
}



export const Login = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(422).json({statusCode: 422, message: "Can not login"})
    }

    try {

        const sql = "SELECT * FROM tbusers WHERE username=?";
        const params = [username];

        const data = await dbExecute(sql, params);

        if(!data || data?.length === 0){
            return res.status(422).json({ message: "Not found username" });
        }


        for(const user of data){
            const isValid = bcrypt.compareSync(password, user.password);//True/False

            if(isValid){
            
                const jwtpaylond = {
                    id: user.id,
                    username:user.username,
                    role: user.role          
                }

                const accessToken = genAccessJWT(jwtpaylond);


                return res.status(200).json({
                    statusCode: 200,
                    message: "Login success",
                    accessToken: accessToken,
                    username: user.username
                });
            }
        }

        return res.status(422).json({statusCode: 404, message: "username or password incorrect!" });

    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" });
    }
}