import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import IncomeForm from '@/components/finance/income/income-from';
import { Toast } from '@/components/re-usables/custom-toaster/toast-service';
import { Header } from '@/components/re-usables/header';
import AlertModal from '@/components/re-usables/modal/alert-modal';
import { COLORS } from '@/constants/Colors';
import Income from '@/database/model/income.model';
import { financeService } from '@/database/services/finance.service';
import PXWrapper from '@/layouts/px-wrapper';

const IncomeDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [income, setIncome] = useState<Income | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteIncome = async () => {
    if (!income?.id) return;
    const response = await financeService.deleteIncome(income?.id as string);
    if (response?.success) {
      Toast.success(response?.message);
      router.back();
    }
  };
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      const response = await financeService.getSingleIncome(id as string);
      if (response?.success) {
        setIncome(response?.data);
      }
      setIsLoading(false);
    };
    fetchExpenses();
  }, [id]);
  return (
    <PXWrapper
      header={
        <>
          <Header
            title="Income Details"
            onBackPress={() => router.back()}
            rightComponent={
              <TouchableOpacity onPress={() => setOpenDeleteModal(true)}>
                <Trash2 size={20} color={COLORS.error} />
              </TouchableOpacity>
            }
          />
        </>
      }
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        !isLoading && income && <IncomeForm mode="edit" income={income} />
      )}
      <AlertModal
        type="danger"
        title="Are you sure want to delete"
        visible={openDeleteModal}
        message="This action cannot be undone"
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteIncome}
      />
    </PXWrapper>
  );
};

export default IncomeDetail;
