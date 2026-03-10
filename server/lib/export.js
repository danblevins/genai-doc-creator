import HTMLtoDOCX from 'html-to-docx';

export async function exportDocx(html) {
  return await HTMLtoDOCX(html, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
  });
}

