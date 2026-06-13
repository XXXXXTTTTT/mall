export const ADMIN_ROLE_CODES = {
  admin: 'admin',
  operator: 'operator',
};

export const ADMIN_PERMISSIONS = [
  'dashboard',
  'products',
  'categories',
  'orders',
  'roles',
  'users',
  'account',
  'logs',
];

export const ORDER_STATUS = {
  pendingPayment: 'pending_payment',
  paid: 'paid',
  shipped: 'shipped',
  completed: 'completed',
  canceled: 'canceled',
};

export const categories = [
  { id: 'cat-digital', name: '数码办公', parentId: null, sort: 1, isActive: true },
  { id: 'cat-home', name: '家居生活', parentId: null, sort: 2, isActive: true },
  { id: 'cat-food', name: '品质食品', parentId: null, sort: 3, isActive: true },
  { id: 'cat-beauty', name: '个护清洁', parentId: null, sort: 4, isActive: true },
  { id: 'cat-sport', name: '运动户外', parentId: null, sort: 5, isActive: true },
  { id: 'cat-fashion', name: '服饰箱包', parentId: null, sort: 6, isActive: true },
  { id: 'cat-digital-audio', name: '智能影音', parentId: 'cat-digital', sort: 11, isActive: true },
  { id: 'cat-digital-office', name: '效率办公', parentId: 'cat-digital', sort: 12, isActive: true },
  { id: 'cat-home-storage', name: '收纳整理', parentId: 'cat-home', sort: 21, isActive: true },
  { id: 'cat-home-light', name: '氛围照明', parentId: 'cat-home', sort: 22, isActive: true },
  { id: 'cat-food-coffee', name: '咖啡茶饮', parentId: 'cat-food', sort: 31, isActive: true },
  { id: 'cat-food-snack', name: '健康零食', parentId: 'cat-food', sort: 32, isActive: true },
  { id: 'cat-beauty-care', name: '身体护理', parentId: 'cat-beauty', sort: 41, isActive: true },
  { id: 'cat-beauty-clean', name: '清洁工具', parentId: 'cat-beauty', sort: 42, isActive: true },
  { id: 'cat-sport-training', name: '训练装备', parentId: 'cat-sport', sort: 51, isActive: true },
  { id: 'cat-fashion-bag', name: '通勤箱包', parentId: 'cat-fashion', sort: 61, isActive: true },
];

const productNames = [
  ['p-001', '曜石无线降噪耳机', 'cat-digital-audio', 699, 98],
  ['p-002', '雾银桌面拓展坞', 'cat-digital-office', 329, 56],
  ['p-003', '云感人体工学鼠标', 'cat-digital-office', 199, 84],
  ['p-004', '星河便携投影仪', 'cat-digital-audio', 1699, 18],
  ['p-005', '低蓝光阅读台灯', 'cat-home-light', 259, 72],
  ['p-006', '模块化桌面收纳盒', 'cat-home-storage', 89, 140],
  ['p-007', '亚麻感四件套', 'cat-home-storage', 459, 42],
  ['p-008', '恒温香薰加湿器', 'cat-home-light', 299, 31],
  ['p-009', '深烘挂耳咖啡 30 包', 'cat-food-coffee', 119, 220],
  ['p-010', '冷萃咖啡液礼盒', 'cat-food-coffee', 149, 160],
  ['p-011', '海盐黑巧坚果棒', 'cat-food-snack', 69, 260],
  ['p-012', '低脂燕麦脆片', 'cat-food-snack', 59, 190],
  ['p-013', '雪松香氛沐浴露', 'cat-beauty-care', 79, 120],
  ['p-014', '云柔洗脸巾 6 包', 'cat-beauty-clean', 45, 300],
  ['p-015', '静音筋膜放松器', 'cat-sport-training', 399, 46],
  ['p-016', '轻量瑜伽垫', 'cat-sport-training', 129, 88],
  ['p-017', '城市通勤双肩包', 'cat-fashion-bag', 369, 35],
  ['p-018', '防泼水斜挎包', 'cat-fashion-bag', 189, 66],
  ['p-019', '磁吸无线充电座', 'cat-digital-office', 159, 95],
  ['p-020', '智能温湿度计', 'cat-home-light', 99, 115],
  ['p-021', '胶囊咖啡随行杯', 'cat-food-coffee', 139, 70],
  ['p-022', '柚香护手霜套装', 'cat-beauty-care', 88, 102],
  ['p-023', '可折叠健身凳', 'cat-sport-training', 499, 12],
  ['p-024', '商务证件卡包', 'cat-fashion-bag', 119, 93],
  ['p-025', '桌面理线套装', 'cat-digital-office', 49, 240],
  ['p-026', '智能入睡小夜灯', 'cat-home-light', 179, 52],
  ['p-027', '每日坚果礼盒', 'cat-food-snack', 129, 180],
  ['p-028', '高密清洁海绵组', 'cat-beauty-clean', 39, 330],
  ['p-029', '速干运动毛巾', 'cat-sport-training', 59, 150],
  ['p-030', '极简电脑内胆包', 'cat-fashion-bag', 149, 75],
];

