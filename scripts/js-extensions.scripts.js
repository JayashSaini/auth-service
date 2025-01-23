import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the `dist` directory
const distDir = path.resolve(__dirname, "../dist");

function fixImports(dir) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			// Recursively fix imports in subdirectories
			fixImports(filePath);
		} else if (filePath.endsWith(".js")) {
			let content = fs.readFileSync(filePath, "utf-8");

			// Add .js extension ONLY to local imports (e.g., './module' or '../module')
			content = content.replace(
				/(from\s+['"])(\.\/.*?[^.js]|\.{2}\/.*?[^.js])(['"])/g,
				(match, p1, p2, p3) => {
					// Ensure we're adding .js only when it's not already added
					const fixedPath = p2.endsWith(".js") ? p2 : `${p2}.js`;
					return `${p1}${fixedPath}${p3}`;
				}
			);

			fs.writeFileSync(filePath, content, "utf-8");
		}
	});
}

fixImports(distDir);
console.log("✅ All imports updated with .js extensions for local files!");
