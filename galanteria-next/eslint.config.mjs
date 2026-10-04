import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,

  {
    rules: {
      /**
       * `react-hooks/set-state-in-effect` is a React-Compiler-era rule that
       * fires on any synchronous `setState` inside an effect body. Every hit in
       * this project is one of three deliberate patterns:
       *
       *   - load-on-mount in the admin screens and the category browser
       *     (`setLoading(true)` before an awaited query);
       *   - the "has mounted" flag the portals need, because `createPortal`
       *     has no DOM to aim at during the server render;
       *   - reading the stored language out of localStorage once, which cannot
       *     happen during render on the server.
       *
       * They are warnings so a genuinely accidental one still stands out,
       * rather than errors that would fail the build for code that is correct.
       */
      "react-hooks/set-state-in-effect": "warn",

      /**
       * Product, project and hero photographs are Supabase Storage URLs that
       * the admin uploader has already compressed and resized (a full image
       * plus a 600px thumbnail, per utils/imageProcessing.js). Sending them
       * through the image optimiser would re-encode work that is already done
       * and bill for it, so those call sites use a plain `<img>` deliberately.
       * `next/image` is still used for the static assets in /public.
       */
      "@next/next/no-img-element": "off",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
