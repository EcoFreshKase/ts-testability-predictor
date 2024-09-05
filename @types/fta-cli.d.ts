declare module "fta-cli" {
  export function runFta(
    projectPath: string,
    options?: { json: boolean }
  ): string;
}
