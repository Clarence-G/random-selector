"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  options: string[];
  selected?: boolean;
  isDefault?: boolean;
}

const STORAGE_KEY = 'random-selector-data';

// 添加默认类别和选项
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "default-movies",
    name: "电影",
    options: [
      "星际穿越", "盗梦空间", "泰坦尼克号", "肖申克的救赎", "阿甘正传", 
      "绿皮书", "千与千寻", "寻梦环游记", "哪吒之魔童降世", "流浪地球", 
      "我不是药神", "让子弹飞", "无间道", "黑客帝国", "疯狂动物城", 
      "蜘蛛侠：平行宇宙", "复仇者联盟", "哈利·波特系列", "指环王系列", "蝙蝠侠：黑暗骑士",
      "怦然心动", "大话西游", "海上钢琴师", "当幸福来敲门", "楚门的世界",
      "飞屋环游记", "狮子王", "美丽心灵", "心灵捕手", "乱世佳人",
      "教父", "低俗小说", "辛德勒的名单", "搏击俱乐部", "阿凡达",
      "沐浴之王", "你好，李焕英", "东邪西毒", "天空之城", "龙猫",
      "功夫", "速度与激情系列", "星球大战系列", "碟中谍系列", "007系列",
      "长津湖", "满江红", "独行月球", "熊出没之雪岭熊风", "头号玩家",
      "拯救大兵瑞恩", "绿里奇迹", "三傻大闹宝莱坞", "暮光之城系列", "饥饿游戏系列",
      "小鞋子", "何以为家", "熔炉", "寄生虫", "釜山行",
      "你的名字", "天气之子", "铃芽之旅", "红猪", "悬崖上的金鱼姬",
      "猫鼠游戏", "禁闭岛", "钢琴家", "音乐之声", "放牛班的春天",
      "肖申克的救赎", "十二怒汉", "控方证人", "窃听风暴", "看不见的客人",
      "三块广告牌", "少年派的奇幻漂流", "地心引力", "火星救援", "星际探索",
      "惊天魔盗团", "死亡诗社", "闻香识女人", "穿条纹睡衣的男孩", "达拉斯买家俱乐部",
      "被嫌弃的松子的一生", "茶馆", "霸王别姬", "活着", "白日焰火",
      "小丑", "小丑回魂", "断背山", "色，戒", "一一",
      "菊次郎的夏天", "幽灵公主", "借东西的小人阿莉埃蒂", "虞美人盛开的山坡", "追逐繁星的孩子",
      "爱乐之城", "歌舞青春", "妈妈咪呀", "摇滚芭比", "波西米亚狂想曲"
    ],
    selected: false,
    isDefault: true
  },
  {
    id: "default-food",
    name: "美食",
    options: [
      "火锅", "烤肉", "寿司", "披萨", "汉堡", 
      "炸鸡", "麻辣烫", "冒菜", "拉面", "牛肉面", 
      "酸菜鱼", "水煮鱼", "小龙虾", "烧烤", "铁板烧", 
      "沙县小吃", "兰州拉面", "重庆小面", "肯德基", "麦当劳",
      "必胜客", "西北菜", "粤菜", "川菜", "湘菜",
      "东北菜", "江浙菜", "云南菜", "新疆菜", "西藏菜",
      "泰国菜", "日本料理", "韩国料理", "意大利面", "法国大餐",
      "印度咖喱", "越南河粉", "墨西哥卷饼", "肉夹馍", "煎饼果子",
      "生煎包", "锅贴", "馄饨", "饺子", "炒饭",
      "炒面", "盖浇饭", "便当", "黄焖鸡米饭", "米线",
      "麻辣香锅", "糖醋里脊", "宫保鸡丁", "鱼香肉丝", "回锅肉",
      "东坡肉", "糖醋排骨", "红烧肉", "粉蒸肉", "手撕包菜",
      "蒜蓉茄子", "麻婆豆腐", "鱼头豆腐汤", "酸辣汤", "西红柿蛋汤",
      "清蒸鱼", "干锅菜", "卤肉饭", "鸡腿饭", "烤鱼",
      "三明治", "热狗", "沙拉", "烤串", "麻辣兔头",
      "毛血旺", "白灼虾", "水煮肉片", "香辣蟹", "盐焗鸡",
      "酸菜鱼", "红烧牛肉面", "羊肉泡馍", "板面", "刀削面",
      "油泼面", "凉皮", "肉夹馍", "臊子面", "杭州小笼包",
      "叉烧包", "粥", "皮蛋瘦肉粥", "油条", "八宝粥",
      "虾饺", "烧卖", "叉烧", "椰子鸡", "糖醋鲤鱼",
      "烤鸭", "烧鹅", "卤鸭", "叫花鸡", "酱牛肉",
      "鸭血粉丝汤", "螺蛳粉", "酸辣粉", "猪脚饭", "叉烧饭",
      "扬州炒饭", "蛋炒饭", "虾仁炒饭", "牛肉炒饭", "泡面",
      "担担面", "牛肉面", "羊肉汤", "胡辣汤", "驴肉火烧"
    ],
    selected: false,
    isDefault: true
  },
  {
    id: "default-travel",
    name: "旅游目的地",
    options: [
      // 基础选项
      "北京", "上海", "广州", "深圳", "杭州",
      "成都", "重庆", "西安", "南京", "厦门",
      "三亚", "丽江", "大理", "张家界", "九寨沟",
      "黄山", "桂林", "拉萨", "敦煌", "青岛",
      "香港", "澳门", "台北", "东京", "京都",
      "大阪", "首尔", "新加坡", "曼谷", "普吉岛",
      "巴厘岛", "马尔代夫", "巴黎", "伦敦", "罗马",
      "威尼斯", "巴塞罗那", "纽约", "洛杉矶", "夏威夷",
      "悉尼", "墨尔本", "迪拜", "埃及", "马德里",
      "阿姆斯特丹", "布拉格", "维也纳", "苏黎世", "莫斯科",
      // 扩充选项
      "西双版纳", "峨眉山", "乐山", "华山", "泰山", 
      "长白山", "鼓浪屿", "千岛湖", "西湖", "武夷山",
      "凤凰古城", "洱海", "稻城亚丁", "色达", "青海湖",
      "月牙泉", "雅丹地貌", "长江三峡", "呼伦贝尔", "阿尔山",
      "北戴河", "五台山", "平遥古城", "雪乡", "大连",
      "威海", "烟台", "苏州", "无锡", "南通",
      "安阳", "洛阳", "开封", "周庄", "乌镇",
      "西塘", "婺源", "宏村", "鼓浪屿", "阳朔",
      "北海", "涠洲岛", "腾冲", "香格里拉", "玉龙雪山",
      "泸沽湖", "梅里雪山", "神农架", "庐山", "崂山",
      "日月潭", "阿里山", "垦丁", "花莲", "札幌",
      "冲绳", "奈良", "福冈", "名古屋", "小樽",
      "釜山", "济州岛", "清迈", "芭堤雅", "苏梅岛",
      "长滩岛", "宿雾", "热浪岛", "兰卡威", "吴哥窟",
      "巴厘岛", "大堡礁", "黄金海岸", "奥克兰", "皇后镇",
      "塞班岛", "关岛", "威尼斯", "圣托里尼", "米科诺斯"
    ],
    selected: false,
    isDefault: true
  },
  {
    id: "default-activities",
    name: "休闲活动",
    options: [
      // 基础选项
      "看电影", "听音乐会", "逛街购物", "打游戏", "运动健身",
      "爬山", "游泳", "打篮球", "踢足球", "羽毛球",
      "桌游", "KTV唱歌", "烧烤", "野餐", "露营",
      "阅读", "写作", "画画", "摄影", "弹琴",
      "学习新技能", "料理美食", "咖啡厅发呆", "冥想", "瑜伽",
      "看展览", "博物馆", "植物园", "动物园", "水族馆",
      "主题公园", "密室逃脱", "真人CS", "卡丁车", "射箭",
      "保龄球", "台球", "骑行", "滑板", "滑雪",
      "远足", "钓鱼", "观鸟", "做手工", "园艺",
      "志愿服务", "参加课程", "温泉", "按摩SPA", "茶馆品茶",
      // 扩充选项
      "剧本杀", "密室逃脱", "电子竞技", "VR体验", "飞镖",
      "唱K", "听播客", "听有声书", "看纪录片", "追剧",
      "打麻将", "玩扑克", "下象棋", "下围棋", "玩飞行棋",
      "玩狼人杀", "玩三国杀", "玩剧本杀", "烘焙", "做甜点",
      "插花", "编织", "搭积木", "拼图", "折纸",
      "书法", "篆刻", "陶艺", "雕塑", "香道",
      "茶道", "皮艺", "木工", "刺绣", "十字绣",
      "串珠", "DIY手工皂", "蜡烛制作", "扎染", "拓印",
      "风筝", "模型制作", "皮影戏", "木偶戏", "编程",
      "尤克里里", "吉他", "口琴", "非洲鼓", "电子琴",
      "舞蹈", "瑜伽", "普拉提", "太极", "气功",
      "跑步", "快走", "街舞", "拳击", "武术",
      "跆拳道", "空手道", "攀岩", "蹦极", "冲浪",
      "皮划艇", "帆船", "高尔夫", "网球", "壁球",
      "飞盘", "棒球", "橄榄球", "冰球", "排球",
      "乒乓球", "跳伞", "滑翔", "热气球", "潜水"
    ],
    selected: false,
    isDefault: true
  },
  {
    id: "default-lunch",
    name: "午餐选择",
    options: [
      // 基础选项
      "盖浇饭", "便当", "炒饭", "炒面", "拉面",
      "快餐", "麻辣烫", "冒菜", "凉皮", "肉夹馍",
      "煎饼果子", "饺子", "包子", "馄饨", "面条",
      "米线", "螺蛳粉", "过桥米线", "酸辣粉", "重庆小面",
      "兰州拉面", "麦当劳", "肯德基", "汉堡", "三明治",
      "沙拉", "寿司", "便利店便当", "水煮鱼", "烤鱼",
      "烤肉饭", "烧烤", "麻辣香锅", "黄焖鸡米饭", "辣子鸡",
      "烤鸭", "叉烧饭", "煲仔饭", "火锅", "自助餐",
      "轻食", "粥", "炸酱面", "担担面", "酸菜鱼",
      "家常菜", "自带饭菜", "外卖平台订餐", "沙县小吃", "西式快餐",
      // 扩充选项
      "鸡排饭", "照烧鸡饭", "咖喱饭", "卤肉饭", "鳗鱼饭",
      "牛肉饭", "猪排饭", "回锅肉盖饭", "宫保鸡丁饭", "鱼香肉丝饭",
      "鱼香茄子饭", "麻婆豆腐饭", "西红柿炒蛋饭", "蒜苔肉丝饭", "青椒肉丝饭",
      "木须肉饭", "糖醋里脊饭", "锅包肉饭", "酱爆鸡丁饭", "蚝油牛肉饭",
      "西芹牛肉饭", "土豆牛腩饭", "红烧排骨饭", "红烧鱼块饭", "可乐鸡翅饭",
      "糖醋排骨饭", "鸡腿饭", "猪脚饭", "干炒牛河", "豆角饭",
      "鸡蛋炒饭", "扬州炒饭", "叉烧炒饭", "虾仁炒饭", "蛋炒饭",
      "火腿炒饭", "牛肉炒饭", "泡菜炒饭", "泰式炒饭", "韩式拌饭",
      "日式咖喱", "印度咖喱", "泰式咖喱", "越南河粉", "新加坡炒米粉",
      "泰式炒河粉", "马来西亚炒粉", "印尼炒饭", "菲律宾炒饭", "墨西哥卷饼",
      "墨西哥塔可", "意大利面", "千层面", "意面", "通心粉",
      "匹萨", "帕尼尼", "牛肉汉堡", "鸡肉汉堡", "鱼肉汉堡",
      "素食汉堡", "鸡肉卷", "沙拉三明治", "蔬菜三明治", "水果沙拉",
      "鸡肉沙拉", "金枪鱼沙拉", "希腊沙拉", "凯撒沙拉", "烤肉沙拉"
    ],
    selected: false,
    isDefault: true
  }
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newOption, setNewOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [randomResult, setRandomResult] = useState<{
    category: string;
    option: string;
  } | null>(null);

  // 从 localStorage 加载数据，如果没有则加载默认数据
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCategories(parsedData);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      // 如果没有保存的数据，加载默认数据
      setCategories(DEFAULT_CATEGORIES);
      // 保存默认数据到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      } catch (error) {
        console.error('Error saving default data to localStorage:', error);
      }
    }
  }, []);

  // 保存数据到 localStorage
  const saveToLocalStorage = (newCategories: Category[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // 修改添加类别函数
  const addCategory = () => {
    if (!newCategory.trim()) return;
    const newCategories = [
      ...categories,
      { id: Date.now().toString(), name: newCategory, options: [], isDefault: false }
    ];
    setCategories(newCategories);
    saveToLocalStorage(newCategories);
    setNewCategory("");
  };

  // 修改添加选项函数
  const addOption = () => {
    if (!selectedCategory || !newOption.trim()) return;
    const newCategories = categories.map(cat => {
      if (cat.id === selectedCategory) {
        return { ...cat, options: [...cat.options, newOption] };
      }
      return cat;
    });
    setCategories(newCategories);
    saveToLocalStorage(newCategories);
    setNewOption("");
  };

  // 修改切换类别选中状态函数
  const toggleCategorySelection = (categoryId: string) => {
    const newCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, selected: !cat.selected };
      }
      return cat;
    });
    setCategories(newCategories);
    saveToLocalStorage(newCategories);
  };

  // 添加删除类别功能
  const deleteCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发选中事件
    const newCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(newCategories);
    saveToLocalStorage(newCategories);
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };

  // 添加删除选项功能
  const deleteOption = (categoryId: string, optionIndex: number) => {
    const newCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const newOptions = [...cat.options];
        newOptions.splice(optionIndex, 1);
        return { ...cat, options: newOptions };
      }
      return cat;
    });
    setCategories(newCategories);
    saveToLocalStorage(newCategories);
  };

  // 修改随机选择函数
  const randomSelect = () => {
    const selectedCategories = categories.filter(cat => cat.selected);
    if (selectedCategories.length === 0) return;

    // 从选中的类别中随机选择一个
    const randomCategoryIndex = Math.floor(Math.random() * selectedCategories.length);
    const selectedCategory = selectedCategories[randomCategoryIndex];

    if (selectedCategory.options.length === 0) {
      setRandomResult({
        category: selectedCategory.name,
        option: "该类别暂无选项"
      });
      return;
    }

    // 从选中的类别中随机选择选项
    const randomOptionIndex = Math.floor(Math.random() * selectedCategory.options.length);
    setRandomResult({
      category: selectedCategory.name,
      option: selectedCategory.options[randomOptionIndex]
    });
  };

  // 添加清除所有默认数据的函数
  const clearDefaultCategories = () => {
    const newCategories = categories.filter(cat => !cat.isDefault);
    setCategories(newCategories);
    saveToLocalStorage(newCategories);
    // 如果当前选中的类别是默认类别，则清除选择
    if (selectedCategory && categories.find(cat => cat.id === selectedCategory)?.isDefault) {
      setSelectedCategory(null);
    }
  };

  // 添加全选所有类别的函数
  const selectAllCategories = () => {
    const newCategories = categories.map(cat => ({
      ...cat,
      selected: true
    }));
    setCategories(newCategories);
    saveToLocalStorage(newCategories);
  };

  // 添加全不选所有类别的函数
  const deselectAllCategories = () => {
    const newCategories = categories.map(cat => ({
      ...cat,
      selected: false
    }));
    setCategories(newCategories);
    saveToLocalStorage(newCategories);
  };

  // 添加导入默认类别的函数
  const importDefaultCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
    saveToLocalStorage(DEFAULT_CATEGORIES);
    
    // 添加导入成功的反馈提示
    const randomElement = document.getElementById('random-result-container');
    if (randomElement) {
      randomElement.scrollIntoView({ behavior: 'smooth' });
      setRandomResult({
        category: "导入成功",
        option: `已成功导入 ${DEFAULT_CATEGORIES.length} 个默认类别`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-2 sm:p-4 md:p-8">
      <main className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          今天吃什么？看什么？玩什么？
        </h1>
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* 添加类别区域 */}
            <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-100">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-2 shadow-sm text-sm sm:text-base">
                  1
                </span>
                创建决策类别
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="例如：午餐、电影..."
                />
                <button
                  onClick={addCategory}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-sm hover:shadow text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  创建
                </button>
              </div>
            </div>

            {/* 添加选项区域 */}
            <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white mr-2 shadow-sm">
                  2
                </span>
                添加选项内容
              </h2>
              <div className="space-y-3">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">请先选择一个类别</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="添加具体选项..."
                  />
                  <button
                    onClick={addOption}
                    disabled={!selectedCategory}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow
                      ${!selectedCategory 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600 text-white'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    添加
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：显示区域 */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* 显示类别和选项 */}
            <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-100">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-2 shadow-sm text-sm sm:text-base">
                    3
                  </span>
                  选择决策范围
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={selectAllCategories}
                    className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
                  >
                    全选
                  </button>
                  <button 
                    onClick={deselectAllCategories}
                    className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
                  >
                    全不选
                  </button>
                  <span className="text-xs sm:text-sm text-gray-500">
                    点击卡片选择/取消
                  </span>
                </div>
              </h2>
              
              {/* 简化默认数据提示 */}
              {categories.some(cat => cat.isDefault) && (
                <div className="mb-3 flex justify-end">
                  <button 
                    onClick={clearDefaultCategories}
                    className="text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      清除默认类别
                    </span>
                  </button>
                </div>
              )}
              
              <div className="space-y-2 sm:space-y-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2">
                {categories.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-6 px-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mb-2 text-gray-600">还没有添加任何类别</p>
                    <p className="mb-4 text-sm text-gray-500">你可以从步骤1开始创建，或者使用我们的默认类别</p>
                    <motion.button
                      onClick={importDefaultCategories}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      导入默认类别
                    </motion.button>
                  </motion.div>
                ) : (
                  // 对类别进行排序，使默认类别排在前面
                  [...categories]
                    .sort((a, b) => {
                      // 如果a是默认而b不是，则a排在前面
                      if (a.isDefault && !b.isDefault) return -1;
                      // 如果b是默认而a不是，则b排在前面
                      if (!a.isDefault && b.isDefault) return 1;
                      // 否则按名称排序
                      return a.name.localeCompare(b.name);
                    })
                    .map(category => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={category.id}
                        onClick={() => toggleCategorySelection(category.id)}
                        className={`group bg-white p-3 sm:p-4 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow
                          ${category.selected 
                            ? 'border-purple-500 ring-2 ring-purple-200' 
                            : 'border-gray-100 hover:border-purple-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-purple-600 text-sm sm:text-base flex items-center gap-2">
                            {category.name}
                            {category.selected && (
                              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </h3>
                          <button
                            onClick={(e) => deleteCategory(category.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                          {category.isDefault ? (
                            <div className="w-full flex justify-start text-xs sm:text-sm">
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {category.options.length} 个选项
                              </span>
                            </div>
                          ) : (
                            category.options.map((option, index) => (
                              <span
                                key={index}
                                className="group/option px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm flex items-center gap-1"
                              >
                                {option}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteOption(category.id, index);
                                  }}
                                  className="opacity-0 group-hover/option:opacity-100 hover:text-red-500 transition-opacity"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </div>

            {/* 随机选择区域 */}
            <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-100">
              <button
                onClick={randomSelect}
                disabled={!categories.some(cat => cat.selected)}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-102 shadow-lg font-semibold text-base sm:text-lg
                  ${!categories.some(cat => cat.selected)
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-xl'
                  } text-white`}
              >
                {!categories.some(cat => cat.selected) 
                  ? '请先选择决策范围'
                  : '开始随机选择'}
              </button>
              <div id="random-result-container">
                {randomResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 sm:mt-4 p-4 sm:p-6 bg-white rounded-lg sm:rounded-xl shadow-sm border border-purple-200"
                  >
                    <div className="space-y-2">
                      <div className="text-xs sm:text-sm text-gray-500">类别</div>
                      <p className="text-lg sm:text-xl font-bold text-purple-600">
                        {randomResult.category}
                      </p>
                      <div className="h-px bg-gray-200 my-2 sm:my-3"></div>
                      <div className="text-xs sm:text-sm text-gray-500">为你选择了</div>
                      <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {randomResult.option}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
