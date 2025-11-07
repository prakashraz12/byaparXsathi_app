import { router } from 'expo-router';
import {
  Calendar,
  Check,
  ChevronRight,
  FileCheck,
  Minus,
  Plus,
  UserPlus,
} from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import TaxSection from '@/components/checkout/tax-section';
import { Button } from '@/components/re-usables/button';
import { Toast } from '@/components/re-usables/custom-toaster/toast-service';
import DatePicker from '@/components/re-usables/date-picker/date-picker';
import { Header } from '@/components/re-usables/header';
import { Text } from '@/components/re-usables/text';
import AddCustomerSlideup from '@/components/sales/add-customer-slideup';
import { COLORS } from '@/constants/Colors';
import useShops from '@/database/hooks/useShops';
import { salesService } from '@/database/services/sales.service';
import PXWrapper from '@/layouts/px-wrapper';
import { useSalesStore } from '@/store/useSale';
import { useSalesItemStore } from '@/store/useSalesItem';
import { useUserStore } from '@/store/useUserStore';
import { formatNumberWithComma } from '@/utils/format-number';

import AdditionalChargeRow from './additional-charge-row';
import DiscountSection from './discount-section';
import PaymentMode from './payment-mode';
import RemarksSection from './remark-section';
import SalesItems from './sales-items';
import SelectedCustomer from './slected-customer';
const parseNumber = (value: string): number => Number.parseFloat(value) || 0;

