/**
 * Renders the full page content as Markdown for the "Copy Markdown" action.
 * Walks H2/H3 headings + prose + code blocks + token tables from the active DOM.
 */
export function renderPageToMarkdown(
  container: HTMLElement,
  meta: { title: string; subtitle: string; kicker: string },
): string {
  const lines: string[] = [];

  lines.push(`# ${meta.title}`);
  lines.push('');
  lines.push(`> ${meta.subtitle}`);
  lines.push('');

  const nodes = container.querySelectorAll(
    'h2[id], h3[id], p, ul, ol, pre, table, .do-dont-pair',
  );

  for (const node of Array.from(nodes)) {
    const tag = node.tagName.toLowerCase();

    if (tag === 'h2') {
      lines.push('');
      lines.push(`## ${node.textContent?.trim()}`);
      lines.push('');
    } else if (tag === 'h3') {
      lines.push(`### ${node.textContent?.trim()}`);
      lines.push('');
    } else if (tag === 'p') {
      lines.push(node.textContent?.trim() ?? '');
      lines.push('');
    } else if (tag === 'ul') {
      for (const li of Array.from(node.querySelectorAll(':scope > li'))) {
        lines.push(`- ${li.textContent?.trim()}`);
      }
      lines.push('');
    } else if (tag === 'ol') {
      let i = 1;
      for (const li of Array.from(node.querySelectorAll(':scope > li'))) {
        lines.push(`${i}. ${li.textContent?.trim()}`);
        i++;
      }
      lines.push('');
    } else if (tag === 'pre') {
      const code = node.querySelector('code')?.textContent ?? node.textContent ?? '';
      lines.push('```');
      lines.push(code.trim());
      lines.push('```');
      lines.push('');
    } else if (tag === 'table') {
      const rows = node.querySelectorAll('tr');
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        if (!row) continue;
        const cells = row.querySelectorAll('th, td');
        const cellTexts = Array.from(cells).map(c => c.textContent?.trim() ?? '');
        lines.push(`| ${cellTexts.join(' | ')} |`);
        if (r === 0 && rows[r]) {
          lines.push(`| ${cellTexts.map(() => '---').join(' | ')} |`);
        }
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}
