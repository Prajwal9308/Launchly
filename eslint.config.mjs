import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Icon system: Lucide only, and only through the registry in components/ui/icons.tsx
  // (one icon per concept, consistent size and stroke). See .claude/skills/icon-system.
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["components/ui/icons.tsx"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lucide-react",
              message: "Import icons from @/components/ui/icons (Icons.<concept>) instead of lucide-react.",
              allowTypeImports: true,
            },
          ],
          patterns: [
            {
              group: ["react-icons", "react-icons/*", "@heroicons/*", "@fortawesome/*", "@radix-ui/react-icons", "@tabler/icons-react", "@phosphor-icons/*", "phosphor-react", "react-feather", "@iconify/*"],
              message: "CoreGravity uses Lucide only. Add the icon to @/components/ui/icons instead.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
