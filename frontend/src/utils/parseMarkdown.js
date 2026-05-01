/**
 * A simple markdown parser to convert bold, italic, lists, and headers to HTML.
 * For a production app we'd use marked + DOMPurify.
 */
export default function parseMarkdown(text) {
  if (!text) return '';

  let html = text;

  // Headers (e.g., ### Header)
  html = html.replace(/^### (.*$)/gim, '<h3 className="text-lg font-bold text-slate-100 mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 className="text-xl font-bold text-slate-100 mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 className="text-2xl font-bold text-slate-100 mt-5 mb-3">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong className="font-semibold text-slate-200">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em className="text-slate-300 italic">$1</em>');

  // Unordered Lists
  html = html.replace(/^\s*\n\*/gm, '<ul>\n*');
  html = html.replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n$2');
  html = html.replace(/^\* (.*)/gm, '<li className="ml-4 list-disc marker:text-primary">$1</li>');

  // Ordered Lists
  html = html.replace(/^\s*\n\d\./gm, '<ol>\n1.');
  html = html.replace(/^(\d\..+)\s*\n([^\d\.])/gm, '$1\n</ol>\n$2');
  html = html.replace(/^\d\. (.*)/gm, '<li className="ml-4 list-decimal marker:text-primary">$1</li>');

  // Newlines to <br/>
  html = html.replace(/\n$/gim, '<br/>');

  return html;
}
