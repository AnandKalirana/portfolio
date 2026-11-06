import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error("Usage: node scripts/hash-password.mjs <password (10+ chars)>");
  process.exit(1);
}
const hash = bcrypt.hashSync(pw, 12);
console.log("\nVercel / production env value:\n" + hash);
console.log("\n.env.local value (dollar signs escaped):\n" + hash.replace(/\$/g, "\\$") + "\n");
