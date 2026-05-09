const express = require("express");
const app = express();
app.use(express.json());

const WHOP_API_KEY = process.env.WHOP_API_KEY;
const WHOP_COMPANY_ID = "biz_LMcM6VGPWw0wfG";

app.get("/", (req, res) => res.send("Running"));

app.post("/charge", async (req, res) => {
  console.log("Body received:", JSON.stringify(req.body));
  const member_id = req.body.member_id;
  const payment_method_id = req.body.payment_method_id;
  const amount = req.body.amount || 1;

  const response = await fetch("https://api.whop.com/api/v5/payments", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${WHOP_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      company_id: WHOP_COMPANY_ID,
      member_id: member_id,
      payment_method_id: payment_method_id,
      plan: {
        currency: "usd",
        initial_price: amount,
        plan_type: "one_time"
      }
    })
  });

  const data = await response.json();
  console.log("Whop response:", JSON.stringify(data));
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port " + PORT));
