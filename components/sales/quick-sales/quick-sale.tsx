import { router } from 'expo-router';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button as OGButton } from '@/components/re-usables/button';
import DatePicker from '@/components/re-usables/date-picker/date-picker';
import { Header } from '@/components/re-usables/header';
import { COLORS } from '@/constants/Colors';
import PXWrapper from '@/layouts/px-wrapper';
import { useSalesStore } from '@/store/useSale';
import { formatNumberWithComma } from '@/utils/format-number';

import AddCustomerSlideup from '../add-customer-slideup';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive dimensions
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 800;

const BUTTON_HEIGHT = isSmallDevice ? 50 : isMediumDevice ? 55 : 60;
const DISPLAY_MIN_HEIGHT = isSmallDevice ? 80 : isMediumDevice ? 100 : 120;

const QuickSaleScreen = () => {
  const [expression, setExpression] = useState('');

  const { customer, setCustomer, invoiceDate, setInvoiceDate, setSubTotal, subTotal } =
    useSalesStore();

  //states
  const [customerSelectionOpen, setCustomerSelectionOpen] = useState<boolean>(false);

  const calculateResult = useMemo(
    () => (expr: string) => {
      try {
        if (!expr) return '0';
        let cleanExpr = expr.replace(/[+\-×÷]$/, '');
        cleanExpr = cleanExpr.replace(/×/g, '*').replace(/÷/g, '/');
        const calculated = eval(cleanExpr);
        return calculated.toString();
      } catch (error) {
        console.log(error);
        return '0';
      }
    },
    [expression],
  );

  const handleNumberPress = (num: string) => {
    const newExpression = expression + num;
    setExpression(newExpression);
    setSubTotal(calculateResult(newExpression));
  };

  const handleOperatorPress = (operator: string) => {
    if (!expression) return;

    const lastChar = expression[expression.length - 1];
    if (['+', '-', '×', '÷'].includes(lastChar)) {
      const newExpression = expression.slice(0, -1) + operator;
      setExpression(newExpression);
    } else {
      const newExpression = expression + operator;
      setExpression(newExpression);
    }
  };

  const handleClear = () => {
    setExpression('');
    setSubTotal('0');
  };

  const handleBackspace = () => {
    const newExpression = expression.slice(0, -1);
    setExpression(newExpression);
    setSubTotal(calculateResult(newExpression));
  };
  const handleEquals = () => () => {
    if (expression) {
      const finalResult = calculateResult(expression);
      setExpression(finalResult);
      setSubTotal(finalResult);
    }
  };

  const Button = ({ value, onPress, style, textStyle }: any) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.buttonText, textStyle]}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <PXWrapper
        footer={
          <OGButton
            size="large"
            title="Record Sales"
            onPress={() => router.push('/checkout')}
            disabled={Number(subTotal) === 0}
            style={{ marginBottom: 10 }}
          />
        }
        header={<Header title="Quick Sales" onBackPress={() => router.back()} />}
      >
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.cashSaleButton}>
              <View style={styles.cashSaleContent}>
                <TouchableOpacity
                  onPress={() => setCustomerSelectionOpen(true)}
                  style={styles.customerSection}
                >
                  {customer ? (
                    <>
                      <View style={styles.customerInfo}>
                        <Text style={styles.customerName} numberOfLines={1}>
                          {customer?.name}
                        </Text>
                        <ChevronRight size={18} />
                      </View>
                      <Text style={styles.customerDue} numberOfLines={1}>
                        Old Due {formatNumberWithComma(customer?.outstanding || 0)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.sectionTitle}>Customer</Text>
                      <View style={styles.customerInfo}>
                        <Text style={styles.selectText}>Select Customer</Text>
                        <ChevronRight size={18} />
                      </View>
                    </>
                  )}
                </TouchableOpacity>

                <DatePicker
                  selectedDate={invoiceDate}
                  onDateChange={setInvoiceDate}
                  renderCustomSelection={({ onPress, formattedDate }) => (
                    <TouchableOpacity onPress={onPress} style={styles.dateSection}>
                      <Text style={styles.sectionTitle}>Invoice Date</Text>
                      <View style={styles.dateInfo}>
                        <Calendar size={14} />
                        <Text style={styles.dateText} numberOfLines={1}>
                          {formattedDate}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>

            <View style={styles.display}>
              <Text style={styles.expression} numberOfLines={2} adjustsFontSizeToFit>
                {expression || '0'}
              </Text>
              <Text style={styles.result} numberOfLines={1} adjustsFontSizeToFit>
                = {formatNumberWithComma(subTotal)}
              </Text>
            </View>
          </View>

          <View style={styles.calculator}>
            <View style={styles.row}>
              <Button value="AC" onPress={handleClear} style={styles.functionButton} />
              <Button
                value="%"
                onPress={() => handleOperatorPress('%')}
                style={styles.functionButton}
              />
              <Button
                value="÷"
                onPress={() => handleOperatorPress('÷')}
                style={styles.functionButton}
              />
              <Button value="⌫" onPress={handleBackspace} style={styles.functionButton} />
            </View>

            <View style={styles.row}>
              <Button value="7" onPress={() => handleNumberPress('7')} />
              <Button value="8" onPress={() => handleNumberPress('8')} />
              <Button value="9" onPress={() => handleNumberPress('9')} />
              <Button
                value="×"
                onPress={() => handleOperatorPress('×')}
                style={styles.operatorButton}
              />
            </View>

            <View style={styles.row}>
              <Button value="4" onPress={() => handleNumberPress('4')} />
              <Button value="5" onPress={() => handleNumberPress('5')} />
              <Button value="6" onPress={() => handleNumberPress('6')} />
              <Button
                value="-"
                onPress={() => handleOperatorPress('-')}
                style={styles.operatorButton}
              />
            </View>

            <View style={styles.row}>
              <Button value="1" onPress={() => handleNumberPress('1')} />
              <Button value="2" onPress={() => handleNumberPress('2')} />
              <Button value="3" onPress={() => handleNumberPress('3')} />
              <Button
                value="+"
                onPress={() => handleOperatorPress('+')}
                style={styles.operatorButton}
              />
            </View>

            <View style={styles.row}>
              <Button value="0" onPress={() => handleNumberPress('0')} style={styles.zeroButton} />
              <Button value="." onPress={() => handleNumberPress('.')} />
              <Button
                value="="
                onPress={handleEquals}
                style={styles.equalsButton}
                textStyle={styles.equalsText}
              />
            </View>
          </View>
        </View>
      </PXWrapper>

      <AddCustomerSlideup
        visible={customerSelectionOpen}
        onClose={() => {
          setCustomerSelectionOpen(false);
        }}
        onSelectCustomer={() => {
          setCustomerSelectionOpen(false);
        }}
        selectedCustomer={customer || null}
        setCustomer={setCustomer}
      />
    </>
  );
};

