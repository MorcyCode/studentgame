import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const studentFolders = ["hank", "mavis", "qiu", "seven", "wang"];

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-student-work-folders",
      apply: "build",
      async closeBundle() {
        const root = process.cwd();
        const outputDir = resolve(root, "dist");

        await mkdir(outputDir, { recursive: true });
        await Promise.all(
          studentFolders.map((folder) =>
            cp(resolve(root, folder), resolve(outputDir, folder), {
              recursive: true,
              force: true,
            }),
          ),
        );
      },
    },
  ],
  resolve: {
    preserveSymlinks: true,
  },
});
