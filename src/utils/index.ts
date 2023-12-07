/** 复制文本到剪切板 */
export function copyToClipboardAsync(str: string): boolean {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(str);
    return true;
  }
  const input = document.createElement('input');
  input.value = str;
  input.setAttribute('readonly', '');
  input.style.position = 'absolute';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
}
