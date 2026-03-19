/**
 * expo export 후 dist/index.html에 PWA 링크 + 첫 로드 스플래시(SplashImage) 주입
 * 사용: node scripts/patch-web-html.js <distDir>
 */
const fs = require("fs");
const path = require("path");

const distArg = process.argv[2] || "dist";
const distDir = path.isAbsolute(distArg)
  ? distArg
  : path.join(__dirname, "..", distArg);
const indexPath = path.join(distDir, "index.html");

const headInject = `
<link rel="manifest" href="./manifest.json" />
<link rel="apple-touch-icon" href="./AppIcon.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="시즈오카 여행 플래너" />
`;

const splashBlock = `
<style id="expo-static-splash-style">
#expo-static-splash {
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}
#expo-static-splash img {
  max-width: 92%;
  max-height: 92%;
  width: auto;
  height: auto;
  object-fit: contain;
}
#expo-static-splash.expo-static-splash--hide {
  display: none;
}
</style>
<div id="expo-static-splash" aria-hidden="true">
  <img src="./SplashImage.png" alt="" width="512" height="512" decoding="async" />
</div>
<script>
(function () {
  function hideSplash() {
    var el = document.getElementById("expo-static-splash");
    if (el) el.classList.add("expo-static-splash--hide");
  }
  window.addEventListener("load", function () {
    setTimeout(hideSplash, 80);
  });
})();
</script>
`;

function main() {
  if (!fs.existsSync(indexPath)) {
    console.error("[patch-web-html] index.html not found:", indexPath);
    process.exit(1);
  }
  let html = fs.readFileSync(indexPath, "utf8");

  if (html.includes('rel="manifest"')) {
    console.log("[patch-web-html] already patched, skip");
    return;
  }

  html = html.replace(
    /<link rel="icon"[^>]*>/i,
    `<link rel="icon" type="image/png" href="./AppIcon.png" />
${headInject.trim()}
`,
  );

  if (!html.includes('rel="manifest"')) {
    html = html.replace("</head>", `${headInject.trim()}\n</head>`);
  }

  html = html.replace(
    /<div id="root"><\/div>/,
    `${splashBlock.trim()}\n    <div id="root"></div>`,
  );

  fs.writeFileSync(indexPath, html, "utf8");
  console.log("[patch-web-html] updated:", indexPath);
}

main();
