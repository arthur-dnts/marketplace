// ebooks.js
const mongoose = require("mongoose");

import { renderEbookCharts } from "./chart-ebooks.js";

export function initEbooks() {
  renderEbookCharts();
}
