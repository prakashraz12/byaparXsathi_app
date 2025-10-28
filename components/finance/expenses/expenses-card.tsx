import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
import type Expenses from "@/database/model/expenses.model";
import { getDateFormat } from "@/utils/format-date";
import { formatNumberWithComma } from "@/utils/format-number";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ExpensesHeadings } from "@/constants/expenses-headings";

const ExpensesCard = ({ item }: { item: Expenses }) => {
    const router = useRouter()
    const title = ExpensesHeadings.find((heading)=>heading.value === item.title)?.label || item.title
  return (
    <TouchableOpacity onPress={()=>router.push(`/finance/expenses/${item.id}`)}>
        <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "600", color: "#1f2937", flex: 1 }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.error }}>
          {formatNumberWithComma(item?.amount!)}
        </Text>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 13, color: "#6b7280" }}>
          {getDateFormat(item?.created_at!, "BS", true, true)}
        </Text>
        {item.remarks && (
          <Text style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>
            {item.remarks}
          </Text>
        )}
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default ExpensesCard;
