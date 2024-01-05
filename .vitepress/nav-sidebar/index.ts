import { JS_sidebar } from './JavaScript';
import TS from './TypeScript';

export const sidebar = Object.assign(JS_sidebar, TS);

const docs: Record<string, string[][]> = {
  JavaScript: [
    ['basic', 'JS 基础'],
    ['advanced', 'JS 进阶'],
    ['vue', 'Vue'],
    ['react', 'React']
  ],
  TypeScript: [
    ['basic', 'TypeScript 基础'],
    ['advanced', 'TypeScript 进阶'],
    ['challenge', 'TypeScript 挑战'],
    ['other', '其他']
  ]
};

interface NAV {
  text: string;
  activeMatch: string;
  items: { text: string; link: string }[];
}

export const nav: NAV[] = [];

for (const text in docs) {
  const value = docs[text];
  const activeMatch = `^/${text}/(${value.map(i => i[0]).join('|')})/`;
  const items = value.map(i => ({ text: i[1], link: `${text}/${i[0]}/index` }));
  nav.push({ text, activeMatch, items });
}
