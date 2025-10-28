import { customerService } from "@/database/services/customer.service";
import {
  customerSchema,
  TCustomerSchema,
} from "@/forms/schema/customer.schema";
import { useForm } from "@tanstack/react-form";
import {
  Mail,
  Map,
  MapPin,
  Phone,
  Plus,
  User,
  UserPlus,
} from "lucide-react-native";
import { useState } from "react";
import { Dimensions, View } from "react-native";
import { Button } from "../re-usables/button";
import Input from "../re-usables/input";
import { SlideUpModal } from "../re-usables/modal/slide-up.modal";
import { Text } from "../re-usables/text";
import { Toast } from "../re-usables/custom-toaster/toast-service";
import { useCustomers } from "@/database/hooks/useCustomer";
import { COLORS } from "@/constants/Colors";
import ImportContact from "./import-contact";
import ContactList from "./contact-list";
import { IContact } from "@/types/common";
import { useUserStore } from "@/store/useUserStore";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const AddCustomerModal = () => {
  const { activeShopId } = useUserStore();
  const [visible, setVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"ADD" | "IMPORT">("ADD");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [importingContactLoading, setImportingContactLoading] = useState<boolean>(false);

  const { handleSubmit, Field, setFieldValue, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
    validators: {
      onChange: customerSchema,
    },
    onSubmit: async ({ value }: { value: TCustomerSchema }) => {
      if (!activeShopId) return;
      setIsLoading(true);
      await customerService
        .create({
          name: value.name,
          phone: value.phone,
          email: value.email,
          address: value.address,
          shopId: activeShopId?.toString(),
        })
        .then((res) => {
          if (res?.status === 201) {
            setIsLoading(false);
            setVisible(false);
            Toast.success("Customer added successfully");
            reset();
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          Toast.error("Failed to add customer");
          setIsLoading(false);
        });
    },
  });

  const handleImportContact = (contact: IContact) => {
    setFieldValue("name", contact.name);
    setFieldValue("phone", contact?.phoneNumbers?.[0]?.number);
    setFieldValue("email", contact?.emails?.[0]?.email);
    setFieldValue(
      "address",
      `${contact?.addresses?.[0]?.street !== undefined ? contact?.addresses?.[0]?.street : ""} ${contact?.addresses?.[0]?.city !== undefined ? contact?.addresses?.[0]?.city : ""} ${contact?.addresses?.[0]?.country !== undefined ? contact?.addresses?.[0]?.country : ""}`
    );
    setModalType("ADD");
  };
  return (
    <>
      <Button
        onPress={() => setVisible(true)}
        iconOnly={true}
        variant="primary"
        leftIcon={<Plus size={24} color="#FFFFFF" />}
        style={{
          height: 50,
          width: 50,
        }}
      />
      <SlideUpModal
        visible={visible}
        height={SCREEN_HEIGHT * (modalType === "ADD" ? 0.7 : 0.9)}
        onClose={() => setVisible(false)}
        title="Customer Details"
        stickyFooter={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 16,
              gap: 16,
            }}
          >
            <ImportContact
              mode={modalType}
              setMode={setModalType}
              setContacts={setContacts}
              setImportingContactLoading={setImportingContactLoading}

            />
            <Button
              loading={isLoading}
              disabled={isLoading}
              title="Save Customer"
              style={{ width: "45%" }}
              onPress={() => handleSubmit()}
            />
          </View>
        }
      >
        <>
          {modalType === "ADD" ? (
            <>
             
              <View style={{ flexDirection: "column", gap: 16,marginTop:10 }}>
                <Field name="name">
                  {(field) => {
                    return (
                      <Input
                        placeholder="Name"
                        leftIcon={<User />}
                        value={field.state.value}
                        onChangeText={field.setValue}
                        onBlur={field.handleBlur}
                        error={field.state.meta.errors
                          .map((err: any) => err.message || String(err))
                          .join(", ")}
                      />
                    );
                  }}
                </Field>
                <Field name="phone">
                  {(field) => (
                    <Input
                      placeholder="Phone"
                      leftIcon={<Phone />}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors
                        .map((err: any) => err.message || String(err))
                        .join(", ")}
                    />
                  )}
                </Field>
                <Field name="email">
                  {(field) => (
                    <Input
                      placeholder="Email"
                      leftIcon={<Mail />}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors
                        .map((err: any) => err.message || String(err))
                        .join(", ")}
                    />
                  )}
                </Field>
                <Field name="address">
                  {(field) => (
                    <Input
                      placeholder="Address"
                      leftIcon={<MapPin />}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors
                        .map((err: any) => err.message || String(err))
                        .join(", ")}
                    />
                  )}
                </Field>
              </View>
            </>
          ) : (
            <ContactList
              contacts={contacts}
              loading={importingContactLoading}
              onClickContact={handleImportContact}
            />
          )}
        </>
      </SlideUpModal>
    </>
  );
};

export default AddCustomerModal;
