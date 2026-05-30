const axios = require("axios");

const WAIFU_PICS = "https://api.waifu.pics/sfw";
const NEKOS_BEST = "https://nekos.best/api/v2";

// Map waifu.pics types to nekos.best equivalents
const nekosFallbackMap = {
  hug: "hug",
  kiss: "kiss",
  waifu: "waifu",
  pat: "pat",
  wave: "wave",
  bite: "bite",
  blush: "blush",
  cry: "cry",
  dance: "dance",
  laugh: "laugh",
  poke: "poke",
  slap: "slap",
  smile: "smile",
};

async function getAction(type) {
  // Try waifu.pics first
  try {
    const res = await axios.get(`${WAIFU_PICS}/${type}`, {
      timeout: 5000
    });
    if (res.data?.url) return res.data.url;
  } catch (err) {
    console.log(`waifu.pics failed for "${type}", trying nekos.best...`);
  }

  // Fallback to nekos.best
  try {
    const nekosType = nekosFallbackMap[type] || "hug";
    const res = await axios.get(`${NEKOS_BEST}/${nekosType}`, {
      timeout: 5000
    });
    // nekos.best returns { results: [{ url, ... }] }
    const url = res.data?.results?.[0]?.url;
    if (url) return url;
  } catch (err) {
    console.error(`nekos.best also failed for "${type}":`, err.message);
  }

  return null; // Both APIs failed
}

module.exports = { getAction };
