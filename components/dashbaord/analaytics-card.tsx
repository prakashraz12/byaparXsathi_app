import { Link } from 'expo-router';
import { ArrowDown, Building2, TruckIcon, UserCircle, Users, Wallet } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/Colors';
import { observeDashboardAnalytics } from '@/database/services/analaytics.service';
import { formatNumberWithComma } from '@/utils/format-number';

import { Text } from '../re-usables/text';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = width / 2 - CARD_MARGIN * 2.3;

const DashBoardAnalaytics = () => {
  const DEFAULT_PRESET = 'THIS_MONTH';
  const [stats, setStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const subscription = observeDashboardAnalytics({
      dateRangePreset: DEFAULT_PRESET,
    }).subscribe((data) => {
      setStats(data);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cardData = [
    {
      id: '1',
      title: 'Sales',
      value: stats.totalSales,
      icon: <ArrowDown size={18} color="#558B2F" />,
      color: "#558B2F",
      type: 'value',
      link: '/sales',
    },
    {
      id: '2',
      title: 'Purchases',
      value: '000',
      icon: <TruckIcon size={18} color="#084c99ff" />,
      color: "#084c99ff",
      type: 'value',
      link: '/purchase',
    },
    {
      id: '3',
      title: 'Expenses',
      value: stats.totalExpenses,
      icon: <Wallet size={18} color={COLORS.error} />,
      color: COLORS.error,
      type: 'value',
      link: '/expenses',
    },
    {
      id: '4',
      title: 'Customers',
      value: stats.totalCustomers,
      icon: <Users size={18} color={COLORS.primary} />,
      color: COLORS.primary,
      type: 'count',
      link: '/(tabs)/customers',
    },
    {
      id: '5',
      title: 'Cash & Bank',
      value: stats.totalCustomers,
      icon: <Building2 size={18} color="#00695C" />,
      color: "#00695C",
      type: 'value',
      link: '/finance/cash-and-bank',
    },
    {
      id: '6',
      title: 'Suppliers',
      value: stats.totalCustomers,
      icon: <UserCircle size={18} color="#E65100" />,
      color: '#E65100',
      type: 'count',
      link: '/(tabs)/suppliers',
    },
  ];

  return (
    <View style={styles.container}>
      {cardData?.map((item) => (
        <Link key={item.id} href={item.link as any} style={styles.cardWrapper}>
          <View style={styles.card}>
           

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.icon}
              </View>
            </View>
            <Text style={[styles.cardValue, { color: item?.color }]} numberOfLines={1}>
              {item.type === 'value' ? formatNumberWithComma(item.value) : item.value}
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginTop: 3,
                color: '#666',
                fontFamily: 'Poppins-Regular',
              }}
            >
              {item.title} of Month
            </Text>
          </View>
        </Link>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 2,
    marginTop: 10,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: CARD_MARGIN,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    backgroundColor: COLORS.background,
  },
  card: {
    height: 90,
    borderRadius: 5,
    overflow: 'hidden',
    padding: 15,
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 2,
    color: '#424242',
    fontFamily: 'Poppins-SemiBold',
  },
  cardValue: {
    fontSize: 15,
    color: '#212121',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default DashBoardAnalaytics;
