import { View, Text, Input, Textarea, Button, Picker } from '@tarojs/components';
import Taro, { useLoad, useRouter } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import CategorySelector from '../../components/CategorySelector';
import { TransactionService } from '../../services/transaction.service';
import { useStore } from '../../store';
import { getToday } from '../../utils/date';
import { validateAmount, validateDate, validateCategoryId, validateNote } from '../../utils/validation';
import './index.scss';

export default function AddTransaction() {
  const router = useRouter();
  const { addTransaction, updateTransaction } = useStore();

  // Form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(getToday());
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Edit mode
  const [isEdit, setIsEdit] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useLoad(() => {
    // Check if editing existing transaction
    const { id } = router.params;
    if (id) {
      setIsEdit(true);
      setTransactionId(id);
      loadTransaction(id);
    }
  });

  const loadTransaction = async (id: string) => {
    try {
      const transaction = await TransactionService.getById(id);
      if (transaction) {
        setAmount(transaction.amount.toString());
        setType(transaction.type);
        setCategoryId(transaction.categoryId);
        setDate(transaction.date);
        setNote(transaction.note || '');
      }
    } catch (error) {
      Taro.showToast({ title: '加载失败', icon: 'error' });
    }
  };

  const handleSubmit = async () => {
    // Validate
    const errors: string[] = [];

    const amountNum = parseFloat(amount);
    const amountValidation = validateAmount(amountNum);
    if (!amountValidation.valid) {
      errors.push(amountValidation.error!);
    }

    const dateValidation = validateDate(date);
    if (!dateValidation.valid) {
      errors.push(dateValidation.error!);
    }

    const categoryValidation = validateCategoryId(categoryId);
    if (!categoryValidation.valid) {
      errors.push(categoryValidation.error!);
    }

    const noteValidation = validateNote(note);
    if (!noteValidation.valid) {
      errors.push(noteValidation.error!);
    }

    if (errors.length > 0) {
      Taro.showToast({ title: errors[0], icon: 'none', duration: 2000 });
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        // Update existing
        const updated = await TransactionService.update(transactionId, {
          amount: amountNum,
          type,
          categoryId,
          date,
          note: note || undefined,
        });
        updateTransaction(transactionId, updated);
        Taro.showToast({ title: '更新成功', icon: 'success' });
      } else {
        // Create new
        const newTransaction = await TransactionService.create({
          amount: amountNum,
          type,
          categoryId,
          date,
          note: note || undefined,
        });
        addTransaction(newTransaction);
        Taro.showToast({ title: '保存成功', icon: 'success' });
      }

      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    } catch (error: any) {
      Taro.showToast({ title: error.message || '保存失败', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="add-transaction">
      {/* Type Selector */}
      <View className="type-selector">
        <View
          className={`type-button ${type === 'expense' ? 'active expense' : ''}`}
          onClick={() => setType('expense')}
        >
          <Text>支出</Text>
        </View>
        <View
          className={`type-button ${type === 'income' ? 'active income' : ''}`}
          onClick={() => setType('income')}
        >
          <Text>收入</Text>
        </View>
      </View>

      {/* Amount Input */}
      <View className="form-section amount-section">
        <Text className="currency-symbol">¥</Text>
        <Input
          className="amount-input"
          type="digit"
          placeholder="0.00"
          value={amount}
          onInput={(e) => setAmount(e.detail.value)}
          focus
        />
      </View>

      {/* Category Selector */}
      <View className="form-section">
        <Text className="section-label">分类</Text>
        <CategorySelector type={type} value={categoryId} onChange={setCategoryId} />
      </View>

      {/* Date Picker */}
      <View className="form-section">
        <Text className="section-label">日期</Text>
        <Picker mode="date" value={date} onChange={(e) => setDate(e.detail.value)}>
          <View className="picker">
            <Text>{date}</Text>
          </View>
        </Picker>
      </View>

      {/* Note Input */}
      <View className="form-section">
        <Text className="section-label">备注</Text>
        <Textarea
          className="note-input"
          placeholder="添加备注（选填）"
          value={note}
          onInput={(e) => setNote(e.detail.value)}
          maxlength={200}
        />
        <Text className="char-count">{note.length}/200</Text>
      </View>

      {/* Submit Button */}
      <View className="submit-section">
        <Button className="submit-button" onClick={handleSubmit} loading={loading}>
          {isEdit ? '更新' : '保存'}
        </Button>
      </View>
    </View>
  );
}
