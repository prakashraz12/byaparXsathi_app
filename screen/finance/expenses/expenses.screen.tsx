import ExpensesCard from "@/components/finance/expenses/expenses-card";
import ExpensesForm from "@/components/finance/expenses/expenses-form";
import { Button } from "@/components/re-usables/button";
import { Header } from "@/components/re-usables/header";
import CustomInput from "@/components/re-usables/input";
import { COLORS } from "@/constants/Colors";
import useExpenses from "@/database/hooks/useExpenses";
import Expenses from "@/database/model/expenses.model";
import { addExpensesSchema } from "@/forms/schema/add-expenses.schema";
import PXWrapper from "@/layouts/px-wrapper";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import { Dot, ListFilter, PlusIcon, Search } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ExpensesScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets()
  const [searchParams, setSearchParams] = useState("");
  const { expenses, reload } = useExpenses({ searchParams });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");

  const isFilterApplied = false;

  return (
    <PXWrapper
      data={expenses}
      renderItem={({ item }: { item: Expenses }) => (
        <ExpensesCard item={item} />
      )}
      floatingAction={
        <Button
          style={{ marginBottom: insets.bottom * 0.8 }}
          title="Add Expenses"
          leftIcon={<PlusIcon size={21} color={"#fff"} />}
          onPress={() => router.push("/finance/expenses/create")}
        />
      }
      header={
        <>
          <Header title="Expenses" onBackPress={() => router.back()} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <View style={{ flex: 1 }}>
              <CustomInput
                value={searchParams}
                onChangeText={setSearchParams}
                placeholder="Search Expenses transactions"
                leftIcon={<Search />}
              />
            </View>
            <TouchableOpacity
              style={{
                width: 54,
                height: 54,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.cardBackground,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
              onPress={() => setFilterOpen(true)}
            >
              <View style={{ position: "relative" }}>
                <ListFilter size={20} color={COLORS.text} />
                {isFilterApplied && (
                  <Dot
                    size={45}
                    color={COLORS.primary}
                    style={{ position: "absolute", top: -19, right: -19 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </>
      }
    />
  );
};
export default ExpensesScreen;
