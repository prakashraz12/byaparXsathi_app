import { router } from 'expo-router';
import { Calendar, ChevronDown, Link2, Minus, Plus, PlusCircle, Trash2 } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/re-usables/button';
import DatePicker from '@/components/re-usables/date-picker/date-picker';
import { Header } from '@/components/re-usables/header';
import { Text } from '@/components/re-usables/text';
import AddCustomerSlideup from '@/components/sales/add-customer-slideup';
import { COLORS } from '@/constants/Colors';
import Customer from '@/database/model/customer.model';
import PXWrapper from '@/layouts/px-wrapper';
import { useSalesStore } from '@/store/useSale';
import { useSalesItemStore } from '@/store/useSalesItem';
import { formatNumberWithComma } from '@/utils/format-number';

import SalesItemCard from '../../components/sales/sales-item-card';

// Utility functions
const parseNumber = (value: string): number => Number.parseFloat(value) || 0;

const CreateSalesScreen = () => {
  // Basic state
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState('');
  const { bottom } = useSafeAreaInsets();
  const [showAddCustomerSlideup, setShowAddCustomerSlideup] = useState(false);

  const { salesItems, removeSalesItem } = useSalesItemStore();

  const [itemShow, setItemShow] = useState(true);

  const [showDiscountSection, setShowDiscountSection] = useState(false);
  const [showTaxSection, setShowTaxSection] = useState(false);
  const [showAdditionalChargesSection, setShowAdditionalChargesSection] = useState(false);
  const [showRemarksSection, setShowRemarksSection] = useState(false);

  const {
    setDiscountPercentage,
    setDiscountAmount,
    setTaxAmount,
    setTaxPercentage,
    discountAmount,
    discountPercentage,
    taxAmount,
    taxPercentage,
    invoiceDate,
    setInvoiceDate,
    setGrandTotal,
    setSubTotal
  } = useSalesStore();

  const [additionalCharge, setAdditionalCharge] = useState('');

  const handleCustomerPress = useCallback(() => {
    setShowAddCustomerSlideup(true);
  }, []);

  const handleDeleteItem = useCallback((itemId: string) => {
    removeSalesItem(itemId);
  }, []);

  const toggleDiscountSection = useCallback(() => {
    setShowDiscountSection((prev) => !prev);
    setDiscountPercentage(0);
    setDiscountAmount(0);
    setLastEditedDiscount(null);
  }, []);

  const toggleTaxSection = useCallback(() => {
    setShowTaxSection((prev) => !prev);
    setTaxPercentage(0);
    setTaxAmount(0);
    setLastEditedTax(null);
  }, []);

  const toggleRemarksSection = useCallback(() => {
    setShowRemarksSection((prev) => !prev);
    setNotes('');
  }, []);

  const subtotal = useMemo(() => {
    return salesItems.reduce(
      (total, item) =>
        total + (item.quantity || 0) * (item.price || 0) - (item.discountAmount || 0),
      0,
    );
  }, [salesItems]);

  // Track which field was last edited
  const [lastEditedDiscount, setLastEditedDiscount] = useState<'percentage' | 'amount' | null>(
    null,
  );
  const [lastEditedTax, setLastEditedTax] = useState<'percentage' | 'amount' | null>(null);

  // Handle discount percentage change
  const handleDiscountPercentageChange = useCallback(
    (value: string) => {
      setDiscountPercentage(Number(value));
      setLastEditedDiscount('percentage');

      // Auto-calculate amount from percentage
      if (value && subtotal > 0) {
        const calculatedAmount = (subtotal * parseNumber(value)) / 100;
        setDiscountAmount(Number(calculatedAmount?.toFixed(2)));
      } else {
        setDiscountAmount(0);
      }
    },
    [subtotal],
  );

  // Handle discount amount change
  const handleDiscountAmountChange = useCallback(
    (value: string) => {
      setDiscountAmount(Number(value));
      setLastEditedDiscount('amount');

      // Auto-calculate percentage from amount
      if (value && subtotal > 0) {
        const calculatedPercentage = (parseNumber(value) / subtotal) * 100;
        setDiscountPercentage(Number(calculatedPercentage.toFixed(2)));
      } else {
        setDiscountPercentage(0);
      }
    },
    [subtotal],
  );

  const calculatedDiscountAmount = useMemo(() => {
    if (!showDiscountSection || subtotal === 0) return 0;

    const percentValue = parseNumber(discountPercentage?.toString());
    const amountValue = parseNumber(discountAmount?.toString());

    if (lastEditedDiscount === 'percentage' && percentValue > 0) {
      return (subtotal * percentValue) / 100;
    }

    return amountValue;
  }, [showDiscountSection, discountPercentage, discountAmount, subtotal, lastEditedDiscount]);
  const handleTaxPercentageChange = useCallback(
    (value: string) => {
      setTaxPercentage(Number(value));
      setLastEditedTax('percentage');
      const amountAfterDiscount = subtotal - calculatedDiscountAmount;
      if (value && amountAfterDiscount > 0) {
        const calculatedAmount = (amountAfterDiscount * parseNumber(value)) / 100;
        setTaxAmount(Number(calculatedAmount.toFixed(2)));
      } else {
        setTaxAmount(0);
      }
    },
    [subtotal, calculatedDiscountAmount],
  );

  const calculatedTaxAmount = useMemo(() => {
    if (!showTaxSection) return 0;

    const amountAfterDiscount = subtotal - calculatedDiscountAmount;
    const percentValue = parseNumber(taxPercentage?.toString());
    const amountValue = parseNumber(taxAmount?.toString());

    if (lastEditedTax === 'percentage' && percentValue > 0) {
      return (amountAfterDiscount * percentValue) / 100;
    }

    return amountValue;
  }, [showTaxSection, taxPercentage, taxAmount, subtotal, calculatedDiscountAmount, lastEditedTax]);

  const grandTotal = useMemo(() => {
    return subtotal - calculatedDiscountAmount + calculatedTaxAmount + Number(additionalCharge);
  }, [subtotal, calculatedDiscountAmount, calculatedTaxAmount, additionalCharge]);

  // const dueAmount = useMemo(() => {
  //   if (paymentStatus !== 'PARTIALLY_PAID') return 0;
  //   return grandTotal - parseNumber(paidAmount);
  // }, [grandTotal, paidAmount, paymentStatus]);

  // Save handler
  // const handleSave = useCallback(
  //   async (paymentType?: string) => {
  //     if (paymentStatus === null) {
  //       setPaymentSlideup(true);
  //       return;
  //     }

  //     if (paymentStatus !== 'UNPAID' && paymentType === undefined) {
  //       setPaymentModeSlideup(true);
  //       return;
  //     }

  //     if (!activeShopId) {
  //       Toast.error('Please select a shop');
  //       return;
  //     }
  //     const calculatedPaidAmount =
  //       paymentStatus === 'PAID'
  //         ? grandTotal
  //         : paymentStatus === 'PARTIALLY_PAID'
  //           ? parseNumber(paidAmount)
  //           : 0;

  //     const response = await salesService.create(
  //       {
  //         invoiceDate: selectedDate.getTime(),
  //         grandTotalAmount: grandTotal,
  //         subTotalAmount: subtotal,
  //         discountAmount: calculatedDiscountAmount,
  //         taxAmount: calculatedTaxAmount,
  //         additionalAmount: Number(additionalCharge),
  //         oldDueAmount: 0,
  //         dueAmount: paymentStatus === 'PARTIALLY_PAID' ? dueAmount : 0,
  //         paidAmount: calculatedPaidAmount,
  //         remarks: notes,
  //         paymentType: paymentType,
  //         status: paymentStatus,
  //         customerId: customer?.id || '',
  //       },
  //       activeShopId,
  //       salesItems,
  //     );

  //     if (response?.success) {
  //       Toast.success(response?.message as string);
  //       useSalesItemStore.setState({ salesItems: [] });
  //       setDiscountAmount('');
  //       setDiscountPercentage('');
  //       setTaxAmount('');
  //       setTaxPercentage('');
  //       setNotes('');
  //       setShowDiscountSection(false);
  //       setShowTaxSection(false);
  //       setShowAdditionalChargesSection(false);
  //       setShowRemarksSection(false);
  //       router.back();
  //     }
  //   },
  //   [
  //     paymentStatus,
  //     selectedDate,
  //     grandTotal,
  //     subtotal,
  //     calculatedDiscountAmount,
  //     calculatedTaxAmount,
  //     additionalCharge,
  //     dueAmount,
  //     paidAmount,
  //     notes,
  //     salesItems,
  //     activeShopId,
  //     customer?.id,
  //   ],
  // );

  const isSalesButtonDisabled = grandTotal === 0 || salesItems.length === 0;

  return (
    <PXWrapper
      header={
        <Header
          title="Add Sale"
          onBackPress={() => {
            useSalesItemStore.setState({ salesItems: [] });
            router.back();
          }}
        />
      }
      footer={
        <Button
          style={{ marginBottom: bottom * 0.2 }}
          disabled={isSalesButtonDisabled}
          title={`Proceed To Sale ${formatNumberWithComma(grandTotal)}`}
          onPress={() => {
            router.push('/checkout');
            setSubTotal(subtotal);
            setGrandTotal(grandTotal);
          }}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={handleCustomerPress}
            activeOpacity={0.7}
          >
            {customer?.outstanding ? (
              <Text style={{ fontSize: 12, color: COLORS.error }}>{customer?.outstanding}</Text>
            ) : (
              <Text style={styles.label}>Customer</Text>
            )}
            <View style={styles.inputContent}>
              <Text style={styles.inputValue}>{customer?.name || 'Select Customer'}</Text>
              <ChevronDown size={18} color="#666" />
            </View>
          </TouchableOpacity>

          <DatePicker
            selectedDate={invoiceDate}
            onDateChange={setInvoiceDate}
            renderCustomSelection={({ onPress, formattedDate }) => (
              <TouchableOpacity style={styles.inputBox} onPress={onPress} activeOpacity={0.7}>
                <Text style={styles.label}>Date</Text>
                <View style={styles.inputContent}>
                  <Text style={styles.inputValue}>{formattedDate}</Text>
                  <Calendar size={18} color="#666" />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.addItemsButton}
          onPress={() => router.push('/(routes)/sales/sales-items')}
          activeOpacity={0.7}
        >
          <PlusCircle size={25} color={'white'} fill={COLORS.primary} />
          <Text style={styles.addItemsText}>Add Items</Text>
        </TouchableOpacity>

        <View>
          {salesItems?.length > 0 && (
            <View style={styles.itemsHeader}>
              <Text size={16} style={{ fontFamily: 'Poppins-Medium' }}>
                Items
              </Text>
              <TouchableOpacity onPress={() => setItemShow(!itemShow)}>
                {itemShow ? (
                  <Minus size={20} color={COLORS.primary} />
                ) : (
                  <Plus size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            </View>
          )}
          <View style={{ display: itemShow ? 'flex' : 'none' }}>
            {salesItems?.map((item, index) => (
              <SalesItemCard
                key={`${item.itemId}-${index}`}
                item={item}
                handleDeleteItem={handleDeleteItem}
              />
            ))}
          </View>
        </View>

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>{formatNumberWithComma(subtotal)}</Text>
        </View>

        {showDiscountSection ? (
          <DiscountSection
            discountPercentage={discountPercentage?.toString()}
            discountAmount={discountAmount?.toString()}
            onDiscountPercentageChange={handleDiscountPercentageChange}
            onDiscountAmountChange={handleDiscountAmountChange}
            onRemove={toggleDiscountSection}
          />
        ) : (
          <AddSectionButton label="Add Discount" onPress={toggleDiscountSection} />
        )}

        {showTaxSection ? (
          <TaxSection
            taxPercentage={taxPercentage?.toString()}
            taxAmount={taxAmount?.toString()}
            onTaxPercentageChange={handleTaxPercentageChange}
            onRemove={toggleTaxSection}
          />
        ) : (
          <AddSectionButton label="Add Tax" onPress={toggleTaxSection} />
        )}

        {showAdditionalChargesSection ? (
          <>
            <AdditionalChargeRow
              charge={additionalCharge}
              setCharge={setAdditionalCharge}
              setShowAdditionalChargesSection={setShowAdditionalChargesSection}
            />
          </>
        ) : (
          <AddSectionButton
            label="Add Additional Charge"
            onPress={() => setShowAdditionalChargesSection(true)}
          />
        )}

        {showRemarksSection ? (
          <RemarksSection notes={notes} onNotesChange={setNotes} onRemove={toggleRemarksSection} />
        ) : (
          <AddSectionButton label="Add Remarks" onPress={toggleRemarksSection} />
        )}

        <View style={styles.grandTotalContainer}>
          <Text style={styles.grandTotalLabel}>Total Amount</Text>
          <Text style={styles.grandTotalValue}>{formatNumberWithComma(grandTotal)}</Text>
        </View>
      </View>

    
    </PXWrapper>
  );
};

// Extracted Components
const DiscountSection = ({
  discountPercentage,
  discountAmount,
  onDiscountPercentageChange,
  onDiscountAmountChange,
  onRemove,
}: {
  discountPercentage: string;
  discountAmount: string;
  onDiscountPercentageChange: (value: string) => void;
  onDiscountAmountChange: (value: string) => void;
  onRemove: () => void;
}) => (
  <View style={styles.sectionRow}>
    <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
      <Trash2 size={20} color="#ef4444" />
    </TouchableOpacity>
    <Text style={styles.sectionLabel}>Discount</Text>
    <View style={styles.dualInputContainer}>
      <View style={styles.inputWithUnit}>
        <TextInput
          style={styles.mediumInput}
          value={discountPercentage}
          onChangeText={onDiscountPercentageChange}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <Text style={styles.unitText}>%</Text>
      </View>
      <Link2 size={18} color={COLORS.primary} />
      <View style={styles.inputWithUnit}>
        <Text style={styles.unitText}>Rs.</Text>
        <TextInput
          style={styles.mediumInput}
          value={discountAmount}
          onChangeText={onDiscountAmountChange}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>
    </View>
  </View>
);

const TaxSection = ({
  taxPercentage,
  onTaxPercentageChange,
  onRemove,
  taxAmount,
}: {
  taxPercentage: string;
  onTaxPercentageChange: (value: string) => void;
  onRemove: () => void;
  taxAmount: string;
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      justifyContent: 'space-between',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
      <Text style={styles.sectionLabel}>Tax</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          width: 100,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.primary,
          padding: 5,
        }}
      >
        <TextInput
          style={styles.mediumInput}
          value={taxPercentage}
          onChangeText={onTaxPercentageChange}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <Text style={styles.unitText}>%</Text>
      </View>
      <Text style={styles.unitText}>{formatNumberWithComma(Number(taxAmount))}</Text>
    </View>
  </View>
);

const AdditionalChargeRow = ({
  charge,
  setCharge,
  setShowAdditionalChargesSection,
}: {
  charge: string;
  setCharge: (value: string) => void;
  setShowAdditionalChargesSection: (value: boolean) => void;
}) => (
  <View style={styles.sectionRow}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <TouchableOpacity
        onPress={() => {
          setCharge('');
          setShowAdditionalChargesSection(false);
        }}
        activeOpacity={0.7}
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
      <Text style={styles.sectionLabel}>Additional Charge</Text>
    </View>
    <View style={styles.chargeAmountContainer}>
      <Text style={styles.unitText}>Rs.</Text>
      <TextInput
        style={styles.chargeAmountInput}
        value={charge}
        onChangeText={setCharge}
        placeholder="0"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />
    </View>
  </View>
);

const RemarksSection = ({
  notes,
  onNotesChange,
  onRemove,
}: {
  notes: string;
  onNotesChange: (value: string) => void;
  onRemove: () => void;
}) => (
  <View style={styles.remarksContainer}>
    <View style={styles.remarksHeader}>
      <Text style={styles.remarksLabel}>Notes or Remarks</Text>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
    <TextInput
      style={styles.notesInput}
      value={notes}
      onChangeText={onNotesChange}
      placeholder="Enter notes or remarks..."
      placeholderTextColor="#999"
      multiline
      numberOfLines={3}
      textAlignVertical="top"
    />
  </View>
);

const AddSectionButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <View style={styles.addSectionButtonContainer}>
    <TouchableOpacity style={styles.addSectionButton} onPress={onPress} activeOpacity={0.7}>
      <Plus size={18} color={COLORS.primary} />
      <Text style={styles.addSectionText}>{label}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  inputBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  addItemsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
  },
  addItemsText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: 'Poppins-Medium',
    marginTop: 4,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtotalLabel: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Poppins-Medium',
  },
  subtotalValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    minWidth: 70,
  },
  dualInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWithUnit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    padding: 10,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  mediumInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
    minWidth: 40,
  },
  unitText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  chargeNameInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 10,
  },
  chargeAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingHorizontal: 10,
  },
  chargeAmountInput: {
    fontSize: 14,
    minWidth: 60,
    textAlign: 'right',
  },
  addSectionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  addSectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  addSectionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  grandTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  grandTotalValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  remarksContainer: {
    gap: 8,
  },
  remarksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  remarksLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Poppins-Medium',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  primaryText: {
    color: COLORS.primary,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  amountInputField: {
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
    width: 100,
  },
  errorText: {
    color: COLORS.error,
  },
});

export default CreateSalesScreen;
