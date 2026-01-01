import multer from 'multer';

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif","image/bmp","image/svg","image/tiff"];
const fileMimeTypes = ["application/pdf", "application/msword", "text/plain"];

const myMulter =() => {
    const Storage = multer.memoryStorage();
    function fileFilter(req, file, cb) {
        // Check if the file is an image
        if (imageMimeTypes.includes(file.mimetype)) {
          cb(null, true); // Accept the file
        } else if (fileMimeTypes.includes(file.mimetype)) {
          cb(null, true); // Accept the file
        } else {
          cb("Invalid file format. Only images and PDF files are allowed.", false);
        }
      }

    const upload = multer({
        fileFilter:fileFilter,
        storage: Storage,
        limits: { fileSize: 5 * 1024 * 1024 ,files:5} // 5 MB limit and only 5 files
    });
    return upload;
}

export default myMulter;