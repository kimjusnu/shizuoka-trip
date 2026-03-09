const fs = require("fs");
const content = fs.readFileSync("./src/data/storyData.js", "utf8");

const arrayMatch = content.match(
  /export const storyData = (\[[\s\S]*?\]);\s*$/,
);
if (!arrayMatch) {
  console.log("Could not find array");
  process.exit(1);
}

const arrStr = arrayMatch[1];
const storyData = eval(arrStr);

const newOrder = [
  "s7",
  "s8",
  "s9",
  "s1",
  "s24",
  "s2",
  "s3",
  "s4",
  "s10",
  "s11",
  "s5",
  "s12",
  "s13",
  "s6",
  "s14",
  "s15",
  "s16",
  "s17",
  "s18",
  "s19",
  "s20",
  "s21",
  "s22",
  "s23",
];

const orderedData = [];
for (const id of newOrder) {
  const item = storyData.find((s) => s.id === id);
  if (item) orderedData.push(item);
}

// Any remaining items?
for (const item of storyData) {
  if (!orderedData.includes(item)) orderedData.push(item);
}

const out =
  "export const storyData = " + JSON.stringify(orderedData, null, 2) + ";\n";
fs.writeFileSync("./src/data/storyData.js", out);
console.log("Order updated!");
