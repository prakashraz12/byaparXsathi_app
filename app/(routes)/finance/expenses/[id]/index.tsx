import { financeService } from "@/database/services/finance.service";
import {
  useLocalSearchParams,
  useRouter,
  useSearchParams,
} from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import Expenses from "@/database/model/expenses.model";
import PXWrapper from "@/layouts/px-wrapper";
import ExpensesForm from "@/components/finance/expenses/expenses-form";
import { Header } from "@/components/re-usables/header";
import { Trash2 } from "lucide-react-native";
import { COLORS } from "@/constants/Colors";
import AlertModal from "@/components/re-usables/modal/alert-modal";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";

const ExpensesDetailScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expenses | null>(null);
  const { id } = useLocalSearchParams();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const router = useRouter();

   const handleDeleteExpenses = async () => {
    if(!expenses?.id) return;
    const response = await financeService.deleteExpenses(expenses?.id as string);
    if(response?.success){
      Toast.success(response?.message)
      router.back();
    }
  };
  
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      const response = await financeService.getSingleExpenses(id as string);
      if (response?.success) {
        setExpenses(response?.data);
      }
      setIsLoading(false);
    };
    fetchExpenses();
  }, [id]);

  return (
    <PXWrapper
      header={
        <Header
          title="Expenses Details"
          onBackPress={() => router.back()}
          rightComponent={
            <TouchableOpacity onPress={() => setOpenDeleteModal(true)}>
              <Trash2 size={20} color={COLORS.error} />
            </TouchableOpacity>
          }
        />
      }
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ExpensesForm expenses={expenses || undefined} mode="edit" />
      )}
      <AlertModal
        type="danger"
        title="Are you sure want to delete"
        visible={openDeleteModal}
        message="This action cannot be undone"
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteExpenses}
      />
    </PXWrapper>
  );
};

export default ExpensesDetailScreen;
