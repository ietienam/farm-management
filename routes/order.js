let express = require("express");
let router = express.Router();

let orderController = require("../controller/orderController");

router.route("/create").post(orderController.create_order);
router.route("/deliver/:order_id").patch(orderController.confirm_delivery);

module.exports = router;
