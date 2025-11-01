import IncomeForm from "@/components/finance/income/income-from";
import { Header } from "@/components/re-usables/header";
import PXWrapper from "@/layouts/px-wrapper";
import { router } from "expo-router";

const IncomeCreateScreen = () => {
  return (
    <PXWrapper
      header={<Header title="Add Income" onBackPress={() => router.back()} />}
    >
      <IncomeForm mode="create" />
    </PXWrapper>
  );
};

export default IncomeCreateScreen;
