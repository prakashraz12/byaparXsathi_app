import { router } from 'expo-router';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  FileCheck,
  Lightbulb,
  Link2,
  Minus,
  Plus,
  RefreshCcw,
  Trash2,
  UserPlus,
} from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import AvatarCard from '@/components/re-usables/avatar-card';
import BadgeSelector from '@/components/re-usables/badge-selector';
import { Button } from '@/components/re-usables/button';
import { Toast } from '@/components/re-usables/custom-toaster/toast-service';
import DatePicker from '@/components/re-usables/date-picker/date-picker';
import { Header } from '@/components/re-usables/header';
import { Text } from '@/components/re-usables/text';
import AddCustomerSlideup from '@/components/sales/add-customer-slideup';
import SalesItemCard from '@/components/sales/sales-item-card';
import { COLORS } from '@/constants/Colors';
import useShops from '@/database/hooks/useShops';
import { salesService } from '@/database/services/sales.service';
import PXWrapper from '@/layouts/px-wrapper';
import { useSalesStore } from '@/store/useSale';
import { useSalesItemStore } from '@/store/useSalesItem';
import { useUserStore } from '@/store/useUserStore';
import { formatNumberWithComma } from '@/utils/format-number';
const parseNumber = (value: string): number => Number.parseFloat(value) || 0;

