"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  options: string[];
  selected?: boolean;
}

const STORAGE_KEY = 'random-selector-data';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newOption, setNewOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [randomResult, setRandomResult] = useState<{
    category: string;
    option: string;
  } | null>(null);

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCategories(parsedData);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
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
      { id: Date.now().toString(), name: newCategory, options: [] }
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
                <span className="text-xs sm:text-sm text-gray-500">
                  点击卡片选择/取消
                </span>
              </h2>
              <div className="space-y-2 sm:space-y-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2">
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    还没有添加任何类别，从步骤1开始吧！
                  </div>
                ) : (
                  categories.map(category => (
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
                        {category.options.map((option, index) => (
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
                        ))}
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
      </main>
    </div>
  );
}
