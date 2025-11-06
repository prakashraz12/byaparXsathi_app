import BadgeSelector from '@/components/re-usables/badge-selector';
import { Button } from '@/components/re-usables/button';
import { Toast } from '@/components/re-usables/custom-toaster/toast-service';
import DatePicker from '@/components/re-usables/date-picker/date-picker';
import CustomInput from '@/components/re-usables/input';
import { ExpensesHeadings } from '@/constants/expenses-headings';
import useShops from '@/database/hooks/useShops';
import { financeService } from '@/database/services/finance.service';
import { normalizeToTimestamp } from '@/database/util/normalizeToTimeStamp';
import { AddExpensesSchema, addExpensesSchema } from '@/forms/schema/add-expenses.schema';
import { useForm } from '@tanstack/react-form';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Expenses from '@/database/model/expenses.model';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IncomeSource } from '@/constants/income-source';
import { IncomeSchema, TIncomeSchema } from '@/forms/schema/income.schama';
import Income from '@/database/model/income.model';

const IncomeForm = ({ income, mode }: { income?: Income; mode?: 'create' | 'edit' }) => {
  const insets = useSafeAreaInsets();
  const { activeShop } = useShops();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      amount: '',
      incomeSource: '',
      createdAt: new Date(),
      remarks: '',
    },
    validators: {
      onChangeAsync: IncomeSchema as any,
    },
    onSubmit: async ({ value }: { value: TIncomeSchema }) => {
      if (mode === 'create') {
        const response = await financeService.createIncome({
          amount: Number(value.amount),
          incomeSource: value.incomeSource,
          created_at: normalizeToTimestamp(value?.createdAt),
          remarks: value.remarks,
          shopId: activeShop?.id || '',
        });
        if (response && response?.success) {
          Toast.success(response?.message);
          router.back();
        }
      }
      if (mode === 'edit' && income) {
        const response = await financeService.updateIncome(income.id, {
          amount: Number(value.amount),
          incomeSource: value.incomeSource,
          created_at: normalizeToTimestamp(value?.createdAt),
          remarks: value.remarks,
        });
        if (response && response?.success) {
          Toast.success(response?.message);
          router.back();
        }
      }
    },
  });

  useEffect(() => {
    if (mode === 'edit' && income) {
      form.setFieldValue('amount', income.amount?.toString() || '');
      form.setFieldValue('incomeSource', income?.incomeSource || '');
      form.setFieldValue('createdAt', new Date(income?.created_at || Date.now()));
      form.setFieldValue('remarks', income?.remarks || '');
    }
  }, [mode, income]);

  return (
    <View
      style={{
        flexDirection: 'column',
        gap: 15,
        marginBottom: insets.bottom * 0.8,
      }}
    >
      <form.Field name="createdAt">
        {(field) => (
          <DatePicker
            selectedDate={field.state.value}
            onDateChange={(date) => field.handleChange(date)}
          />
        )}
      </form.Field>
      <form.Field name="amount">
        {(field) => (
          <CustomInput
            keyboardType="number-pad"
            placeholder="Amount"
            label="Amount"
            focusable
            autoFocus
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            error={field.state.meta.errors.map((err: any) => err.message || String(err)).join(', ')}
          />
        )}
      </form.Field>
      <form.Field name="incomeSource">
        {(field) => (
          <BadgeSelector
            label="Income Source"
            options={IncomeSource}
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            errorMessage={field.state.meta.errors
              .map((err: any) => err.message || String(err))
              .join(', ')}
          />
        )}
      </form.Field>
      <form.Field name="remarks">
        {(field) => (
          <CustomInput
            label="Remarks"
            placeholder="Remarks"
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            error={field.state.meta.errors.map((err: any) => err.message || String(err)).join(', ')}
          />
        )}
      </form.Field>
      <Button
        loading={form.state.isSubmitting}
        onPress={form.handleSubmit}
        disabled={form.state.isSubmitting}
        title={mode === 'edit' ? 'Update' : 'Save'}
      />
    </View>
  );
};

export default IncomeForm;
