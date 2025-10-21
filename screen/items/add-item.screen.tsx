import AvatarCard from "@/components/re-usables/avatar-card";
import { Button } from "@/components/re-usables/button";
import CustomSwitch from "@/components/re-usables/custom-switch";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import { Header } from "@/components/re-usables/header";
import HoverSelector from "@/components/re-usables/hover-selector";
import CustomInput from "@/components/re-usables/input";
import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
import useShops from "@/database/hooks/useShops";
import { itemService } from "@/database/services/item.service";
import { itemSchema, TItemSchema } from "@/forms/schema/add-items.schema";
import useGetMeasuringUnits from "@/hooks/useGetMeasuringUnits";
import PXWrapper from "@/layouts/px-wrapper";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { Check, Package, DollarSign, Archive } from "lucide-react-native";
import { TouchableOpacity, View, StyleSheet } from "react-native";

const AddItemScreen = () => {
  const { activeShop } = useShops();
  const { measuringUnits } = useGetMeasuringUnits({});

  const form = useForm({
    defaultValues: {
      itemName: "",
      costPrice: "",
      sellingPrice: "",
      measurementUnit: "",
      openingStock: "",
      currentStock: "",
      lowStockAlert: "",
      isStockEnabled: false,
      isActive: true,
    },
    validators: {
      onChangeAsync: itemSchema as any,
    },
    onSubmit: async ({ value }: { value: TItemSchema }) => {
      const response = await itemService.create(
        {
          itemName: value.itemName,
          costPrice: Number(value.costPrice),
          sellingPrice: Number(value.sellingPrice),
          measurementUnit: value.measurementUnit,
          openingStock: Number(value.openingStock),
          currentStock: Number(value.currentStock),
          lowStockAlert: Number(value.lowStockAlert),
          isStockEnabled: value.isStockEnabled,
          isActive: value.isActive,
        },
        activeShop?.id || ""
      );
      if(response?.statusCode === 201){
        Toast.success(response?.message)
        router.back()
      }
    },
    
  });

  return (
    <PXWrapper
      footer={
        <View style={styles.footerContainer}>
          <Button 
            variant="ghost" 
            title="Cancel" 
            style={styles.cancelButton}
            onPress={() => router.back()}
          />
          <Button 
            title="Save Item" 
            style={styles.saveButton} 
            onPress={form.handleSubmit} 
          />
        </View>
      }
    >
      <Header title="Add Item" onBackPress={() => router.back()} />
      
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Package size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Basic Information</Text>
        </View>
        
        <form.Field name="itemName">
          {(field) => (
            <CustomInput
              placeholder="Enter item name"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors
                .map((err: any) => err.message || String(err))
                .join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="measurementUnit">
          {(field) => (
            <HoverSelector
              title="Measuring Units"
              value={field?.state.value}
              onChange={(d) => field.handleChange(d)}
              data={measuringUnits}
              placeholder="Select measuring unit"
              renderItem={(item, onSelect, index) => (
                <TouchableOpacity
                  onPress={() => onSelect(item?.shortForm)}
                  key={index}
                  style={styles.unitItem}
                >
                  <View style={styles.unitContent}>
                    <AvatarCard name={item.shortForm} size={45} />
                    <View style={styles.unitText}>
                      <Text style={styles.unitLabel}>{item.label}</Text>
                      <Text style={styles.unitShortForm}>
                        {item.shortForm}
                      </Text>
                    </View>
                  </View>
                  {field?.state.value === item?.shortForm && (
                    <Check size={20} color={COLORS.primary || "#007AFF"} />
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </form.Field>

        {/* Pricing Section */}
        <View style={styles.sectionHeader}>
          <DollarSign size={20} color={COLORS.primary || "#007AFF"} />
          <Text style={styles.sectionTitle}>Pricing</Text>
        </View>
        
        <View style={styles.priceRow}>
          <View style={styles.priceField}>
            <Text style={styles.fieldLabel}>Cost Price</Text>
            <form.Field name="costPrice">
              {(field) => (
                <CustomInput
                  placeholder="0.00"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  keyboardType="numeric"
                  error={field.state.meta.errors
                    .map((err: any) => err.message || String(err))
                    .join(", ")}
                />
              )}
            </form.Field>
          </View>

          <View style={styles.priceField}>
            <Text style={styles.fieldLabel}>Selling Price</Text>
            <form.Field name="sellingPrice">
              {(field) => (
                <CustomInput
                  placeholder="0.00"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  keyboardType="numeric"
                  error={field.state.meta.errors
                    .map((err: any) => err.message || String(err))
                    .join(", ")}
                />
              )}
            </form.Field>
          </View>
        </View>

        {/* Stock Management Section */}
        <View style={styles.sectionHeader}>
          <Archive size={20} color={COLORS.primary || "#007AFF"} />
          <Text style={styles.sectionTitle}>Stock Management</Text>
        </View>

        <View style={styles.switchContainer}>
          <form.Field name="isStockEnabled">
            {(field) => (
              <CustomSwitch
                value={field.state.value}
                onValueChange={(s) => {
                  field.handleChange(s);
                }}
                label="Enable Stock Tracking"
              />
            )}
          </form.Field>
        </View>

        <form.Subscribe
          selector={(state) => state.values.isStockEnabled === true}
        >
          {(isStockEnabled) =>
            isStockEnabled && (
              <View style={styles.stockFields}>
                <View style={styles.stockRow}>
                  <View style={styles.stockField}>
                    <Text style={styles.fieldLabel}>Opening Stock</Text>
                    <form.Field name="openingStock">
                      {(field) => (
                        <CustomInput
                          placeholder="0"
                          value={field.state.value}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                          keyboardType="numeric"
                          error={field.state.meta.errors
                            .map((err: any) => err.message || String(err))
                            .join(", ")}
                        />
                      )}
                    </form.Field>
                  </View>

                  <View style={styles.stockField}>
                    <Text style={styles.fieldLabel}>Current Stock</Text>
                    <form.Field name="currentStock">
                      {(field) => (
                        <CustomInput
                          placeholder="0"
                          value={field.state.value}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                          keyboardType="numeric"
                          error={field.state.meta.errors
                            .map((err: any) => err.message || String(err))
                            .join(", ")}
                        />
                      )}
                    </form.Field>
                  </View>
                </View>

                <View>
                  <Text style={styles.fieldLabel}>Low Stock Alert</Text>
                  <form.Field name="lowStockAlert">
                    {(field) => (
                      <CustomInput
                        placeholder="Set minimum stock level"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        keyboardType="numeric"
                        error={field.state.meta.errors
                          .map((err: any) => err.message || String(err))
                          .join(", ")}
                      />
                    )}
                  </form.Field>
                </View>
              </View>
            )
          }
        </form.Subscribe>
      </View>
    </PXWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    gap: 12,
  },
  priceField: {
    flex: 1,
  },
  unitItem: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border || "#E5E5E5",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  unitContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  unitText: {
    flexDirection: "column",
    gap: 2,
  },
  unitLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  unitShortForm: {
    fontSize: 13,
    color: COLORS.textLight || "#888",
  },
  switchContainer: {
    paddingVertical: 4,
  },
  stockFields: {
    gap: 16,
  },
  stockRow: {
    flexDirection: "row",
    gap: 12,
  },
  stockField: {
    flex: 1,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal:10,
  },
  cancelButton: {
    flex: 0.4,
  },
  saveButton: {
    flex: 1,
  },
});

export default AddItemScreen;