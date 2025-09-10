// Menu Data - Dynamic menu from CSV with hot pot categories
// Updated with proper category mapping and dish information

export type DishCategory = '汤底' | '陆鲜' | '海鲜' | '素菜' | '热菜' | '小吃' | '饮品';

export interface Dish {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  category: DishCategory;
  image: string;
  preparationTime?: number;
  prepQuantity?: number;
  featured?: boolean;
}

// Parse CSV data and map categories
const categoryMapping: Record<string, DishCategory> = {
  '锅底': '汤底',
  '汤底': '汤底',
  '肉类': '陆鲜',
  '陆鲜': '陆鲜',
  '海鲜': '海鲜',
  '素菜': '素菜',
  '凉菜': '热菜',
  '小吃甜品': '小吃',
  '小吃甜点': '小吃',
  '热菜主食': '陆鲜',
  '饮品': '饮品'
};

// Dishes from CSV data
export const dishes: Dish[] = [
  // 汤底 (Soup Base)
  {
    id: '53be1350-0430-4e42-a774-221e170b73af',
    name: '老凯里贵州酸汤',
    nameEn: 'Old Kylee GuiZhou Sour Soup Base',
    description: '贵州传统酸汤，番茄与野山椒的完美融合',
    descriptionEn: 'Traditional Guizhou sour soup with tomatoes and wild peppers',
    price: 68,
    category: '汤底',
    image: '/dishes/laokaili-feiyi-suantang.png',
    preparationTime: 180,
    prepQuantity: 20,
    featured: true
  },

  // 陆鲜 (Land Fresh - Meat)
  {
    id: 'f25df060-dbcb-4fb1-bf82-4d589a395e95',
    name: '大地飞雪',
    nameEn: 'Flying Snow',
    description: '精选雪花牛肉，入口即化',
    descriptionEn: 'Premium marbled beef, melts in your mouth',
    price: 88,
    category: '陆鲜',
    image: '/dishes/dadi-feixue-m9-wagyu.png',
    preparationTime: 300,
    prepQuantity: 25
  },
  {
    id: 'bc8f6776-899f-44d8-bb98-75dca4360598',
    name: '野蒜酥五花趾',
    nameEn: 'Wild Garlic Pork Toes',
    description: '野蒜香酥搭配嫩滑五花',
    descriptionEn: 'Crispy wild garlic with tender pork',
    price: 68,
    category: '陆鲜',
    image: '/dishes/yesuan-su-wuhuazhi.png',
    preparationTime: 240,
    prepQuantity: 20
  },
  {
    id: '5b8525db-56ec-47bb-8ce9-dc850fcfa792',
    name: '糊辣椒鲜黄牛匙仁',
    nameEn: 'Spicy Beef Tenderloin',
    description: '鲜嫩黄牛肉配贵州糊辣椒',
    descriptionEn: 'Fresh beef tenderloin with Guizhou chili paste',
    price: 98,
    category: '陆鲜',
    image: '/dishes/hulajiao-xianhuangniu-chiren.png',
    preparationTime: 240,
    prepQuantity: 25,
    featured: true
  },
  {
    id: 'e61c11c2-2297-46d5-a2be-f13c3adcb92c',
    name: '云山雪花吊龙',
    nameEn: 'Cloud Mountain Beef',
    description: '顶级吊龙肉，雪花纹理',
    descriptionEn: 'Premium hanging tender with marbling',
    price: 128,
    category: '陆鲜',
    image: '/dishes/yunshan-xuehua-diaolong.png',
    preparationTime: 240,
    prepQuantity: 30
  },
  {
    id: '8da063e8-f0dd-445a-a27a-f41872a49f44',
    name: '木姜子鲜黄牛肉',
    nameEn: 'Litsea Fresh Beef',
    description: '木姜子调味的鲜嫩黄牛肉',
    descriptionEn: 'Fresh beef seasoned with litsea',
    price: 88,
    category: '陆鲜',
    image: '/dishes/mujiangzi-xianhuangniurou.png',
    preparationTime: 240,
    prepQuantity: 25
  },
  {
    id: 'cf3adee7-2ba6-4b2d-979c-4ee80ccaa345',
    name: '紫苏半边云',
    nameEn: 'Perilla Cloud Meat',
    description: '紫苏叶包裹的特色肉片',
    descriptionEn: 'Special meat wrapped in perilla leaves',
    price: 78,
    category: '陆鲜',
    image: '/dishes/zisu-banbianyun.png',
    preparationTime: 240,
    prepQuantity: 20
  },
  {
    id: '1ab14b98-96c6-40bd-80d5-f499485ef81c',
    name: '黑松露和牛肉开口笑',
    nameEn: 'Black Truffle Wagyu',
    description: '黑松露配顶级和牛',
    descriptionEn: 'Black truffle with premium wagyu beef',
    price: 188,
    category: '陆鲜',
    image: '/dishes/heisonglu-wagyu-kaikouxiao.png',
    preparationTime: 180,
    prepQuantity: 15,
    featured: true
  },
  {
    id: 'fab32760-0b12-41e7-a4f9-9bc4ac32f6c1',
    name: '贵州传统软哨',
    nameEn: 'Guizhou Soft Whistle',
    description: '传统贵州特色猪肉',
    descriptionEn: 'Traditional Guizhou pork specialty',
    price: 58,
    category: '小吃',
    image: '/dishes/guizhou-chuantong-ruanshao.png',
    preparationTime: 180,
    prepQuantity: 20
  },
  {
    id: '576ee708-afb0-481f-86fe-d0b417159849',
    name: '手工水晶滑肉',
    nameEn: 'Crystal Pork Slices',
    description: '手工制作的晶莹剔透肉片',
    descriptionEn: 'Handmade crystal-clear pork slices',
    price: 68,
    category: '陆鲜',
    image: '/dishes/shougong-shuijing-huarou.png',
    preparationTime: 180,
    prepQuantity: 25
  },
  {
    id: '79950cab-fdf0-4e4c-93e7-2b55af16877e',
    name: '火烧云铜锅油焖鸡',
    nameEn: 'Copper Pot Braised Chicken',
    description: '铜锅慢焖的嫩滑鸡肉',
    descriptionEn: 'Tender chicken braised in copper pot',
    price: 88,
    category: '热菜',
    image: '/dishes/huoshaoyun-tongguo-youmenji.png',
    preparationTime: 300,
    prepQuantity: 10
  },

  // 海鲜 (Seafood)
  {
    id: 'c2f3074d-f65c-4b4f-97c6-bdf47f958dd3',
    name: '海鲜拼盘',
    nameEn: 'Seafood Platter',
    description: '新鲜海鲜精选拼盘',
    descriptionEn: 'Fresh seafood selection platter',
    price: 168,
    category: '海鲜',
    image: '/dishes/haixian-pinpan.png',
    preparationTime: 300,
    prepQuantity: 15,
    featured: true
  },
  {
    id: '668ccc66-5986-482f-8c28-060a95573264',
    name: '鲜虾',
    nameEn: 'Fresh Shrimp',
    description: '活虾现杀，鲜甜爽口',
    descriptionEn: 'Live shrimp, fresh and sweet',
    price: 88,
    category: '海鲜',
    image: '/dishes/jingshui-xianxia.png',
    preparationTime: 180,
    prepQuantity: 30
  },
  {
    id: '10c6ab4c-a7d4-4123-b08e-1968a1163f58',
    name: '乌鱼片',
    nameEn: 'Black Fish Slices',
    description: '新鲜乌鱼切片',
    descriptionEn: 'Fresh black fish slices',
    price: 68,
    category: '海鲜',
    image: '/dishes/wuyu-pian.png',
    preparationTime: 120,
    prepQuantity: 25
  },
  {
    id: 'b9f6776c-a8d4-4123-b08e-1968a1163f59',
    name: '黑金虾滑',
    nameEn: 'Black Gold Shrimp Paste',
    description: '精选虾肉手工打制',
    descriptionEn: 'Handmade with selected shrimp',
    price: 78,
    category: '海鲜',
    image: '/dishes/heijin-xiahua.png',
    preparationTime: 180,
    prepQuantity: 20
  },

  // 素菜 (Vegetables)
  {
    id: '8d3539ca-bdd7-4498-a4d5-d75068425376',
    name: '七彩土豆',
    nameEn: 'Rainbow Potatoes',
    description: '云南特色七彩土豆',
    descriptionEn: 'Yunnan specialty rainbow potatoes',
    price: 38,
    category: '素菜',
    image: '/dishes/caiyun-tudou.png',
    preparationTime: 180,
    prepQuantity: 25
  },
  {
    id: 'bf6f247f-8983-470a-b303-4eae711afa71',
    name: '藕',
    nameEn: 'Lotus Root',
    description: '爽脆莲藕片',
    descriptionEn: 'Crispy lotus root slices',
    price: 28,
    category: '素菜',
    image: '/dishes/ou.png',
    preparationTime: 180,
    prepQuantity: 25
  },
  {
    id: 'ac0d19b7-47e0-4dce-bd54-21c80d2d9853',
    name: '鲜百合',
    nameEn: 'Fresh Lily Bulbs',
    description: '清甜鲜百合',
    descriptionEn: 'Sweet fresh lily bulbs',
    price: 48,
    category: '素菜',
    image: '/dishes/xian-baihe.png',
    preparationTime: 180,
    prepQuantity: 20
  },
  {
    id: 'c0852474-a41c-4c46-97c3-0a9e125991eb',
    name: '山野菌菇拼盘',
    nameEn: 'Wild Mushroom Platter',
    description: '多种野生菌菇精选',
    descriptionEn: 'Selection of wild mushrooms',
    price: 88,
    category: '素菜',
    image: '/dishes/yelanzi-junguzuhe.png',
    preparationTime: 180,
    prepQuantity: 15,
    featured: true
  },
  {
    id: 'db2933d2-005e-43c6-aa0f-ec6c9f6f6102',
    name: '石磨黑豆腐',
    nameEn: 'Stone-Ground Black Tofu',
    description: '石磨制作的黑豆豆腐',
    descriptionEn: 'Stone-ground black bean tofu',
    price: 38,
    category: '素菜',
    image: '/dishes/shimo-heidoufu.png',
    preparationTime: 180,
    prepQuantity: 20
  },
  {
    id: 'a7dffd2d-a15c-457a-b5b1-a6d21411f054',
    name: '姜柄瓜',
    nameEn: 'Ginger Handle Melon',
    description: '清爽姜柄瓜',
    descriptionEn: 'Refreshing ginger handle melon',
    price: 32,
    category: '素菜',
    image: '/dishes/jiangbing-gua.png',
    preparationTime: 180,
    prepQuantity: 20
  },
  {
    id: '9c75c6f0-fe80-4051-af88-8e110b78fbb4',
    name: '鲜黄花',
    nameEn: 'Fresh Daylily',
    description: '新鲜黄花菜',
    descriptionEn: 'Fresh daylily vegetables',
    price: 38,
    category: '素菜',
    image: '/dishes/xian-huanghua.png',
    preparationTime: 120,
    prepQuantity: 20
  },
  {
    id: '8de49dd6-ad65-4ec4-b5a2-a384199b9a97',
    name: '脆三蔬',
    nameEn: 'Crispy Three Vegetables',
    description: '三种爽脆蔬菜组合',
    descriptionEn: 'Combination of three crispy vegetables',
    price: 38,
    category: '素菜',
    image: '/dishes/sancui-wan.png',
    preparationTime: 120,
    prepQuantity: 30
  },
  {
    id: 'b49cc708-9d24-4181-8f36-d28938604bf4',
    name: '山药',
    nameEn: 'Chinese Yam',
    description: '养生山药片',
    descriptionEn: 'Healthy Chinese yam slices',
    price: 38,
    category: '素菜',
    image: '/dishes/shanyao.png',
    preparationTime: 120,
    prepQuantity: 25
  },
  {
    id: '8dff1c70-9be4-4534-aba3-2d0bc285f453',
    name: '血皮菜',
    nameEn: 'Blood Vegetable',
    description: '特色血皮菜',
    descriptionEn: 'Special blood vegetable',
    price: 32,
    category: '素菜',
    image: '/dishes/xuepi-cai.png',
    preparationTime: 120,
    prepQuantity: 25
  },

  // 热菜 (Hot Dishes)
  {
    id: '548e0080-cc19-4ace-9aa1-6079ef1a1766',
    name: '傣村手撕罗非鱼',
    nameEn: 'Dai Village Shredded Tilapia',
    description: '傣族风味手撕罗非鱼',
    descriptionEn: 'Dai style hand-shredded tilapia',
    price: 88,
    category: '小吃',
    image: '/dishes/daicun-shousi-luofeiyu.png',
    preparationTime: 720,
    prepQuantity: 10,
    featured: true
  },
  {
    id: '17a3bc3b-ffbf-4508-99cc-5d648bde7269',
    name: '野佐料擂椒皮蛋',
    nameEn: 'Wild Sauce Century Egg',
    description: '野生佐料配擂椒皮蛋',
    descriptionEn: 'Century egg with wild sauce and crushed pepper',
    price: 38,
    category: '小吃',
    image: '/dishes/yezuoliao-leijiao-pidan.png',
    preparationTime: 300,
    prepQuantity: 20
  },
  {
    id: '8623829f-f17d-481b-b259-f5fc7f47f4a3',
    name: '贵州非遗丝娃娃',
    nameEn: 'Guizhou Silk Doll',
    description: '贵州非物质文化遗产丝娃娃',
    descriptionEn: 'Guizhou intangible cultural heritage silk doll',
    price: 48,
    category: '小吃',
    image: '/dishes/guizhou-feiyi-siwawa.png',
    preparationTime: 240,
    prepQuantity: 15
  },
  {
    id: 'aa0b00dc-d0fd-4718-be3b-e9f9872860ba',
    name: '木姜子鸡爪',
    nameEn: 'Litsea Chicken Feet',
    description: '木姜子调味鸡爪',
    descriptionEn: 'Chicken feet seasoned with litsea',
    price: 48,
    category: '小吃',
    image: '/dishes/mujiangzi-jizhua.png',
    preparationTime: 180,
    prepQuantity: 15
  },
  {
    id: 'c1b00dc-d0fd-4718-be3b-e9f9872860bb',
    name: '息烽虎皮猪蹄',
    nameEn: 'Xifeng Tiger Skin Pork Trotters',
    description: '传统烹饪虎皮脆嫩猪蹄',
    descriptionEn: 'Traditional crispy tender pork trotters',
    price: 98,
    category: '热菜',
    image: '/dishes/xifeng-hupi-zhuti.png',
    preparationTime: 480,
    prepQuantity: 10,
    featured: true
  },

  // 小吃 (Snacks)

  // 饮品 (Beverages)
  {
    id: 'd1b00dc-d0fd-4718-be3b-e9f9872860cc',
    name: '五指毛桃山茶',
    nameEn: 'Five Finger Peach Mountain Tea',
    description: '养生五指毛桃茶饮',
    descriptionEn: 'Healthy five finger peach tea',
    price: 28,
    category: '饮品',
    image: '/dishes/wuzhimaotao-shancha.png',
    preparationTime: 10,
    prepQuantity: 50
  },
  {
    id: 'd2b00dc-d0fd-4718-be3b-e9f9872860dd',
    name: '柠檬山茶',
    nameEn: 'Lemon Mountain Tea',
    description: '清新柠檬山茶',
    descriptionEn: 'Refreshing lemon mountain tea',
    price: 22,
    category: '饮品',
    image: '/dishes/ningmeng-shancha.png',
    preparationTime: 10,
    prepQuantity: 50
  },
  {
    id: 'd3b00dc-d0fd-4718-be3b-e9f9872860ee',
    name: '野刺梨山茶',
    nameEn: 'Wild Prickly Pear Mountain Tea',
    description: '野生刺梨茶饮',
    descriptionEn: 'Wild prickly pear tea',
    price: 32,
    category: '饮品',
    image: '/dishes/yecili-shancha.png',
    preparationTime: 10,
    prepQuantity: 50
  }
];

// Helper function to get dishes by category
export const getDishesByCategory = (category: DishCategory | 'all'): Dish[] => {
  if (category === 'all') return dishes;
  return dishes.filter(dish => dish.category === category);
};

// Helper function to get featured dishes
export const getFeaturedDishes = (): Dish[] => {
  return dishes.filter(dish => dish.featured);
};

// Category labels for display
export const categoryLabels: Record<DishCategory | 'all', { zh: string; en: string }> = {
  all: { zh: '全部', en: 'All' },
  '汤底': { zh: '汤底', en: 'Soup Base' },
  '陆鲜': { zh: '陆鲜', en: 'Land Fresh' },
  '海鲜': { zh: '海鲜', en: 'Seafood' },
  '素菜': { zh: '素菜', en: 'Vegetables' },
  '热菜': { zh: '热菜', en: 'Hot Dishes' },
  '小吃': { zh: '小吃', en: 'Snacks' },
  '饮品': { zh: '饮品', en: 'Beverages' }
};