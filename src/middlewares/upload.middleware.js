const { join } = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
	destination(req, file, callback) {
		switch (file.fieldname) {
			case "file": {
				callback(null, join(".data", "files"));
				break;
			}
			case "profile": {
				callback(null, join(".data", "profile"));
				break;
			}
			default: {
				callback(null, join(".data", "files"));
				break;
			}
		}
	},
	filename(req, file, callback) {
		const ext = file.mimetype.split("/")[1];
		callback(null, `${file.fieldname}-${uuidv4()}.${ext}`);
	},
});

const memoryStorage = multer.memoryStorage();

const uploadMiddleware = (fieldName) => {
	return multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } }).single(
		fieldName
	);
};

const uploadMultipleMiddleware = (fieldName) => {
	return multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } }).any(
		fieldName
	);
};

const externalUploadMiddleware = (fieldName) => {
	return multer({
		memoryStorage,
		limits: { fieldSize: 25 * 1024 * 1024 },
	}).single(fieldName);
};

const externalUploadMultipleMiddleware = (fieldName) => {
	return multer({ memoryStorage, limits: { fieldSize: 25 * 1024 * 1024 } }).any(
		fieldName
	);
};

module.exports = {
	uploadMiddleware,
	uploadMultipleMiddleware,
	externalUploadMiddleware,
	externalUploadMultipleMiddleware,
};
