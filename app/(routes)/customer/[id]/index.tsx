import PXWrapper from "@/layouts/px-wrapper";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Linking } from "react-native";
import {
  AlarmClock,
  ArrowLeft,
  FilterIcon,
  MessageCircle,
  MoreVertical,
  PhoneCall,
  Search,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { COLORS } from "@/constants/Colors";
import AvatarCard from "@/components/re-usables/avatar-card";
import CustomInput from "@/components/re-usables/input";
import { Button } from "@/components/re-usables/button";
import { customerService } from "@/database/services/customer.service";
import Customer from "@/database/model/customer.model";
import { formatNumberWithComma } from "@/utils/format-number";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";

const ProfileScreen = () => {
  const { id } = useLocalSearchParams();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [phoneAwaiting, setPhoneAwaiting] = useState(false);
  const [messageAwaiting, setMessageAwaiting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        const customerObservable = await customerService.getCustomerById(
          id as string,
        );
        if (customerObservable) {
          const sub = customerObservable.subscribe({
            next: (data: Customer) => {
              if (data) setCustomer(data);
            },
            error: (err) => console.error("Error observing customer:", err),
          });
          return () => sub.unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleCall = async () => {
    if (!customer?.phone) return;
    setPhoneAwaiting(true);
    const url = `tel:${customer?.phone}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.error("Your device does not support phone calls");
    }
    setPhoneAwaiting(false);
  };

  const handleMessage = async () => {
    if (!customer?.phone) return;
    setMessageAwaiting(true);
    const messageBody = `Hello,${customer?.name}. I hope you doing well, I want to inform that you have ${formatNumberWithComma(customer?.outstanding || 0)} outstanding amount. Please pay it as soon as possible.`;
    const url = `sms:${customer?.phone}?body=${messageBody}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.error("Your device does not support phone calls");
    }
    setMessageAwaiting(false);
  };

  return (
    <PXWrapper
      header={
        <View
          style={{
            flexDirection: "row",
            marginBottom: 12,
            alignItems: "center",
            gap: 15,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <AvatarCard name={customer?.name || "Customer"} size={50} />
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins-Medium",
                  color: COLORS.text,
                }}
              >
                {customer?.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: COLORS.textLight,
                }}
              >
                Tap to view
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <MoreVertical size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      }
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 5,
          padding: 20,
          alignItems: "center",
          gap: 15,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flex: 1,
            borderRightWidth: 1,
            borderRightColor: COLORS.border,
          }}
        >
          <Text style={{ fontSize: 16 }}>To Receive</Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Poppins-Medium",
              color: COLORS.success,
              marginTop: 4,
            }}
          >
            {formatNumberWithComma(customer?.outstanding || 0)}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={{ fontSize: 16, color: COLORS.secondary }}>
            {customer?.phone}
          </Text>
          <Text style={{ fontSize: 13, marginTop: 2, color: "#666" }}>
            {customer?.address}
          </Text>
          <Text style={{ fontSize: 11, marginTop: 2, color: "#666" }}>
            {customer?.email}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-around",
          backgroundColor: "white",
          padding: 20,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: COLORS.border,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleCall}
          disabled={phoneAwaiting}
          style={{ flexDirection: "column", alignItems: "center", gap: 5 }}
        >
          <PhoneCall size={24} color={COLORS.text} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Regular",
              color: COLORS.text,
            }}
          >
            Call
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleMessage}
          disabled={messageAwaiting}
          style={{ flexDirection: "column", alignItems: "center", gap: 5 }}
        >
          <MessageCircle size={24} color={COLORS.text} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Regular",
              color: COLORS.text,
            }}
          >
            Message
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "column", alignItems: "center", gap: 5 }}
        >
          <AlarmClock size={24} color={COLORS.text} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Regular",
              color: COLORS.text,
            }}
          >
            Reminder
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        <View style={{ flex: 1 }}>
          <CustomInput
            containerStyle={{ flex: 1 }}
            placeholder="Search transactions"
            leftIcon={<Search />}
          />
        </View>
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <FilterIcon size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </PXWrapper>
  );
};

export default ProfileScreen;
