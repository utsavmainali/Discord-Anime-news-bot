const { createCanvas, loadImage } = require("canvas");

async function generateRankCard(user, level, xp, rank = null) {
  const canvas = createCanvas(1000, 320);
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;

  const nextLevelXP = level * 100;
  const progress = Math.min(xp / nextLevelXP, 1);

  // =========================
  // BACKGROUND (dark gradient)
  // =========================
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#0b0f1a");
  bg.addColorStop(1, "#1b1f35");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // soft glow blobs
  function glow(x, y, color) {
    const g = ctx.createRadialGradient(x, y, 10, x, y, 180);
    g.addColorStop(0, color);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  glow(200, 100, "rgba(108,99,255,0.25)");
  glow(800, 200, "rgba(0,212,255,0.18)");

  // =========================
  // MAIN GLASS CARD
  // =========================
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  roundRect(ctx, 40, 40, width - 80, height - 80, 25);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.stroke();

  // =========================
  // AVATAR
  // =========================
  const avatar = await loadImage(
    user.displayAvatarURL({
      extension: "png",
      forceStatic: true,
      size: 256
    })
  );

  const ax = 90;
  const ay = 80;
  const size = 160;

  // glowing ring
  ctx.beginPath();
  ctx.arc(ax + 80, ay + 80, 85, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(108,99,255,0.25)";
  ctx.fill();

  // avatar clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(ax + 80, ay + 80, 75, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(avatar, ax, ay, size, size);

  ctx.restore();

  // border ring
  ctx.strokeStyle = "#6c63ff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(ax + 80, ay + 80, 75, 0, Math.PI * 2);
  ctx.stroke();

  // =========================
  // USERNAME
  // =========================
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 40px Sans";
  ctx.fillText(user.username, 280, 120);

  // =========================
  // LEVEL BADGE
  // =========================
  ctx.fillStyle = "#6c63ff";
  roundRect(ctx, 280, 140, 140, 45, 12);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px Sans";
  ctx.fillText(`LEVEL ${level}`, 300, 170);

  // =========================
  // RANK BADGE (optional)
  // =========================
  if (rank !== null) {
    ctx.fillStyle = "#00d4ff";
    roundRect(ctx, 440, 140, 120, 45, 12);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.fillText(`#${rank}`, 470, 170);
  }

  // =========================
  // XP TEXT
  // =========================
  ctx.fillStyle = "#aaa";
  ctx.font = "20px Sans";
  ctx.fillText(
    `${xp} / ${nextLevelXP} XP`,
    280,
    230
  );

  // =========================
  // XP BAR BACKGROUND
  // =========================
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, 280, 250, 620, 22, 12);
  ctx.fill();

  // =========================
  // XP BAR FILL (GLOW)
  // =========================
  const bar = ctx.createLinearGradient(280, 0, 900, 0);
  bar.addColorStop(0, "#6c63ff");
  bar.addColorStop(0.5, "#00d4ff");
  bar.addColorStop(1, "#00ffb3");

  ctx.shadowBlur = 15;
  ctx.shadowColor = "#6c63ff";

  ctx.fillStyle = bar;
  roundRect(ctx, 280, 250, 620 * progress, 22, 12);
  ctx.fill();

  ctx.shadowBlur = 0;

  return canvas.toBuffer("image/png");
}

// =========================
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

module.exports = { generateRankCard };