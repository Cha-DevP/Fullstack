import dbExecute from '../db/dbContext.js';

///Arrow function
export const getProducts = async (req, res) => {
    let filter = "";

    const {search} = req.query;

    try {
        
        if(search){
             filter = ` AND (name LIKE '%${search}%' OR slug LIKE '%${search}%')`;
        }
           
        const sql = "SELECT * FROM tbproducts WHERE 1 "+ filter;
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
export const getProduct = async (req, res) => {
    const { id } = req.params;

    ///validate id must not null or empty
    if(!id){
        return res.status(422).json({statusCode: 422, message: "Not found Id"})
    }

    try {
        
        const sql = "SELECT * FROM tbproducts WHERE id=?";
        const params = [id];

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
export const createProduct = async(rq, rs) => {
    const { name, description,slug,expired_at,qty,buyPrice,sellPrice,image } = rq.body;

    //// Validate data or validation data
    if(!name || !expired_at || !qty){
        return res.status(422).json({statusCode: 422, message: "Parameter empty!" });
    }

    try {

        const sql = "INSERT INTO tbproducts(name, description,slug,expired_at,qty,buyPrice,sellPrice,image,created_by) VALUES(?,?,?,?,?,?,?,?,?)";
        const params = [name, description,slug,expired_at,qty, buyPrice,sellPrice,image, rq?.id];

        const data = await dbExecute(sql, params);

        //data = undefined | null | '' | 0 | empty | false

        if(!data){
            return rs.status(422).json({statusCode: 422, message: "Create product failed" });
        }

        return rs.status(201).json({statusCode: 201, message: "Create product success" });
        
    } catch (error) {
        return rs.status(500).json({ message: "server error" });
    }
}

export const deleteProduct = async(request, response) => {
    const id = request.params.id;

    if(!id){
        return rs.status(422).json({statusCode: 422, message: "Data is empty"});
    }

    try {
        const data = await dbExecute(
            'DELETE FROM tbproducts WHERE id=?',
            [id]
        );


        if(!data){
            return response.status(422).json({statusCode: 422, message: "Delete product failed" });
        }

        if(data?.affectedRows < 1){
            return response.status(422).json({statusCode: 422, message: "Not found product to delete" });
        }

        return response.status(200).json({statusCode: 200, message: "Delete product success" });

    } catch (error) {
        console.log(error)
        return response.status(500).json({statusCode: 500, message:"Delete data error"});
    }
}

export const updateProduct = async (rq, rs) => {
    const {name, description,slug,expired_at,buyPrice,sellPrice,qty,image} = rq.body;
    const {id} = rq.params;

    //// Validate data or validation data
    if(!name || !expired_at || !qty || !id){
        return res.status(422).json({statusCode: 422, message: "Parameter empty!" });
    }

    try {
        const data = await dbExecute(
            'UPDATE tbproducts SET name=?, description=?,slug=?,expired_at=?,buyPrice=?,sellPrice=?,qty=?,image=?,created_by=? WHERE id=?',
            [name, description,slug,expired_at,buyPrice,sellPrice,qty,image, rq.id, id]
        );
    
        if(!data){
            return rs.status(422).json({statusCode: 422, message:"Can not update data"});
        }

         //data.affectedRows
         if(data?.affectedRows < 1){
            return rs.status(422).json({statusCode: 422, message:"Not found data to update"});
         }
    
        return rs.status(200).json({statusCode: 200, message:'Update success'});

    } catch (error) {
        console.log({error})
        return rs.status(500).json({statusCode: 500, message:"Update data error"});
    }
}