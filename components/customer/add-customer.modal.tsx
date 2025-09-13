import { customerService } from "@/database/services/customer.service";
import {
  customerSchema,
  TCustomerSchema,
} from "@/forms/schema/customer.schema";
import { useForm } from "@tanstack/react-form";
import { Mail, Map, Phone, Plus, User } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "../re-usables/button";
import Input from "../re-usables/input";
import { SlideUpModal } from "../re-usables/modal/slide-up.modal";
import { Text } from "../re-usables/text";
import { Toast } from "../re-usables/custom-toaster/toast-service";
import { useCustomers } from "@/database/hooks/useCustomer";

const AddCustomerModal = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {refresh} = useCustomers({
    search: "",
    sortBy: "name",
    limit: 20,
  })

  const { handleSubmit, Field, state } = useForm({
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
      setIsLoading(true);
      await customerService.create({
        name: value.name,
        phone: value.phone,
        email: value.email,
        address: value.address,
      }).then(() => {
        setIsLoading(false);
        setVisible(false);
        Toast.success("Customer added successfully");
        refresh()
      }).catch((err) => {
        setIsLoading(false);
        Toast.error("Failed to add customer");
      });
    },
  });


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
        onClose={() => setVisible(false)}
        title="Add Customer"
        stickyFooter={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              title="Cancel"
              variant="outline"
              style={{ width: "40%" }}
              onPress={() => setVisible(false)}
            />
            <Button
              loading={isLoading}
              disabled={isLoading}
              title="Add Customer"
              style={{ width: "50%" }}
              onPress={() => handleSubmit()}
            />
          </View>
        }
      >
        <Text variant="h6" style={{ marginBottom: 16 }}>
          Customer Details
        </Text>
        <View style={{ flexDirection: "column", gap: 16 }}>
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
                leftIcon={<Map />}
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
      </SlideUpModal>
    </>
  );
};

export default AddCustomerModal;
