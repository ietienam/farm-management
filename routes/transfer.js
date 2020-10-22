let express = require("express");
let router = express.Router();

let transferController = require("../controller/transferController");

router.route("/create/:order_id").post(transferController.create_transfer);
router.route("/transit/:transfer_id").patch(transferController.confirm_transit);
router
  .route("/deliver/:transfer_id")
  .patch(transferController.confirm_delivery);
router.route("/fail/:transfer_id").patch(transferController.confirm_failure);
router.route("/request").get(transferController.all_active_transfer_requests);
router.route("/transit").get(transferController.all_transfers_in_transit);
router.route("/deliver").get(transferController.all_transfers_delivered);
router.route("/fail").get(transferController.all_transfers_failed);

module.exports = router;