const CheckOutPage = () => {
  const { activeShopId } = useUserStore();
  const { currentPaymentAccount } = useShops();
  const [paymentMode, setPaymentMode] = useState<'PAID' | 'UNPAID' | 'PARTIALLY_PAID'>('PAID');
  const { paymentId, setPaymentId, paidAmount, setPaidAmount } = useSalesStore();
  const { salesItems } = useSalesItemStore();
  const [itemShow, setItemShow] = useState<boolean>(true);
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

      router.back();
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
              <>
                <Text>
                  <UserPlus size={20} color={COLORS.text} />
                </Text>
                <Text size={14} style={{ fontFamily: 'Poppins-Medium' }}>
                  Add Customer
                </Text>
              </>
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
                <Calendar size={26} color={COLORS.text} />
              </View>
              <Text style={{ color: COLORS.text }}>{formattedDate}</Text>
            </View>
            <ChevronRight size={26} color={COLORS.text} />
          </TouchableOpacity>
        )}
      />

      {customer && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 6,
            padding: 13,
            backgroundColor: COLORS.background,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <AvatarCard name={customer?.name || ''} size={50} />
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontSize: 15, fontWeight: '600', marginTop: 10 }}>
                {customer?.name}
              </Text>
              {customer?.outstanding && (
                <Text style={{ fontSize: 13, color: COLORS.success }}>
                  To Receive : {formatNumberWithComma(customer?.outstanding || 0)}
                </Text>
              )}
              {customer?.available_credit && (
                <Text style={{ fontSize: 13, color: COLORS.error }}>
                  To Pay : {formatNumberWithComma(customer?.available_credit || 0)}
                </Text>
              )}
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 50,
                paddingHorizontal: 15,
                paddingVertical: 6,
              }}
            >
              <RefreshCcw size={15} color={COLORS.text} />
              <Text style={{ fontSize: 13, color: COLORS.text }}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCustomer(null)}>
              <Trash2 size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View
        style={{
          borderWidth: 1,
          borderRadius: 6,
          borderColor: COLORS.border,
          backgroundColor: COLORS.background,
          marginTop: 20,
        }}
      >
        {salesItems?.length > 0 && (
          <View style={styles.itemsHeader}>
            <Text size={16} style={{ fontFamily: 'Poppins-Medium' }}>
              Items {!itemShow ? `[${salesItems.length}]` : ''}
            </Text>
            <TouchableOpacity onPress={() => setItemShow(!itemShow)}>
              {itemShow ? (
                <View
                  style={{
                    borderWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    borderColor: COLORS.border,
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ fontSize: 13, color: 'gray' }}>Hide</Text>
                  <Text>
                    <ChevronUp size={18} color={'gray'} />
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    borderWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    borderColor: COLORS.border,
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ fontSize: 13, color: 'gray' }}>View All</Text>
                  <Text>
                    <ChevronDown size={18} color={'gray'} />
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        <View style={{ display: itemShow ? 'flex' : 'none' }}>
          {salesItems?.map((item, index) => (
            <SalesItemCard key={`${item.itemId}-${index}`} item={item} />
          ))}
        </View>
        <View
          style={{
            padding: 5,
            marginVertical: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>Sub Total</Text>
          <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>
            {formatNumberWithComma(subtotal)}
          </Text>
        </View>
      </View>

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
              <Text>
                <FileCheck size={16} color={includeOldDueAmount ? COLORS.primary : 'gray'} />
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.text }}>Include Old Due Amount</Text>
              {includeOldDueAmount && (
                <Text
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
                </Text>
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
              <Text>
                <FileCheck size={16} color={deductedOldAmount ? COLORS.error : 'gray'} />
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.text }}>Deduct from advance </Text>
              {deductedOldAmount && (
                <Text
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
                </Text>
              )}
            </TouchableOpacity>
            {customer && deductedOldAmount && (
              <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', color: COLORS.error }}>
                -{' '}
                {formatNumberWithComma(
                  customer?.available_credit > grandTotal
                    ? grandTotal
                    : customer?.available_credit,
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

      <View
        style={{
          flex: 1,
          marginTop: 20,
          borderWidth: 1,
          borderRadius: 6,
          borderColor: COLORS.border,
          backgroundColor: COLORS.background,
          padding: 15,
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>Payment Mode</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: COLORS.border,
            padding: 5,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: COLORS.border,
            marginTop: 15,
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              backgroundColor: paymentMode === 'PAID' ? COLORS.primary : 'transparent',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: paymentMode === 'PAID' ? COLORS.primary : COLORS.border,
              width: '25%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setPaymentMode('PAID')}
          >
            <Text
              style={{
                color: paymentMode === 'PAID' ? 'white' : COLORS.text,
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
              }}
            >
              Paid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 8,
              paddingVertical: 8,
              backgroundColor: paymentMode === 'UNPAID' ? COLORS.primary : 'transparent',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: paymentMode === 'UNPAID' ? COLORS.primary : COLORS.border,
              width: '28%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setPaymentMode('UNPAID')}
          >
            <Text
              style={{
                color: paymentMode === 'UNPAID' ? 'white' : COLORS.text,
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
              }}
            >
              Unpaid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              backgroundColor: paymentMode === 'PARTIALLY_PAID' ? COLORS.primary : 'transparent',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: paymentMode === 'PARTIALLY_PAID' ? COLORS.primary : COLORS.border,
              width: '31%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setPaymentMode('PARTIALLY_PAID')}
          >
            <Text
              style={{
                color: paymentMode === 'PARTIALLY_PAID' ? 'white' : COLORS.text,
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
              }}
            >
              Partial Paid
            </Text>
          </TouchableOpacity>
        </View>

        {paymentMode !== 'UNPAID' && (
          <View style={{ marginTop: 10 }}>
            <BadgeSelector
              options={
                currentPaymentAccount?.map((i) => ({
                  label: i?.name,
                  value: i?.name,
                })) as any
              }
              value={paymentId || ''}
              onChange={setPaymentId}
            />
          </View>
        )}
        {paymentMode !== 'UNPAID' && paymentMode !== 'PAID' && (
          <View>
            <View style={styles.amountContainer}>
              <View style={styles.totalAmountRow}>
                <Text style={styles.labelText}>Total Amount</Text>
                <Text style={styles.amountText}>{formatNumberWithComma(grandTotal)}</Text>
              </View>
              <View style={styles.receivedAmountRow}>
                <Text style={styles.labelText}>Received Amount</Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  autoFocus
                  focusable
                  value={paidAmount}
                  onChangeText={(text) => setPaidAmount(text)}
                  style={styles.amountInput}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={{ color: COLORS.error }}>Due Amount</Text>
              <Text style={{ color: COLORS.error }}>{formatNumberWithComma(dueAmount)}</Text>
            </View>
          </View>
        )}
        {paymentMode !== 'PAID' && (
          <View
            style={{
              backgroundColor: COLORS.primaryLight,
              padding: 10,
              borderRadius: 6,
              marginTop: 10,
              flexDirection: 'row',
              gap: 10,
              flex: 1,
              overflow: 'visible',
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Lightbulb size={19} color={COLORS.text} />
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'Poppins-Regular',
                color: COLORS.text,
                overflow: 'visible',
              }}
            >
              Unpaid sales and partially paid sales only made when customer is added.
            </Text>
          </View>
        )}
      </View>
      {/* <View
        style={{
          flexDirection: 'column',
          paddingHorizontal: 15,
          marginTop: 15,
          backgroundColor: COLORS.background,
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 6,
          padding: 15,
        }}
      >
       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
         <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>Payable Amount</Text>
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>
          {formatNumberWithComma(grandTotal)}
        </Text>
       </View>
       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
         <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium' }}>Paid Amount</Text>
        <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium' }}>
          {formatNumberWithComma(discountAmount)}
        </Text>
       </View>
      </View> */}
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
  <View style={[styles.sectionRow, { borderTopWidth: 1, borderColor: COLORS.border }]}>
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
      <Link2 size={18} color={COLORS.text} />
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
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      paddingHorizontal: 15,
      paddingVertical: 10,
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
          width: 90,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 10,
          borderRadius: 6,
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
  amountContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginTop: 15,
  },
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
    paddingHorizontal: 15,
    paddingTop: 15,
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
    justifyContent: 'space-between',
    borderBottomWidth: 1,

    borderBottomColor: COLORS.border,
    paddingHorizontal: 15,
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
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    borderRadius: 6,
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
    paddingHorizontal: 10,
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
  totalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  receivedAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
  },
});
export default CheckOutPage;
