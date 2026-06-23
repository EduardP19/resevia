type TemplateData = Record<string, string | number | boolean | null | undefined>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderTextTemplate(template: string, data: TemplateData) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => {
    const value = data[key];
    return value === null || value === undefined ? "" : String(value);
  });
}

export function renderHtmlTemplate(template: string, data: TemplateData) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => {
    const value = data[key];
    return value === null || value === undefined ? "" : escapeHtml(String(value));
  });
}
