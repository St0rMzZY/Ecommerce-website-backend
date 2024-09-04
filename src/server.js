const app = require("."); // Correct direct import of app
const { connectDb } = require("./config/db");

const PORT = 5000;


const startServer = async () => {
    try {
        await connectDb();
        console.log("Database connected successfully!");

        app.listen(PORT, () => {
            console.log(`E-commerce API listening on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit process with failure
    }
};

startServer();