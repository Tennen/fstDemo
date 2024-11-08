interface MenuItem {
  key: string;
  label: string;
  component: React.ComponentType;
}

export async function loadMenuItems(): Promise<MenuItem[]> {
  const modules = import.meta.glob('../menus/*/index.tsx');
  const menuItems: MenuItem[] = [];

  for (const path in modules) {
    const match = path.match(/\.\.\/menus\/(.+)\/index\.tsx$/);
    if (match) {
      const name = match[1];
      const module = await modules[path]() as { default: React.ComponentType };
      menuItems.push({
        key: name.toLowerCase(),
        label: name.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to spaces
        component: module.default
      });
    }
  }

  return menuItems;
} 