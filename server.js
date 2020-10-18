let mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

let app = require("./app");

let DB =
  "mongodb+srv://smorfarms:Wizard@07@cluster0.ogo6b.mongodb.net/smorfarm-crop-management?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("=============================================");
    console.log("| Connected to Smorfarms Crop Management DB |");
    console.log("=============================================");
  });

let port = process.env.PORT || 3000;

//START SERVER
const server = app.listen(port, () => {
  console.log("==================================");
  console.log(`| Server running on port ${port} |`);
  console.log("==================================");
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