export const products = productNames.map(([id, name, categoryId, price, stock], index) => ({
  id,
  name,
  categoryId,
  price,
  stock,
  sales: 320 - index * 7,
  image: `https://dummyimage.com/640x480/e8eef3/203244&text=${encodeURIComponent(name)}`,
  status: index === 7 ? 'offline' : 'online',
  tags: index % 3 === 0 ? ['热门', '精选'] : index % 3 === 1 ? ['新品'] : ['限时特惠'],
  skuOptions: [
    { id: `${id}-standard`, name: '标准版', stock: Math.max(0, stock - 5), price },
    { id: `${id}-pro`, name: '进阶版', stock: Math.max(0, Math.floor(stock / 2)), price: price + 60 },
  ],
  description: `${name}，为高效生活与可信赖购物体验精选。`,
  createdAt: '2026-06-01T08:00:00.000Z',
  updatedAt: '2026-06-01T08:00:00.000Z',
}));

export const users = [
  {
    id: 'user-001',
    username: 'member',
    password: '123456',
    name: '测试会员',
    phone: '13800000000',
    createdAt: '2026-06-01T08:00:00.000Z',
  },
];

export const admins = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    initialPassword: 'admin123',
    roleCode: ADMIN_ROLE_CODES.admin,
    isEnabled: true,
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'admin-002',
    username: 'operator',
    password: 'op123456',
    name: '普通运营',
    initialPassword: 'op123456',
    roleCode: ADMIN_ROLE_CODES.operator,
    isEnabled: true,
    createdAt: '2026-06-02T08:00:00.000Z',
  },
];

export const roles = [
  {
    code: ADMIN_ROLE_CODES.admin,
    name: '超级管理员',
    permissions: ADMIN_PERMISSIONS,
  },
  {
    code: ADMIN_ROLE_CODES.operator,
    name: '普通运营',
    permissions: ['dashboard', 'orders', 'account'],
  },
];

export const addresses = [
  {
    id: 'addr-001',
    userId: 'user-001',
    receiver: '测试会员',
    phone: '13800000000',
    province: '浙江省',
    city: '杭州市',
    detail: '云仓路 88 号',
    isDefault: true,
  },
];

export const orders = [
  {
    id: 'ORD_202606010001',
    userId: 'user-001',
    status: ORDER_STATUS.paid,
    totalAmount: 699,
    createdAt: '2026-06-01T09:30:00.000Z',
    paidAt: '2026-06-01T09:35:00.000Z',
    addressSnapshot: addresses[0],
    items: [
      {
        productId: 'p-001',
        productName: '曜石无线降噪耳机',
        skuId: 'p-001-standard',
        skuName: '标准版',
        quantity: 1,
        price: 699,
      },
    ],
    logistics: [],
    remark: '工作日配送',
  },
];

export const logs = [
  {
    id: 'log-001',
    actor: '管理员',
    action: '系统初始化',
    detail: '写入基础演示数据',
    createdAt: '2026-06-01T08:00:00.000Z',
  },
];

export const initialDatabase = {
  categories,
  products,
  users,
  admins,
  roles,
  addresses,
  orders,
  logs,
  cart: [],
  favorites: [],
  session: null,
  adminSession: null,
};
