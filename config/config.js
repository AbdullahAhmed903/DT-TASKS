import dotenv from 'dotenv';
dotenv.config();


let CONFIG={}


CONFIG.PORT=process.env.PORT
CONFIG.BASEURL=process.env.BASEURL
CONFIG.MONGODB_URI=process.env.MONGODB_URI



CONFIG.IMAGE_KIT_PUBLIC_KEY = process.env.IMAGE_KIT_PUBLIC_KEY;
CONFIG.IMAGE_KIT_PRIVATE_KEY = process.env.IMAGE_KIT_PRIVATE_KEY;
CONFIG.IMAGE_KIT_URL_ENDPOINT = process.env.IMAGE_KIT_URL_ENDPOINT;














export default CONFIG