export default QuickSaleScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 16,
    flexDirection: 'column',
  },
  topSection: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 10,
  },
  cashSaleButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexShrink: 0,
    marginBottom: isSmallDevice ? 10 : 15,
    marginTop: isSmallDevice ? 10 : 15,
  },
  cashSaleContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  customerSection: {
    flexDirection: 'column',
    gap: isSmallDevice ? 6 : 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    padding: isSmallDevice ? 12 : 16,
    justifyContent: 'center',
    width: '50%',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerName: {
    fontSize: isSmallDevice ? 14 : 15,
    fontWeight: '500',
    flex: 1,
  },
  customerDue: {
    fontSize: isSmallDevice ? 14 : 15,
    color: COLORS.error,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 14 : 15,
    fontWeight: '500',
  },
  selectText: {
    fontSize: isSmallDevice ? 14 : 15,
    color: '#666',
  },
  dateSection: {
    flexDirection: 'column',
    gap: isSmallDevice ? 6 : 10,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    padding: isSmallDevice ? 12 : 16,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: isSmallDevice ? 14 : 15,
  },
  display: {
    flex: 1,
    marginTop: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: isSmallDevice ? 20 : 24,
    justifyContent: 'flex-end',
    borderWidth: 1,
    height: DISPLAY_MIN_HEIGHT + 60,
    borderColor: '#E5E5E5',
    marginBottom: 5,
  },
  expression: {
    fontSize: isSmallDevice ? 20 : isMediumDevice ? 22 : 24,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
    marginBottom: 8,
  },
  result: {
    fontSize: isSmallDevice ? 20 : isMediumDevice ? 22 : 24,
    color: '#666',
    textAlign: 'right',
  },
  calculator: {
    flexShrink: 0,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    gap: isSmallDevice ? 8 : 12,
    marginBottom: isSmallDevice ? 8 : 12,
  },
  button: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: isSmallDevice ? 20 : isMediumDevice ? 22 : 24,
    color: '#000',
    fontWeight: '500',
  },
  functionButton: {
    backgroundColor: '#E8E8E8',
  },
  operatorButton: {
    backgroundColor: '#ffff',
  },
  zeroButton: {
    flex: 2,
  },
  equalsButton: {
    backgroundColor: COLORS.primary,
  },
  equalsText: {
    color: '#fff',
    fontSize: isSmallDevice ? 24 : isMediumDevice ? 26 : 28,
  },
});
