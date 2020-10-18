let express = require("express");
let router = express.Router();

let transferController = require("../controller/transferController");

router.route("/create/:order_id").post(transferController.create_transfer);
router
  .route("/deliver/:transfer_id")
  .patch(transferController.confirm_delivery);

module.exports = router;
