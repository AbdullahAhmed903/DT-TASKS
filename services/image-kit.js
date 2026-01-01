import ImageKit from "imagekit";
import CONFIG from "../config/config.js";



const imagekitUploding = new ImageKit({
    publicKey : CONFIG.IMAGE_KIT_PUBLIC_KEY,
    privateKey : CONFIG.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint : CONFIG.IMAGE_KIT_URL_ENDPOINT
})


export default imagekitUploding;