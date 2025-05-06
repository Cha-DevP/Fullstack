import express from 'express';
import updateUser, { deleteUser, getUser, getUsers } from '../controller/user.controller.js';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controller/product.controller.js';
import { createSellProduct, deleteSellProduct, getSellProduct, getSellProducts, updateSellProduct } from '../controller/sell.controller.js';
import { Login, register } from '../controller/auth.controller.js';
import { verifyJWT } from '../middleware/jwt.js';
import { uploadeFile } from '../controller/upload.controller.js';

const route = express.Router();
//login
route.post("/login", Login);

//userall
route.get('/get-users', verifyJWT, getUsers);

//user one
route.get('/get-user/:id', verifyJWT, getUser);

route.post('/register/user', register);
route.put('/update/user/:id', verifyJWT, updateUser);
route.delete("/delete-user", verifyJWT, deleteUser);


///products
route.get('/get-products', verifyJWT, getProducts);
route.get('/get-product/:id', verifyJWT, getProduct);
route.post('/create/product', verifyJWT, createProduct);
route.put('/update/product/:id', verifyJWT, updateProduct);
route.delete("/delete-product/:id", verifyJWT, deleteProduct);

////Sell products
route.get('/get-sell/products', verifyJWT, getSellProducts);
route.get('/get-sell/product/:id', verifyJWT, getSellProduct);
route.post('/create-sell/product', verifyJWT, createSellProduct);
route.put('/update-sell/product/:id', verifyJWT, updateSellProduct);
route.delete("/delete-sell/product/:id", verifyJWT, deleteSellProduct);

///upload file
route.post('/upload/file', verifyJWT, uploadeFile);

export default route;