/**
 * PWA / 정적 호스팅용: assets의 아이콘·스플래시를 public으로 복사합니다.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const assetsDir = path.join(root, "assets");
const publicDir = path.join(root, "public");

const pairs = [
  ["AppIcon.png", "AppIcon.png"],
  ["SplashImage.png", "SplashImage.png"],
];

function main() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  for (const [fromName, toName] of pairs) {
    const from = path.join(assetsDir, fromName);
    const to = path.join(publicDir, toName);
    if (!fs.existsSync(from)) {
      console.warn(`[prepare-public-assets] skip (missing): ${fromName}`);
      continue;
    }
    fs.copyFileSync(from, to);
    console.log(`[prepare-public-assets] ${fromName} -> public/${toName}`);
  }
}

main();
