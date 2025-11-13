const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 5000;
const DATA_FILE = "feedback.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure feedback.json exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// Default route
app.get("/", (req, res) => {
  res.send("Feedback Server Running ✅");
});

// GET all feedbacks
app.get("/api/feedback", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  res.json(data);
});

// POST new feedback
app.post("/api/feedback", (req, res) => {
  const feedbackData = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  data.push(feedbackData);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(200).json({ message: "Feedback submitted successfully!" });
});

// PUT update feedback by index
app.put("/api/feedback/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const updatedFeedback = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  if (index >= 0 && index < data.length) {
    data[index] = updatedFeedback;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Feedback updated successfully!" });
  } else {
    res.status(404).json({ message: "Feedback not found." });
  }
});

// DELETE feedback by index
app.delete("/api/feedback/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  if (index >= 0 && index < data.length) {
    const removed = data.splice(index, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Feedback deleted successfully!", removed });
  } else {
    res.status(404).json({ message: "Feedback not found." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
