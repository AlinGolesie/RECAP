const express = require("express");
const cors = require("cors");
const scanRoutes = require("./routes/scanRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", scanRoutes);
app.use("/api", requestRoutes);

app.get("/", (req, res) => {
  res.send("RECAP backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RECAP backend running on port ${PORT}`);
});
