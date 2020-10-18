const mongoose = require("mongoose");
const Order = require("../model/orders");

const DB =
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

const deleteData = async () => {
  try {
    await Order.deleteMany();
    console.log("Data sucessfully deleted!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//RUN IN TERMINAL TO IMPORT TO DB node dev-data/data/import-dev-data.js --import
//RUN IN TERMINAL TO DELETE FROM DB node dev-data/data/import-dev-data.js --delete

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
