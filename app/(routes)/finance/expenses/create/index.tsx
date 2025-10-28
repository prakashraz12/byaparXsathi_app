import ExpensesForm from "@/components/finance/expenses/expenses-form";
import { Header } from "@/components/re-usables/header";
import PXWrapper from "@/layouts/px-wrapper";
import { useRouter } from "expo-router";

const ExpensesCreate = () => {
  const router = useRouter();
  return (
    <PXWrapper
      header={<Header title="Add Expenses" onBackPress={() => router.back()} />}
    >
      <ExpensesForm mode="create" />
    </PXWrapper>
  );
};

export default ExpensesCreate;
