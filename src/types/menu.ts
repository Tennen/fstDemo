export interface MenuMeta {
    order: number;  // 用于排序的权重
    title?: string; // 可选：覆盖默认的菜单标题
    icon?: React.ComponentType; // 可选：菜单图标
    hidden?: boolean; // 可选：是否在菜单中隐藏
}