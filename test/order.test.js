const request = require("supertest");
const app = require("../server");
describe("Order Endpoints", () => {
  it("should create a new order", async () => {
    const res = await request(app).post("/api/v1/orders/create").send({
      crop: "cassava",
      cost: 45777,
      seller: "ini",
      seller_contact: 2348107139594,
      seller_address: "oron",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("post");
  });
});
