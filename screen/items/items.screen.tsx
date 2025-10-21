import HHeader from "@/components/re-usables/h-header";
import PXWrapper from "@/layouts/px-wrapper";
import Input from "@/components/re-usables/input";
import { useState } from "react";
import { Plus, Search } from "lucide-react-native";
import { Button } from "@/components/re-usables/button";
import { router } from "expo-router";
import { useItems } from "@/database/hooks/useItem";

import ItemCard from "./item-card";
import Item from "@/database/model/item.model";

const ItemScreen = () => {
  const [itemName, setItemName] = useState<string>("");
  const { items } = useItems({});

  return (
    <PXWrapper
      data={items}
      renderItem={({ item }: { item: Item }) => (
        <ItemCard
          itemName={item?.itemName || ""}
          currentLevel={item?.currentStock || 0}
          openingLevel={item?.openingStock || 0}
          isActive={item?.isActive || false}
          isStockEnable={item.isStockEnabled || false}
          sellingPrice={item?.sellingPrice || 0}
          costPrice={item?.costPrice || 0}
        />
      )}
      floatingAction={
        <Button
          iconOnly={true}
          variant="primary"
          leftIcon={<Plus size={24} color="#FFFFFF" />}
          style={{
            height: 50,
            width: 50,
          }}
          onPress={() => router.push("/(routes)/items/create")}
        />
      }
      header={
        <>
          <HHeader title="Items" />
          <Input
            value={itemName}
            placeholder="Search Items"
            leftIcon={<Search />}
            onChangeText={setItemName}
          />
        </>
      }
    ></PXWrapper>
  );
};

export default ItemScreen;
