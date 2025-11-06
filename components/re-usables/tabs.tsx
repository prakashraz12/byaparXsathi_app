import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { COLORS } from '@/constants/Colors';

export interface TabOption {
  value: string;
  label: string;
}

export type TabsVariant = 'default' | 'underline' | 'pill';

interface RTabsProps {
  value: string;
  onChange: (value: string) => void;
  tabsOptions: (string | TabOption)[];
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
  variant?: TabsVariant;
}

const RTabs: React.FC<RTabsProps> = ({
  value,
  onChange,
  tabsOptions = [],
  containerStyle = {},
  tabStyle = {},
  activeTabStyle = {},
  textStyle = {},
  activeTextStyle = {},
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'underline':
        return {
          tab: styles.underlineTab,
          activeTab: styles.underlineActiveTab,
          text: styles.underlineText,
          activeText: styles.underlineActiveText,
        };
      case 'pill':
        return {
          tab: styles.pillTab,
          activeTab: styles.pillActiveTab,
          text: styles.pillText,
          activeText: styles.pillActiveText,
        };
      default:
        return {
          tab: styles.defaultTab,
          activeTab: styles.defaultActiveTab,
          text: styles.defaultText,
          activeText: styles.defaultActiveText,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, containerStyle]}
      contentContainerStyle={styles.contentContainer}
    >
      {tabsOptions.map((tab, index) => {
        const isActive = value === (typeof tab === 'string' ? tab : tab.value);
        const tabValue = typeof tab === 'string' ? tab : tab.value;
        const tabLabel = typeof tab === 'string' ? tab : tab.label;

        return (
          <TouchableOpacity
            key={`${tabValue}-${index}`}
            onPress={() => onChange(tabValue)}
            style={[
              variantStyles.tab,
              tabStyle,
              isActive && variantStyles.activeTab,
              isActive && activeTabStyle,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                variantStyles.text,
                textStyle,
                isActive && variantStyles.activeText,
                isActive && activeTextStyle,
              ]}
            >
              {tabLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 5,
  },

  // Default variant
  defaultTab: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  defaultActiveTab: {
    backgroundColor: '#007AFF',
  },
  defaultText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  defaultActiveText: {
    color: '#fff',
  },

  // Underline variant
  underlineTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  underlineActiveTab: {
    borderBottomColor: '#007AFF',
  },
  underlineText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  underlineActiveText: {
    color: '#007AFF',
    fontWeight: '700',
  },

  // Pill variant
  pillTab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pillActiveTab: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  pillActiveText: {
    color: '#fff',
  },
});

export default RTabs;