const CheckOutPage = () => {
  const { activeShopId } = useUserStore();
  const { currentPaymentAccount } = useShops();
  const [paymentMode, setPaymentMode] = useState<'PAID' | 'UNPAID' | 'PARTIALLY_PAID'>('PAID');
  const { paymentId, setPaymentId, paidAmount, setPaidAmount } = useSalesStore();
  const { salesItems } = useSalesItemStore();
  const [showAddCustomerSlideup, setShowAddCustomerSlideup] = useState<boolean>(false);
  const [includeOldDueAmount, setIncludeOldDueAmount] = useState(false);
  const [deductedOldAmount, setDeducatedOldAmount] = useState(false);

  const [showDiscountSection, setShowDiscountSection] = useState<boolean>(false);

  const [showTaxSection, setShowTaxSection] = useState<boolean>(false);

  const [showAdditionalChargesSection, setShowAdditionalChargesSection] = useState<boolean>(false);

  const [showRemarksSection, setShowRemarksSection] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const toggleDiscountSection = () => setShowDiscountSection(!showDiscountSection);
  const toggleTaxSection = () => setShowTaxSection(!showTaxSection);

  const toggleRemarksSection = () => setShowRemarksSection(!showRemarksSection);

  const {
    discountAmount,
    setDiscountAmount,
    discountPercentage,
    setDiscountPercentage,
    taxAmount,
    setTaxAmount,
    taxPercentage,
    setTaxPercentage,
    additionalAmount,
    setAdditionalAmount,
    invoiceDate,
    setInvoiceDate,
    customer,
    setCustomer,
  } = useSalesStore();

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
      setDiscountPercentage(value);
      setLastEditedDiscount('percentage');

      // Auto-calculate amount from percentage
      if (value && subtotal > 0) {
        const calculatedAmount = (subtotal * parseNumber(value)) / 100;
        setDiscountAmount(calculatedAmount?.toFixed(2));
      } else {
        setDiscountAmount('');
      }
    },
    [subtotal],
  );

  // Handle discount amount change
  const handleDiscountAmountChange = useCallback(
    (value: string) => {
      setDiscountAmount(value);
      setLastEditedDiscount('amount');

      // Auto-calculate percentage from amount
      if (value && subtotal > 0) {
        const calculatedPercentage = (parseNumber(value) / subtotal) * 100;
        setDiscountPercentage(calculatedPercentage.toFixed(2));
      } else {
        setDiscountPercentage('');
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
      setTaxPercentage(value);
      setLastEditedTax('percentage');
      const amountAfterDiscount = subtotal - calculatedDiscountAmount;
      if (value && amountAfterDiscount > 0) {
        const calculatedAmount = (amountAfterDiscount * parseNumber(value)) / 100;
        setTaxAmount(calculatedAmount.toFixed(2));
      } else {
        setTaxAmount('');
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
    return subtotal - calculatedDiscountAmount + calculatedTaxAmount + Number(additionalAmount);
  }, [subtotal, calculatedDiscountAmount, calculatedTaxAmount, additionalAmount]);

  const payableAmount = useMemo(() => {
    const totalDue = grandTotal + (customer?.outstanding || 0);
    const creditToDeduct = deductedOldAmount ? customer?.available_credit || 0 : 0;

    const amount = totalDue - creditToDeduct;

    return amount > 0 ? amount : 0;
  }, [grandTotal, customer?.outstanding, customer?.available_credit, deductedOldAmount]);

  const dueAmount = useMemo(() => {
    if (paymentMode === 'PAID') return 0;
    return Number(grandTotal) - Number(paidAmount);
  }, [grandTotal, paidAmount, paymentMode]);

  const handleSave = useCallback(async () => {
    if (paymentMode === null) {
      return;
    }

    if (!activeShopId) {
      Toast.error('Please select a shop');
      return;
    }
    const calculatedPaidAmount =
      paymentMode === 'PAID'
        ? payableAmount
        : paymentMode === 'PARTIALLY_PAID'
          ? parseNumber(paidAmount?.toString() || '0')
          : 0;

    const response = await salesService.create(
      {
        invoiceDate: invoiceDate.getTime(),
        grandTotalAmount: grandTotal,
        subTotalAmount: subtotal,
        discountAmount: calculatedDiscountAmount,
        taxAmount: calculatedTaxAmount,
        additionalAmount: Number(additionalAmount),
        payableAmount: payableAmount,
        amountDeducted:
          deductedOldAmount && customer && customer?.available_credit
            ? Number(grandTotal) > Number(customer?.available_credit)
              ? customer?.available_credit
              : grandTotal
            : 0,
        oldDueAmount: includeOldDueAmount ? Number(customer?.outstanding) : 0,
        dueAmount: paymentMode !== 'PAID' ? dueAmount : 0,
        paidAmount: calculatedPaidAmount,
        remarks: notes,
        paymentType: paymentId,
        status:
          paymentMode === 'PAID'
            ? 'PAID'
            : paymentMode === 'PARTIALLY_PAID' && Number(paidAmount) > 0
              ? 'PARTIALLY_PAID'
              : 'UNPAID',
        customerId: customer?.id,
        customerName: customer?.name,
      },
      activeShopId,
      salesItems,
    );

    if (response?.success) {
      Toast.success(response?.message as string);
      useSalesItemStore.setState({ salesItems: [] });
      setNotes('');
      setShowDiscountSection(false);
      setShowTaxSection(false);
      setShowAdditionalChargesSection(false);
      setShowRemarksSection(false);
      setCustomer(null);
      setIncludeOldDueAmount(false);
      setDiscountAmount('');
      setDiscountPercentage('');
      setTaxAmount('');
      setAdditionalAmount('');
      setPaidAmount('');
      setNotes('');
      setPaymentId('');
      setInvoiceDate(new Date());

      router.replace('/(tabs)/sales');
    }
  }, [
    subtotal,
    calculatedDiscountAmount,
    calculatedTaxAmount,
    additionalAmount,
    dueAmount,
    paidAmount,
    notes,
    salesItems,
    activeShopId,
    invoiceDate,
    grandTotal,
    paymentMode,
    paymentId,
    customer,
    payableAmount,
    includeOldDueAmount,
    additionalAmount,
  ]);

  const isDisabled = salesItems.length === 0 && paymentId === null;

  return (
    <PXWrapper
      header={
        <Header
          title="Checkout"
          onBackPress={() => router.back()}
          rightComponent={
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderWidth: 1,
                borderColor: COLORS.primary,
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 14, color: COLORS.primary }}>Add Items</Text>
            </TouchableOpacity>
          }
        />
      }
      footer={
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 15,
            borderTopWidth: 1,
            borderColor: COLORS.border,
            paddingTop: 15,
          }}
        >
          {!customer && (
            <TouchableOpacity
              onPress={() => setShowAddCustomerSlideup(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <View>
                <Text>
                  <UserPlus size={20} color={COLORS.text} />
                </Text>
                <Text size={14} style={{ fontFamily: 'Poppins-Medium' }}>
                  Add Customer
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <Button
            disabled={isDisabled}
            style={{ flex: 1 }}
            title="Confirm Sale"
            onPress={() => {
              handleSave();
            }}
          />
        </View>
      }
    >
      <DatePicker
        selectedDate={invoiceDate}
        onDateChange={(date) => setInvoiceDate(date)}
        renderCustomSelection={({ onPress, formattedDate }) => (
          <TouchableOpacity
            onPress={onPress}
            style={{
              padding: 15,
              borderWidth: 1,
              borderRadius: 6,
              borderColor: COLORS.border,
              backgroundColor: COLORS.background,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ borderRightWidth: 1, borderColor: COLORS.border, paddingRight: 10 }}>
                <View>
                  <Calendar size={26} color={COLORS.secondary} />
                </View>
              </View>
              <Text style={{ color: COLORS.secondary }}>{formattedDate}</Text>
            </View>
            <View>
              <ChevronRight size={26} color={COLORS.secondary} />
            </View>
          </TouchableOpacity>
        )}
      />

      {customer && <SelectedCustomer customer={customer} setCustomer={setCustomer} />}
      <SalesItems subtotal={subtotal} />
      <View
        style={{
          marginTop: 20,
          backgroundColor: COLORS.background,
          paddingTop: 8,
          paddingBottom: 15,
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 6,
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Poppins-Medium',
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          Bill Details
        </Text>
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
              charge={additionalAmount?.toString()}
              setCharge={(value: string) => setAdditionalAmount(parseNumber(value)?.toFixed(2))}
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

        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>Grand Total</Text>
          <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>
            {formatNumberWithComma(grandTotal)}
          </Text>
        </View>
        {customer && customer?.outstanding && customer?.outstanding > 0 && (
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => setIncludeOldDueAmount(!includeOldDueAmount)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                borderWidth: 1,
                borderColor: includeOldDueAmount ? COLORS.primary : COLORS.border,
                borderRadius: 6,
                paddingHorizontal: 7,
                paddingVertical: 4,
              }}
            >
              <View>
                <FileCheck size={16} color={includeOldDueAmount ? COLORS.primary : 'gray'} />
              </View>
              <Text style={{ fontSize: 12, color: COLORS.text }}>Include Old Due Amount</Text>
              {includeOldDueAmount && (
                <View
                  style={{
                    width: 13,
                    height: 13,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: COLORS.primary,
                  }}
                >
                  <Check size={15} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
            {includeOldDueAmount && customer && (
              <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', color: COLORS.success }}>
                + {formatNumberWithComma(customer?.outstanding)}
              </Text>
            )}
          </View>
        )}
        {customer && customer?.available_credit && customer?.available_credit > 0 && (
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => setDeducatedOldAmount(!deductedOldAmount)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                borderWidth: 1,
                borderColor: deductedOldAmount ? COLORS.error : COLORS.border,
                borderRadius: 6,
                paddingHorizontal: 7,
                paddingVertical: 4,
              }}
            >
              <View>
                <FileCheck size={16} color={deductedOldAmount ? COLORS.error : 'gray'} />
              </View>
              <Text style={{ fontSize: 12, color: COLORS.text }}>Deduct from advance </Text>
              {deductedOldAmount && (
                <View
                  style={{
                    width: 13,
                    height: 13,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: COLORS.error,
                  }}
                >
                  <Minus size={15} color={COLORS.error} />
                </View>
              )}
            </TouchableOpacity>
            {customer && deductedOldAmount && (
              <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', color: COLORS.error }}>
                -{' '}
                {formatNumberWithComma(
                  customer?.available_credit > grandTotal ? grandTotal : customer?.available_credit,
                )}
              </Text>
            )}
          </View>
        )}
        {(includeOldDueAmount || deductedOldAmount) && customer && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15 }}>Payable Amount</Text>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15 }}>
              {formatNumberWithComma(payableAmount)}
            </Text>
          </View>
        )}
      </View>

      {payableAmount > 0 && (
        <PaymentMode
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          paymentId={paymentId || ''}
          setPaymentId={setPaymentId}
          paidAmount={paidAmount || ''}
          setPaidAmount={setPaidAmount}
          grandTotal={grandTotal}
          dueAmount={dueAmount}
          currentPaymentAccount={currentPaymentAccount}
        />
      )}

      <View style={{ height: 100 }} />
      {showAddCustomerSlideup && (
        <AddCustomerSlideup
          visible={showAddCustomerSlideup}
          onClose={() => setShowAddCustomerSlideup(false)}
          setCustomer={setCustomer}
          selectedCustomer={customer || null}
        />
      )}
    </PXWrapper>
  );
};

const AddSectionButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <View style={styles.addSectionButtonContainer}>
    <TouchableOpacity style={styles.addSectionButton} onPress={onPress} activeOpacity={0.7}>
      <Plus size={18} color={COLORS.primary} />
      <Text style={styles.addSectionText}>{label}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  addSectionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  addSectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  addSectionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
});
export default CheckOutPage;
