interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

type ImportMetaEnv = Record<string, string | undefined>;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
