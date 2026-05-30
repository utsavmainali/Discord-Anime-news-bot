const axios = require("axios");

const BASE_URL = "https://api.waifu.pics/sfw";

async function getAction(type) {
  try {
    const res = await axios.get(`${BASE_URL}/${type}`, {
      timeout: 5000
    });

    if (res.data?.url) return res.data.url;
  } catch (err) {
    console.log("Waifu API failed, retrying...");

    try {
      const res2 = await axios.get(`${BASE_URL}/${type}`, {
        timeout: 5000
      });

      return res2.data?.url || null;
    } catch (err2) {
      console.error("Waifu API fully failed:", err2.message);
      return null;
    }
  }
}

module.exports = { getAction };