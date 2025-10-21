import NotFound from "@/components/re-usables/not-found";
import { COLORS } from "@/constants/Colors";
import type React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PXWrapperProps {
  children?: React.ReactNode;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: object;
  style?: object;
  header?: React.ReactNode;
  data?: any;
  renderItem?: any;
  floatingAction?: React.ReactNode;
  footer?: React.ReactNode;
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
  footer,
}: PXWrapperProps) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top * 0.4 },
        style,
        { backgroundColor: "#F2F2F7" },
        floatingAction ? { position: "relative" } : {},
      ]}
    >
      {header ? <View style={styles.header}>{header}</View> : null}
      
      {floatingAction && (
        <View style={styles.floatingButtonContainer}>{floatingAction}</View>
      )}
      
      <View style={{ flex: 1 }}>
        {data?.length > 0 && renderItem ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item?.id || index.toString()}
            contentContainerStyle={{ 
              paddingBottom: footer ? 90 : 80, 
              paddingHorizontal: 10, 
              paddingTop: 16 
            }}
          />
        ) : data?.length === 0 ? (
          <NotFound title="No Data Found" />
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.contentContainer,
              contentContainerStyle,
              footer ? { paddingBottom: 90 } : {},
            ]}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        )}
      </View>
      
      {footer && (
        <View 
          style={[
            styles.footer,
            { paddingBottom: insets.bottom || 10 }
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:COLORS.background,
    width:"100%",
    height:"100%"
  },
  scrollView: {
    flex: 1,
    height: "100%",
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor:"#F2F2F7"
  },
  contentContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginTop: 15,
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
   
  },
});

export default PXWrapper;