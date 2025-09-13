// openapi-codegen.config.ts
import { defineConfig } from "@openapi-codegen/cli";
import {
  generateReactQueryComponents,
  generateSchemaTypes,
} from "@openapi-codegen/typescript";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  codegen: {
    from: {
      source: "url",
      url: "http://localhost:3000/api-json",
      method: "get",
    //   headers: {
    //     Authorization: `Basic ${process.env.DOCS_AUTH_TOKEN}`,
    //   },
    },
    outputDir: "./service",
    to: async (context) => {
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenameCase: "kebab",
        filenamePrefix: "types.",
      });

      await generateReactQueryComponents(context, {
        filenameCase: "kebab",
        filenamePrefix: "queries.",
        useEnums: true,
        schemasFiles,
      });
    },
  },
});
