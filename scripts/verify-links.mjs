import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const DIST_ROOT = resolve(process.cwd(), 'dist');
const HTML_ATTRIBUTE_PATTERN = /<(a|link|script|img)\b[^>]*\s(?:href|src)=["']([^"'#]+(?:#[^"']*)?)["'][^>]*>/gi;
const IGNORED_PROTOCOL_PATTERN = /^(?:[a-z]+:|\/\/)/i;

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const nextPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(nextPath);
      }

      return entry.isFile() ? [nextPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function getHtmlFiles(directory) {
  return walkFiles(directory).filter((filePath) => extname(filePath) === '.html');
}

function toPagePath(filePath) {
  const relativePath = relative(DIST_ROOT, filePath).replaceAll('\\', '/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'/index.html'.length)}/`;
  }

  return `/${relativePath}`;
}

function isInternalReference(reference) {
  return reference && !reference.startsWith('#') && !IGNORED_PROTOCOL_PATTERN.test(reference);
}

function stripSearchAndHash(reference) {
  return reference.split('#')[0]?.split('?')[0] ?? reference;
}

function resolveInternalPath(fromPagePath, reference) {
  const currentUrl = new URL(fromPagePath, 'http://localhost');
  const resolvedUrl = new URL(reference, currentUrl);
  const pathname = decodeURIComponent(resolvedUrl.pathname);

  if (pathname === '/') {
    return [join(DIST_ROOT, 'index.html')];
  }

  const trimmedPath = pathname.replace(/^\/+/, '');
  const directPath = join(DIST_ROOT, trimmedPath);

  if (pathname.endsWith('/')) {
    return [join(DIST_ROOT, trimmedPath, 'index.html')];
  }

  if (extname(trimmedPath)) {
    return [directPath];
  }

  return [directPath, `${directPath}.html`, join(DIST_ROOT, trimmedPath, 'index.html')];
}

function pathExists(filePath) {
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function collectBrokenReferences(htmlFiles) {
  const failures = [];

  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8');
    const pagePath = toPagePath(htmlFile);
    const matches = html.matchAll(HTML_ATTRIBUTE_PATTERN);

    for (const match of matches) {
      const rawReference = match[2] ?? '';
      const reference = stripSearchAndHash(rawReference);

      if (!isInternalReference(reference)) {
        continue;
      }

      const candidatePaths = resolveInternalPath(pagePath, reference);

      if (candidatePaths.some(pathExists)) {
        continue;
      }

      failures.push({
        htmlFile: relative(process.cwd(), htmlFile),
        reference: rawReference,
        checked: candidatePaths.map((candidate) => relative(process.cwd(), candidate))
      });
    }
  }

  return failures;
}

if (!statSync(DIST_ROOT, { throwIfNoEntry: false })) {
  console.error('dist/ does not exist. Run `npm run build` before verifying links.');
  process.exit(1);
}

const htmlFiles = getHtmlFiles(DIST_ROOT);

if (htmlFiles.length === 0) {
  console.error('No built HTML files found in dist/. Run `npm run build` before verifying links.');
  process.exit(1);
}

const failures = collectBrokenReferences(htmlFiles);

if (failures.length > 0) {
  console.error('Broken internal links found in dist/:');

  for (const failure of failures) {
    console.error(`- ${failure.htmlFile}: ${failure.reference}`);
    console.error(`  checked: ${failure.checked.join(', ')}`);
  }

  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML files in dist/: no broken internal links found.`);
