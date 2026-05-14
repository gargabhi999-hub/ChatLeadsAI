const Tesseract = require("tesseract.js");

async function extractText(imagePath) {
  try {
    const result = await Tesseract.recognize(imagePath, "eng");
    return result.data.text;
  } catch (err) {
    console.error("OCR Error:", err.message);
    return "";
  }
}

/**
 * Basic local email extraction if needed before sending to AI
 */
function extractEmails(text) {
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig;
  return text.match(emailRegex) || [];
}

module.exports = { extractText, extractEmails };
