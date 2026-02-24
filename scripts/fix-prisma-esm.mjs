// mkdir -p scripts && cat > scripts/fix-prisma-esm.mjs << 'EOF'
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const dir = "./dist/generated/prisma";

function getAllJsFiles(dirPath) {
  const files = [];
  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...getAllJsFiles(fullPath));
    } else if (extname(entry) === ".js") {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllJsFiles(dir);

for (const filePath of files) {
  let content = readFileSync(filePath, "utf8");
  let changed = false;

  content = content.replace(
    /(from\s+['"])(\.{1,2}\/[^'"]+)(['"'])/g,
    (match, prefix, importPath, suffix) => {
      if (
        importPath.endsWith(".js") ||
        importPath.endsWith(".json") ||
        importPath.endsWith(".mjs") ||
        importPath.startsWith("node:")
      ) {
        return match;
      }
      changed = true;
      return `${prefix}${importPath}.js${suffix}`;
    }
  );

  if (changed) {
    writeFileSync(filePath, content, "utf8");
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`Skipped: ${filePath}`);
  }
}

console.log("Done fixing Prisma ESM imports.");
