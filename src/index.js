require('dotenv').config()
const { app } = require("./app");
const connectDB = require("./db/connection")
let server;
let API_PORT = process.env.PORT_NO;
const init = async () => {
	try {
		await connectDB(process.env.MONGODB_URL)
		server = app.listen(API_PORT, () =>
			console.log(`Listening on PORT ${API_PORT}`)
		);	
	} catch (error) {
		console.log(`ERROR: ${error}`)
	}
};

const exitHandler = () => {
	if (server) {
		server.close(() => {
			console.log("Server Closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	console.log(`unexpected error: ${error}`);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
	console.log("SIGTERM Received");
	if (server) {
		server.close();
	}
});

init();
