import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/re-usables/text';
import PXWrapper from '@/layouts/px-wrapper';
import DashBoardTop from '@/components/dashbaord/sticky-top';
import { LinearGradient } from 'expo-linear-gradient';
import * as BackgroundTask from 'expo-background-task';
import {
  ArrowDownCircle,
  ArrowUp,
  Calculator,
  CloudUpload,
  Feather,
  PiggyBank,
  TruckIcon,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import UpgradeCard from '@/components/dashbaord/upgrade-card';
import SalesOverviewChart from '@/components/dashbaord/sales-chart';
import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import SyncBanner from '@/components/sync-banner';
import { Button } from '@/components/re-usables/button';
import { syncDatabase } from '@/database/sync.service';
import DashBoardAnalaytics from '@/components/dashbaord/analaytics-card';
import { useSyncStore } from '@/store/useSync';
import { useSync } from '@/database/hooks/useSync';
import SalesSummary from '@/components/dashbaord/sales-summary';
import SalesBreakdownByMethod from '@/components/dashbaord/sales-breakdownby-method';
import TopSalesItems from '@/components/dashbaord/top-sales-items';

const CARD_MARGIN = 12;

export const ACTION_BUTTONS = [
  // {
  //   id: "1",
  //   title: "Customer",
  //   icon: <UserPlus size={20} color={COLORS.primary} />,
  //   href: "/(routes)/customer",
  // },
  {
    id: '2',
    title: 'Quick Sales',
    icon: <Calculator size={20} color={COLORS.success} />,
    href: '/(routes)/sales/quick',
  },
  {
    id: '3',
    title: 'Purchase',
    icon: <TruckIcon size={20} color={COLORS.accent} />,
    onPress: () => {},
    href: '/(routes)/purchase',
  },
  {
    id: '4',
    title: 'Expenses',
    icon: <Wallet size={20} color={COLORS.error} />,
    href: '/(routes)/finance/expenses',
  },
  {
    id: '5',
    title: 'Extra Income',
    icon: <ArrowDownCircle size={20} color={COLORS.success} />,
    href: '/(routes)/finance/extra-income',
  },
];

const DashboardScreen = () => {
  const user = useUserStore();
  const { syncNow } = useSync();
  const { syncing } = useSyncStore();
  return (
    <>
      <PXWrapper header={<DashBoardTop />} contentContainerStyle={{ paddingHorizontal: 0 }}>
        {syncing && <SyncBanner />}
        <View style={{ padding: 12, marginBottom: 6 }}>
          <Text style={{ fontSize: 15, fontFamily: 'Poppins-SemiBold' }}>
            Hello, {user?.user?.fullName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              color: COLORS.textLight,
            }}
          >
            Here is your business insights.
          </Text>
        </View>

        <UpgradeCard />

        <DashBoardAnalaytics />

        <View>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Poppins-SemiBold',
              padding: 12,
            }}
          >
            Quick Actions
          </Text>
          <View>
            <View style={styles.quickActions}>
              {ACTION_BUTTONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickActionCard}
                  onPress={() => router?.push(item?.href as string as any)}
                >
                  {item.icon}
                  <Text style={styles.quickActionText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <SalesOverviewChart />
        <SalesSummary />
        <SalesBreakdownByMethod />
        <TopSalesItems />
      </PXWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
  quickActionCard: {
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '48%',
    gap: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default DashboardScreen;
