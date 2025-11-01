import { Header } from "@/components/re-usables/header";
import CustomInput from "@/components/re-usables/input";
import PXWrapper from "@/layouts/px-wrapper";
import { Plus, Search } from "lucide-react-native";
import { COLORS } from "@/constants/Colors";
import { View } from "react-native";
import useIncome from "@/database/hooks/useIncome";
import { useState } from "react";
import { Button } from "@/components/re-usables/button";
import { router } from "expo-router";
import IncomeCard from "@/components/finance/income/income-card";
import Income from "@/database/model/income.model";

const IncomeScreen = () => {
  const [searchParamas, setSearchParamas] = useState("");
  const { income } = useIncome({ searchParams: searchParamas });
  return (
    <PXWrapper
      data={income}
      renderItem={({ item }: { item: Income }) => <IncomeCard item={item} />}
      floatingAction={
        <Button
          style={{ marginBottom: 30 }}
          leftIcon={<Plus size={20} color={"white"} />}
          title="Add Income"
          onPress={() => router.push("/(routes)/finance/extra-income/create")}
        />
      }
      header={
        <>
          <Header title="Extra Income" onBackPress={() => router.back()} />
          <View>
            <CustomInput
              placeholder="Search Income Transitions"
              leftIcon={<Search size={20} color={COLORS.textLight} />}
              onChangeText={setSearchParamas}
            />
          </View>
        </>
      }
    />
  );
};
export default IncomeScreen;
