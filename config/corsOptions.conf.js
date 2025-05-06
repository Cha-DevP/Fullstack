import corsMiddleware from 'cors';
import { whiteOrigins } from './whiteOrigins.conf.js';


const corsOptions = {
    origin: (origin, callback) => 
    { 
        console.log("==>", origin)
        
        if(whiteOrigins.indexOf(String(origin)) !== -1 || !origin)
        {
            callback(null, true);
        }
        else
        {
            callback(new Error('No origin allowed by CORS'));
        }
    },

    credentials: true,
}

export const cors = corsMiddleware(corsOptions);