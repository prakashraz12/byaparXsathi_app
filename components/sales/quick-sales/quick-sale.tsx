"use client";

import { Header } from "@/components/re-usables/header";
import { COLORS } from "@/constants/Colors";
import PXWrapper from "@/layouts/px-wrapper";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QuickSaleScreen = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");

  const calculateResult = (expr: string) => {
    try {
      if (!expr) return "0";
      let cleanExpr = expr.replace(/[+\-×÷]$/, "");
      cleanExpr = cleanExpr.replace(/×/g, "*").replace(/÷/g, "/");
      const calculated = eval(cleanExpr);
      return calculated.toString();
    } catch (error) {
      return "0";
    }
  };

  const handleNumberPress = (num: string) => {
    const newExpression = expression + num;
    setExpression(newExpression);
    setResult(calculateResult(newExpression));
  };

  const handleOperatorPress = (operator: string) => {
    if (!expression) return;

    // Replace last operator if there is one
    const lastChar = expression[expression.length - 1];
    if (["+", "-", "×", "÷"].includes(lastChar)) {
      const newExpression = expression.slice(0, -1) + operator;
      setExpression(newExpression);
    } else {
      const newExpression = expression + operator;
      setExpression(newExpression);
    }
  };

  const handleClear = () => {
    setExpression("");
    setResult("0");
  };

  const handleBackspace = () => {
    const newExpression = expression.slice(0, -1);
    setExpression(newExpression);
    setResult(calculateResult(newExpression));
  };

  const handleEquals = () => {
    if (expression) {
      const finalResult = calculateResult(expression);
      setExpression(finalResult);
      setResult(finalResult);
    }
  };

  const Button = ({ value, onPress, style, textStyle }: any) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <PXWrapper
      footer={
        <TouchableOpacity style={styles.recordButton}>
          <Text style={styles.recordButtonText}>Record Sales</Text>
        </TouchableOpacity>
      }
      header={<Header title="Quick Sales" onBackPress={() => router.back()} />}
    >
      <View
        style={[
          styles.content,
          { height: Dimensions.get("window").height - 180 },
        ]}
      >
        <View style={styles.topSection}>
          {/* Cash Sale Button */}
          <TouchableOpacity style={styles.cashSaleButton}>
            <View style={styles.cashSaleContent}>
              <View style={styles.cashIcon}>
                <Text style={styles.cashIconText}>💵</Text>
              </View>
              <Text style={styles.cashSaleText}>Cash Sale</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.display}>
            <Text style={styles.expression}>{expression || "0"}</Text>
            <Text style={styles.result}>= {result}</Text>
          </View>
        </View>

        <View style={styles.calculator}>
          <View style={styles.row}>
            <Button
              value="AC"
              onPress={handleClear}
              style={styles.functionButton}
            />
            <Button
              value="%"
              onPress={() => handleOperatorPress("%")}
              style={styles.functionButton}
            />
            <Button
              value="÷"
              onPress={() => handleOperatorPress("÷")}
              style={styles.functionButton}
            />
            <Button
              value="⌫"
              onPress={handleBackspace}
              style={styles.functionButton}
            />
          </View>

          <View style={styles.row}>
            <Button value="7" onPress={() => handleNumberPress("7")} />
            <Button value="8" onPress={() => handleNumberPress("8")} />
            <Button value="9" onPress={() => handleNumberPress("9")} />
            <Button
              value="×"
              onPress={() => handleOperatorPress("×")}
              style={styles.operatorButton}
            />
          </View>

          <View style={styles.row}>
            <Button value="4" onPress={() => handleNumberPress("4")} />
            <Button value="5" onPress={() => handleNumberPress("5")} />
            <Button value="6" onPress={() => handleNumberPress("6")} />
            <Button
              value="-"
              onPress={() => handleOperatorPress("-")}
              style={styles.operatorButton}
            />
          </View>

          <View style={styles.row}>
            <Button value="1" onPress={() => handleNumberPress("1")} />
            <Button value="2" onPress={() => handleNumberPress("2")} />
            <Button value="3" onPress={() => handleNumberPress("3")} />
            <Button
              value="+"
              onPress={() => handleOperatorPress("+")}
              style={styles.operatorButton}
            />
          </View>

          <View style={styles.row}>
            <Button
              value="0"
              onPress={() => handleNumberPress("0")}
              style={styles.zeroButton}
            />
            <Button value="." onPress={() => handleNumberPress(".")} />
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
  );
};

export default QuickSaleScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 16,
  },
 
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
  },
  backIcon: {
    fontSize: 24,
    color: "#000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
    color: "#666",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  cashSaleButton: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cashSaleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cashIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cashIconText: {
    fontSize: 20,
  },
  cashSaleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  arrow: {
    fontSize: 24,
    color: "#999",
  },
  display: {
    flex: 1,
    marginTop: 16,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 24,
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  expression: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "right",
    marginBottom: 8,
  },
  result: {
    fontSize: 24,
    color: "#666",
    textAlign: "right",
  },
  recordButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  recordButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  calculator: {
    marginTop: 16,
  },
  topSection: {
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 24,
    color: "#000",
    fontWeight: "500",
  },
  functionButton: {
    backgroundColor: "#E8E8E8",
  },
  operatorButton: {
    backgroundColor: "#ffff",
  },
  zeroButton: {
    flex: 2,
  },
  equalsButton: {
    backgroundColor: COLORS.primary,
  },
  equalsText: {
    color: "#fff",
    fontSize: 28,
  },
});
