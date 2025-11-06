import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Type definitions
export interface DropdownItem {
  id?: string | number;
  key?: string | number;
  label?: string;
  name?: string;
  title?: string;
  value?: any;
  [key: string]: any;
}

export interface DropdownProps<T = DropdownItem | string> {
  data: T[];
  placeholder?: string;
  onSelect?: (item: T) => void; // Legacy support
  onChange?: (item: T) => void; // Standard form prop
  value?: T | null;
  style?: ViewStyle;
  dropdownStyle?: ViewStyle;
  textStyle?: TextStyle;
  placeholderStyle?: TextStyle;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  maxHeight?: number;
  disabled?: boolean;
  searchable?: boolean;
  renderItem?: (item: T, index: number) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  error?: string | null;
  errorStyle?: ViewStyle;
  errorTextStyle?: TextStyle;
  label?: string;
  labelStyle?: TextStyle;
  required?: boolean;
}

const Dropdown = <T extends DropdownItem | string = DropdownItem | string>({
  data = [],
  placeholder = 'Select an option',
  onSelect, // Legacy support
  onChange, // Standard form prop
  value,
  style,
  dropdownStyle,
  textStyle,
  placeholderStyle,
  itemStyle,
  itemTextStyle,
  maxHeight = 200,
  disabled = false,
  searchable = false,
  renderItem,
  keyExtractor,
  iconName = 'chevron-down',
  iconSize = 20,
  iconColor = '#666',
  error,
  errorStyle,
  errorTextStyle,
  label,
  labelStyle,
  required = false,
}: DropdownProps<T>): JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false);
  const [dropdownTop, setDropdownTop] = useState<number>(0);
  const [dropdownLeft, setDropdownLeft] = useState<number>(0);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const buttonRef = useRef<TouchableOpacity>(null);

  const toggleDropdown = (): void => {
    if (disabled) return;

    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    buttonRef.current?.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
      setDropdownLeft(_px);
      setDropdownWidth(_w);
    });
    setVisible(true);
  };

  const onItemPress = (item: T): void => {
    setVisible(false);
    // Support both onChange (standard) and onSelect (legacy)
    if (onChange) {
      onChange(item);
    } else if (onSelect) {
      onSelect(item);
    }
  };

  const renderDropdownItem = ({ item, index }: { item: T; index: number }): React.ReactElement => {
    if (renderItem) {
      return (
        <TouchableOpacity style={[styles.item, itemStyle]} onPress={() => onItemPress(item)}>
          {renderItem(item, index)}
        </TouchableOpacity>
      );
    }

    const displayValue =
      typeof item === 'object'
        ? (item as DropdownItem).label ||
          (item as DropdownItem).name ||
          (item as DropdownItem).title ||
          'Unknown'
        : String(item);

    return (
      <TouchableOpacity style={[styles.item, itemStyle]} onPress={() => onItemPress(item)}>
        <Text style={[styles.itemText, itemTextStyle]}>{displayValue}</Text>
      </TouchableOpacity>
    );
  };

  const getDisplayValue = (): string | null => {
    if (!value) return null;
    if (typeof value === 'object') {
      const objValue = value as DropdownItem;
      return objValue.label || objValue.name || objValue.title || 'Selected';
    }
    return String(value);
  };

  const getKeyExtractor = (): ((item: T, index: number) => string) => {
    if (keyExtractor) return keyExtractor;
    return (item: T, index: number) => {
      if (typeof item === 'object') {
        const objItem = item as DropdownItem;
        if (objItem.id) return String(objItem.id);
        if (objItem.key) return String(objItem.key);
      }
      return index.toString();
    };
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      {/* Dropdown Button */}
      <TouchableOpacity
        ref={buttonRef}
        style={[
          styles.button,
          style,
          disabled && styles.disabledButton,
          error && styles.errorButton,
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <Text
          style={[
            styles.buttonText,
            textStyle,
            !value && styles.placeholder,
            !value && placeholderStyle,
          ]}
        >
          {getDisplayValue() || placeholder}
        </Text>
        <Ionicons
          name={visible ? 'chevron-up' : iconName}
          size={iconSize}
          color={disabled ? '#ccc' : error ? '#ff4444' : iconColor}
        />
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <View style={[styles.errorContainer, errorStyle]}>
          <Ionicons name="alert-circle" size={14} color="#ff4444" />
          <Text style={[styles.errorText, errorTextStyle]}>{error}</Text>
        </View>
      )}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View
            style={[
              styles.dropdown,
              dropdownStyle,
              {
                top: dropdownTop,
                left: dropdownLeft,
                width: dropdownWidth,
                maxHeight: maxHeight,
              },
            ]}
          >
            <FlatList
              data={data}
              renderItem={renderDropdownItem}
              keyExtractor={getKeyExtractor()}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: '#ff4444',
    fontSize: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  errorButton: {
    borderColor: '#ff4444',
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginLeft: 4,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Dropdown;

// Type-safe usage examples:

// 1. String array type
type SimpleDropdownProps = DropdownProps<string>;

// 2. Custom object type
interface Fruit {
  id: number;
  label: string;
  value: string;
  color?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}
