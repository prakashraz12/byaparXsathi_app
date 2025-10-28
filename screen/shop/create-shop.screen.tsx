import { Header } from "@/components/re-usables/header";
import CreateShopForm from "@/components/shop/create-shop.form";
import PXWrapper from "@/layouts/px-wrapper";
import { router } from "expo-router";

const CreateShopScreen = () => {
  return (
    <PXWrapper
      header={
        <Header
          title="Create Shop"
          style={{ marginTop: 10 }}
          onBackPress={() => {
            router.push("/(tabs)");
          }}
        />
      }
    >
      <CreateShopForm />
    </PXWrapper>
  );
};

export default CreateShopScreen;
