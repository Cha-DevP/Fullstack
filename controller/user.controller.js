import dbExecute from '../db/dbContext.js';
import bcrypt from "bcrypt";

///Arrow function
export const getUsers = async (req, res) => {
    let filter = "";
    try {
        console.log(req)
        
        const search = req.query?.search;

        if(search){
            filter= ` AND (username LIKE '%${search}%' OR role LIKE '%${search}%')`
        }

        const sql = "SELECT * FROM tbusers WHERE 1 "+filter;
        const params = [];

        const data = await dbExecute(sql, params);

        if(!data){
            return res.status(422).json({ message: "Not found data" });
        }

        return res.status(200).json({ data: data });

    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" });
    }
}

///Arrow function
export const getUser = async (req, res) => {
    const { id } = req.params;//const id = req.params.id;

    ///validate id must not null or empty
    if(!id){
        return res.status(422).json({statusCode: 422, message: "Not found Id"})
    }

    try {
        
        const sql = "SELECT * FROM tbusers WHERE id=?";
        const params = [id];

        const data = await dbExecute(sql, params);

        if(!data || data?.length === 0){
            return res.status(422).json({ message: "Not found data" });
        }

        return res.status(200).json({ data: data });

    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" });
    }
}


// ///Arrow function
// export const createUser = async(rq, rs) => {
//     const { username, password, role } = rq.body;//const username = rq.body.username;

//     //// Validate data or validation data
//     if(!username || !password || !role){
//         return res.status(422).json({statusCode: 422, message: "Parameter empty!" });
//     }

//     try {

//         const sql = "INSERT INTO tbusers(username, password, role) VALUES(?,?,?)";
//         const params = [username, password, role];

//         const data = await dbExecute(sql, params);

//         //data = undefined | null | '' | 0 | empty | false

//         if(!data){
//             return rs.status(422).json({statusCode: 422, message: "Create user failed" });
//         }

//         return rs.status(201).json({statusCode: 201, message: "Create user success" });
        
//     } catch (error) {
//         return rs.status(500).json({ message: "server error" });
//     }
// }


export const deleteUser = async(request, response) => {
    const id = request.query?.id;

    if(!id){
        return rs.status(422).json({statusCode: 422, message: "Data is empty"});
    }

    try {
        const data = await dbExecute(
            'DELETE FROM tbusers WHERE id=?',
            [id]
        );


        if(!data){
            return response.status(422).json({statusCode: 422, message: "Delete user failed" });
        }

        if(data?.affectedRows < 1){
            return response.status(422).json({statusCode: 422, message: "Not found user to delete" });
        }

        return response.status(200).json({statusCode: 200, message: "Delete user success" });

    } catch (error) {
        console.log(error)
        return response.status(500).json({statusCode: 500, message:"Delete data error"});
    }
}

//regular function
async function updateUser(rq, rs) {
    const {username, password, role} = rq.body;
    const {id} = rq.params; //const id = rq.params.id, request.query?.id;

    if(!id || !username || !password || !role){
        rs.status(422).json({statusCode: 422, message: "Data is empty"});
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


                await dbExecute(
                    'UPDATE tbusers SET username=?, password=?, role=?, createdBy=? WHERE id=?',
                    [username, newPassword, role,rq.id, id]
                ).then((data)=>{
                    if(!data){
                       return rs.status(422).json({statusCode: 422, message:"Can not update data"});
                    }
                    //data.affectedRows
                    if(data?.affectedRows < 1){
                       return rs.status(422).json({statusCode: 422, message:"Not found data to update"});
                    }
            
                    return rs.status(200).json({statusCode: 200, message:'Update success'})
                }).catch((err)=>{
                    return rs.status(500).json({statusCode: 500, message:"Update data error"});
                });
            });
        });
 
    } catch (error) {
        return rs.status(500).json({ message: "server error" });
    }

}

export default updateUser;