import type { MenuMeta } from '../types/menu';

interface MenuItem {
  key: string;
  label: string;
  component: React.ComponentType;
  meta?: MenuMeta;
}

export async function loadMenuItems(): Promise<MenuItem[]> {
  const moduleComponents = import.meta.glob('../menus/*/index.tsx');
  const modulesMeta = import.meta.glob('../menus/*/meta.ts', { eager: true });
  const menuItems: MenuItem[] = [];

  for (const path in moduleComponents) {
    const match = path.match(/\.\.\/menus\/(.+)\/index\.tsx$/);
    if (match) {
      const name = match[1];
      const metaPath = path.replace('index.tsx', 'meta.ts');
      const meta = (modulesMeta[metaPath] as { default: MenuMeta })?.default;
      
      // 如果 meta.hidden 为 true，则跳过该菜单项
      if (meta?.hidden) continue;

      const module = await moduleComponents[path]() as { default: React.ComponentType };
      menuItems.push({
        key: name.toLowerCase(),
        label: meta?.title || name.replace(/([A-Z])/g, ' $1').trim(), // 使用meta中的title或默认标题
        component: module.default,
        meta
      });
    }
  }

  // 根据 order 排序，如果没有 order 则默认为 Infinity
  return menuItems.sort((a, b) => 
    (a.meta?.order ?? Infinity) - (b.meta?.order ?? Infinity)
  );
} 