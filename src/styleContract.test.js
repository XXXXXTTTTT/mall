import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('global style contract', () => {
  it('does not override Tailwind link color utilities globally', () => {
    const css = readFileSync(resolve('src/index.css'), 'utf-8');

    expect(css).not.toMatch(/a\s*{[^}]*color\s*:\s*inherit/s);
  });
});
