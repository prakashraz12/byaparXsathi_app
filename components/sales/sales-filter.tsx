'use client';

import { View } from 'react-native';

import { PaymentStatusOptions } from '@/constants/payment-status';
import {
  DEFAULT_DATE_RANGE_OPTIONS,
  DEFAULT_DATE_RANGE_OPTIONS_ENUMS,
} from '@/utils/date-range-provider';

import BadgeSelector from '../re-usables/badge-selector';
import { Button } from '../re-usables/button';
import DatePicker from '../re-usables/date-picker/date-picker';
import { SlideUpModal } from '../re-usables/modal/slide-up.modal';
import { Text } from '../re-usables/text';

interface SalesFilterSlideUpProps {
  visible: boolean;
  onClose: () => void;
  sortBy: 'asc' | 'desc';
  setSortBy: (sortBy: 'asc' | 'desc') => void;
  dateRangeOptions: (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS];
  setDateRangeOptions: (
    dateRangeOptions: (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS],
  ) => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  paymentType?: string;
  setPaymentType: (paymentType: string) => void;
  paymentStatus: string;
  setPaymentStatus: (paymentStatus: string) => void;
}

const SalesFilterSlideUp = ({
  visible,
  onClose,
  sortBy,
  setSortBy,
  dateRangeOptions,
  setDateRangeOptions,
  startDate,
  endDate,
  setStartDate,
  setPaymentType,
  paymentStatus,
  setPaymentStatus,
  setEndDate,
}: SalesFilterSlideUpProps) => {
  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      height={600 + (dateRangeOptions === DEFAULT_DATE_RANGE_OPTIONS_ENUMS.CUSTOM_RNAGE ? 20 : 0)}
      stickyFooter={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            style={{ flex: 1 }}
            title="Reset"
            onPress={() => {
              setSortBy('asc');
              setDateRangeOptions(DEFAULT_DATE_RANGE_OPTIONS_ENUMS.ALL_TIME);
              setStartDate(null);
              setEndDate(null);
              setPaymentType('');
              setPaymentStatus('');
              onClose();
            }}
          />
        </View>
      }
    >
      <View style={{ marginBottom: 20, marginTop: 6 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 12,
            fontFamily: 'Poppins-SemiBold',
          }}
        >
          Sort By
        </Text>
        <BadgeSelector
          options={[
            { label: 'Asc', value: 'asc' },
            { label: 'Desc', value: 'desc' },
          ]}
          value={sortBy}
          onChange={(value) => setSortBy(value as 'asc' | 'desc')}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 12,
            fontFamily: 'Poppins-SemiBold',
          }}
        >
          Date Range
        </Text>
        <BadgeSelector
          options={DEFAULT_DATE_RANGE_OPTIONS}
          value={dateRangeOptions}
          onChange={(value) => {
            setDateRangeOptions(
              value as (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS],
            );
            if (dateRangeOptions === DEFAULT_DATE_RANGE_OPTIONS_ENUMS.CUSTOM_RNAGE) {
              onClose();
            }
          }}
        />
      </View>

      {dateRangeOptions === DEFAULT_DATE_RANGE_OPTIONS_ENUMS.CUSTOM_RNAGE && (
        <View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <DatePicker
                selectedDate={(startDate ?? new Date()) as Date}
                onDateChange={(d) => setStartDate(d)}
                label="Start Date"
              />
            </View>

            <View style={{ flex: 1 }}>
              <DatePicker
                selectedDate={(endDate ?? new Date()) as Date}
                onDateChange={(d) => setEndDate(d)}
                label="End Date"
              />
            </View>
          </View>
        </View>
      )}
      <View style={{ marginBottom: 10, marginTop: 10 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 12,
            fontFamily: 'Poppins-SemiBold',
          }}
        >
          Payment Status
        </Text>
        <BadgeSelector
          options={PaymentStatusOptions}
          value={paymentStatus}
          onChange={(value) => {
            setPaymentStatus(value);
            onClose();
          }}
          checkedUnchecked={true}
        />
      </View>
    </SlideUpModal>
  );
};

export default SalesFilterSlideUp;
