const express = require("express");
const app = express();
app.use(express.json());

const WHOP_API_KEY = process.env.WHOP_API_KEY;
const WHOP_COMPANY_ID = "biz_LMcM6VGPWw0wfG";

app.get("/", (req, res) => res.send("Running ✅"));

app.post("/charge", async (req, res) => {
  const { member_id, payment_method_id, amount } = req.body;
  if (!member_id || !payment_method_id) {
    return res.status(400).json({ error: "Missing member_id or payment_method_id" });
  }
  const response = await fetch("https://api.whop.com/api/v5/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHOP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_id: WHOP_COMPANY_ID,
      member_id,
      payment_method_id,
      plan: { currency: "usd", initial_price: amount || 1.00, plan_type: "one_time" },
    }),
  });
  const data = await response.json();
  console.log("Payment result:", JSON.stringify(data));
  res.status(200).json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
