import fs from 'fs';

const xml = fs.readFileSync('public/docx_extracted/word/document.xml', 'utf-8');

const paragraphs: string[] = [];
const pMatches = xml.matchAll(/<w:p(?:\s|>)[^]*?<\/w:p>/g);

for (const match of pMatches) {
  const pXml = match[0];
  const tMatches = Array.from(pXml.matchAll(/<w:t(?:\s[^>]*?)?>([\s\S]*?)<\/w:t>/g)).map(m => m[1]);
  const text = tMatches.join('').trim();
  if (text) {
    paragraphs.push(text);
  }
}

fs.writeFileSync('public/docx_extracted_text.txt', paragraphs.join('\n\n'), 'utf-8');
console.log('Extracted paragraphs count:', paragraphs.length);
console.log('First 30 paragraphs:\n', paragraphs.slice(0, 30).join('\n---\n'));
