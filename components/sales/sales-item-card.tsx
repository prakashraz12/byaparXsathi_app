import { Text } from "@/components/re-usables/text";
import { TouchableOpacity, View } from "react-native";
import {  Pencil, Trash2 } from "lucide-react-native";
import { COLORS } from "@/constants/Colors";
import { useState } from "react";
import { formatNumberWithComma } from "@/utils/format-number";
import { SalesItemDraft } from "@/store/useSalesItem";
import EditSalesItem from "./edit-sales-item";
const SalesItemCard = ({
  item,
  handleDeleteItem,
}: {
  item: SalesItemDraft;
  handleDeleteItem: (itemId: string) => void;
}) => {
  const [updateOpen, setUpdateOpen] = useState(false);

  return (
    <View
      style={{
        marginVertical: 5,
        padding: 15,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Text size={16}>{item.itemName}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <TouchableOpacity onPress={()=>setUpdateOpen(true)}>
            <Pencil size={18} color={COLORS.success}  />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteItem(item.itemId || "")}>
            <Trash2 size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          marginTop: 8,
        }}
      >
        <Text size={13} style={{ color: "#666" }}>
          {item.quantity} {item?.measurement} X {formatNumberWithComma(Number(item.price))}  {Number(item.discountAmount) > 0 ? `=12${formatNumberWithComma(Number(item.quantity) * Number(item.price))}` : ""}
        </Text>
        <Text size={15}>
         {formatNumberWithComma(Number(item.quantity) * Number(item.price) - Number(item.discountAmount))}
        </Text>
      </View> 
     {Number(item.discountAmount) > 0 && (
      <View style={{marginTop: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <Text size={12} style={{ color: COLORS.error}}>Discount</Text>
        <Text size={13} style={{ color: COLORS.error}}>{formatNumberWithComma(Number(item.discountAmount))}</Text>
      </View>
     )}
      <EditSalesItem visible={updateOpen} onClose={()=>setUpdateOpen(false)} itemId={item.itemId} item={item} onSave={()=>setUpdateOpen(false)}/>
    </View>
  );
};
export default SalesItemCard;
