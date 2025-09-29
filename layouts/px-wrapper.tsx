import NotFound from "@/components/re-usables/not-found";
import { COLORS } from "@/constants/Colors";
import type React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import {  useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top * 0.4 },
        style,
        { backgroundColor: "#fff" },
        floatingAction ? { position: "relative" } : {},
      ]}
    >
      {header ? <View style={styles.header}>{header}</View> : null}
      {floatingAction && (
        <View style={styles.floatingButtonContainer}>{floatingAction}</View>
      )}
      {data?.length > 0 && renderItem ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.id || index.toString()}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10, paddingTop:16 }}
        />
      ) : data?.length === 0 ? (
       <NotFound title="No Data Found" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    height: "100%",
    paddingVertical:10,
    paddingHorizontal:10,
  },
  contentContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginTop:15,
    borderBottomColor: COLORS.border,
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
