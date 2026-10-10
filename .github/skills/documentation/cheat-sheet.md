# Writing Cheat Sheets

How to write cheat sheets and guides.

## Code examples

Use fenced code blocks with a language and a `title` attribute showing the file path:

```language title="path/to/file"
// code
```

Highlight relevant lines with `// [!code highlight]`. Use `// [!code highlight:{count}]` to highlight that line and the specified number of following lines:

```ts
console.log('Highlighted'); // [!code highlight]
console.log('Not highlighted');
// [!code highlight:2]
console.log('Highlighted');
console.log('Highlighted');
// [!code highlight]
console.log('Highlighted');
console.log('Not highlighted');
```

## Package manager commands

For an MDX document with package manager commands, import the component at the top of the document:

`import { PackageManagerTabs } from '@theme'`

When the command is equivalent across package managers, render it with:

```md
<PackageManagerTabs command="install @tanstack/react-table@^9" />
```

When commands differ by package manager, provide each command explicitly:

```md
<PackageManagerTabs
command={{
    npm: 'npm create rspress@latest',
    yarn: 'yarn create rspress',
    pnpm: 'pnpm create rspress@latest',
    bun: 'bun create rspress@latest',
    deno: 'deno init --npm rspress@latest',
  }}
/>
```
