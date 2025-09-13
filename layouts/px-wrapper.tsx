import { Text } from "@/components/re-usables/text";
import type React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PXWrapperProps {
  children?: React.ReactNode;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: object;
  style?: object;
  header?: React.ReactNode;
  data?: any;
  renderItem?: any;
  floatingAction?: React.ReactNode;
}

const PXWrapper = ({
  children,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  style,
  header,
  data,
  renderItem,
  floatingAction,
}: PXWrapperProps) => {
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        style,
        { backgroundColor: "#F5F5F5" },
        floatingAction ? { position: "relative" } : {},
      ]}
    >
      {header ? <View style={styles.header}>{header}</View> : null}
      {floatingAction && (
        <View style={styles.floatingButtonContainer}>{floatingAction}</View>
      )}
      {data && renderItem ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.id || index.toString()}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 20 }}
        />
      ) : data?.length === 0 ? (
        <View style={styles.contentContainer}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  header: {
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 20,
  },
  floatingButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 1000,
    elevation: 5,
  },
});

export default PXWrapper;
