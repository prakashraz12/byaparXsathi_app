import BadgeSelector from "@/components/re-usables/badge-selector";
import { Button } from "@/components/re-usables/button";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import DatePicker from "@/components/re-usables/date-picker/date-picker";
import CustomInput from "@/components/re-usables/input";
import { ExpensesHeadings } from "@/constants/expenses-headings";
import useShops from "@/database/hooks/useShops";
import { financeService } from "@/database/services/finance.service";
import { normalizeToTimestamp } from "@/database/util/normalizeToTimeStamp";
import {
  AddExpensesSchema,
  addExpensesSchema,
} from "@/forms/schema/add-expenses.schema";
import { useForm } from "@tanstack/react-form";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Expenses from "@/database/model/expenses.model";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ExpensesForm = ({
  expenses,
  mode,
}: {
  expenses?: Expenses;
  mode?: "create" | "edit";
}) => {
  const insets = useSafeAreaInsets();
  const { activeShop } = useShops();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      amount: "",
      title: "",
      createdAt: new Date(),
      remarks: "",
    },
    validators: {
      onChangeAsync: addExpensesSchema as any,
    },
    onSubmit: async ({ value }: { value: AddExpensesSchema }) => {
      if (mode === "create") {
        const response = await financeService.createExpenses({
          amount: Number(value.amount),
          title: value.title,
          created_at: normalizeToTimestamp(value?.createdAt),
          remarks: value.remarks,
          shopId: activeShop?.id || "",
        });
        if (response && response?.success) {
          Toast.success(response?.message);
          router.back();
        }
      }
      if (mode === "edit" && expenses) {
        const response = await financeService.updateExpenses(expenses.id, {
          amount: Number(value.amount),
          title: value.title,
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
    if (mode === "edit" && expenses) {
      form.setFieldValue("amount", expenses.amount?.toString() || "");
      form.setFieldValue("title", expenses?.title || "");
      form.setFieldValue(
        "createdAt",
        new Date(expenses?.created_at || Date.now())
      );
      form.setFieldValue("remarks", expenses?.remarks || "");
    }
  }, [mode, expenses]);

  return (
    <View
      style={{
        flexDirection: "column",
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
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            error={field.state.meta.errors
              .map((err: any) => err.message || String(err))
              .join(", ")}
          />
        )}
      </form.Field>
      <form.Field name="title">
        {(field) => (
          <BadgeSelector
            label="Expenses Heading"
            options={ExpensesHeadings}
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            errorMessage={field.state.meta.errors
              .map((err: any) => err.message || String(err))
              .join(", ")}
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
            error={field.state.meta.errors
              .map((err: any) => err.message || String(err))
              .join(", ")}
          />
        )}
      </form.Field>
      <Button
        loading={form.state.isSubmitting}
        onPress={form.handleSubmit}
        disabled={form.state.isSubmitting}
        title={mode === "edit" ? "Update" : "Save"}
      />
    </View>
  );
};

export default ExpensesForm;
