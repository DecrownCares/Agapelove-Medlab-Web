const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


router.get("/services", (req, res) => {
  const jsonDataPath = path.join(__dirname, "..", "data", "tests.json");
  const rawData = fs.readFileSync(jsonDataPath);
  const data = JSON.parse(rawData);

  res.render("serviceView", { categories: data.categories });
});

router.get("/test-details/:id", (req, res) => {
  const testId = req.params.id;
  const jsonDataPath = path.join(__dirname, "..", "data", "tests.json");
  const rawData = fs.readFileSync(jsonDataPath);
  const data = JSON.parse(rawData);

  // Find the test and its category
  const category = data.categories.find(cat =>
    cat.tests.some(test => test.id === testId)
  );

  if (!category) return res.status(404).send("Test category not found");

  const test = category.tests.find(test => test.id === testId);
  if (!test) return res.status(404).send("Test not found");

  res.render("test-details", { test, category });
});

module.exports = router;
