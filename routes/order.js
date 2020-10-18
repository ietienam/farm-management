let express = require("express");
let router = express.Router();

let orderController = require("../controller/orderController");

router.route("/create").post(orderController.create_order);
router.route("/transit/:order_id").patch(orderController.confirm_transit);
router.route("/deliver/:order_id").patch(orderController.confirm_delivery);
router.route("/fail/:order_id").patch(orderController.confirm_failure);
router.route("/request").get(orderController.all_orders);
router.route("/transit").get(orderController.all_orders_in_transit);
router.route("/deliver").get(orderController.all_orders_delivered);
router.route("/fail").get(orderController.all_orders_failed);

module.exports = router;
