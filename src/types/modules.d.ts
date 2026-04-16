// HTML imports (via html-loader)
declare module '*.html' {
  const content: string;
  export default content;
}

// SCSS imports (via sass-loader + css-loader)
declare module '*.scss' {
  const content: { toString(): string };
  export default content;
}

// Allow importing version from package.json
declare module '*/package.json' {
  export const version: string;
}
