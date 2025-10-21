import { TouchableOpacity, View } from "react-native";
import { Text } from "../re-usables/text";
import AvatarCard from "../re-usables/avatar-card";
import { COLORS } from "@/constants/Colors";
import { Check, ChevronDown, Plus } from "lucide-react-native";
import { useUserStore } from "@/store/useUserStore";
import { useCallback, useEffect, useState } from "react";
import { SlideUpModal } from "../re-usables/modal/slide-up.modal";
import { Button } from "../re-usables/button";
import { router } from "expo-router";
import useShops from "@/database/hooks/useShops";
import Shop from "@/database/model/shop.model";

const ProfileCard = () => {
  const {setActiveShopId} = useUserStore()
  const [openShops, setOpenShops] = useState(false);
  const { shops, isLoading, activeShop } = useShops();
  
    const handleSwitch = (idx:string)=>{
      if(!idx) return;
      setActiveShopId(idx);
    }

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpenShops(!openShops)}
        style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
      >
        <AvatarCard name={activeShop?.shopName || ""} size={55} />
        <View>
          <Text style={{ fontSize: 16 }}>{activeShop?.shopName || ""}</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>
            {activeShop?.shopPhoneNumber || ""}
          </Text>
        </View>
        <ChevronDown
          size={24}
          style={{ alignSelf: "center" }}
          onPress={() => setOpenShops(!openShops)}
        />
      </TouchableOpacity>
      <SlideUpModal
        title="Shops"
        visible={openShops}
        onClose={() => setOpenShops(false)}
        height={400 + (shops?.length ?? 0) * 20}
        stickyFooter={
          <View style={{ paddingHorizontal: 10 }}>
            <Button
              variant="outline"
              leftIcon={<Plus size={20} color={COLORS.primary} />}
              title="Create New Shop"
              onPress={() => {
                router.push("/(routes)/shop/create");
                setOpenShops(false);
              }}
            ></Button>
          </View>
        }
      >
        {!isLoading && shops?.map((item: Shop) => (
          <TouchableOpacity
            key={item?.id}
            onPress={()=>{handleSwitch(item?.id || "")}}
            style={{
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
              marginTop: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <AvatarCard name={item?.shopName ?? ""} size={55} />
              <View>
                <Text style={{ fontSize: 17, fontFamily: "Poppins-SemiBold" }}>
                  {item?.shopName}
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>
                  {item?.shopPhoneNumber}
                </Text>
              </View>
            </View>
           {activeShop?.id === item?.id && <Check size={18} color={COLORS.primary} />}
          </TouchableOpacity>
        ))}
      </SlideUpModal>
    </>
  );
};

export default ProfileCard;
