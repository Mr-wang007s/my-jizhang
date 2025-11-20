import { View, Text, ScrollView } from '@tarojs/components';
import { useEffect, useState } from 'react';
import type { Category } from '../../types';
import { CategoryService } from '../../services/category.service';
import './index.scss';

interface CategorySelectorProps {
  type?: 'income' | 'expense' | 'both';
  value?: string;
  onChange?: (categoryId: string) => void;
}

export default function CategorySelector({ type, value, onChange }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [type]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.list(type);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (categoryId: string) => {
    onChange?.(categoryId);
  };

  if (loading) {
    return (
      <View className="category-selector">
        <Text className="loading-text">加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="category-selector" scrollY>
      <View className="category-grid">
        {categories.map((category) => (
          <View
            key={category._id}
            className={`category-item ${value === category._id ? 'selected' : ''}`}
            onClick={() => handleSelect(category._id)}
          >
            <View className="category-icon" style={{ color: category.color }}>
              {category.icon || '📁'}
            </View>
            <Text className="category-name">{category.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
