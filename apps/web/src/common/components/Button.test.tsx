import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Button from './Button';

describe('Button', () => {
  it('renders a spinner and disables itself while loading', () => {
    const html = renderToStaticMarkup(
      <Button isLoading type="submit">
        Submit
      </Button>,
    );

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('disabled');
    expect(html).toContain('role="status"');
  });
});
