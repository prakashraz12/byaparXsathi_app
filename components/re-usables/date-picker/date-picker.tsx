import { COLORS } from "@/constants/Colors";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BsDate, calendarData, nepaliCalendar } from "./calender-config";

type CalendarType = "english" | "nepali";

interface DatePickerProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  mode?: CalendarType;
  minDate?: Date;
  maxDate?: Date;
  renderCustomSelection?: (args: {
    onPress: () => void;
    formattedDate: string;
    isVisible: boolean;
    open: () => void;
    close: () => void;
    mode: CalendarType;
  }) => React.ReactNode;
}

const  DatePicker = ({
  selectedDate = new Date(),
  onDateChange,
  mode = "nepali",
  renderCustomSelection,
}: DatePickerProps) => {
  const offSetMin = new Date().getTimezoneOffset();
  const [isVisible, setIsVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState<CalendarType>(mode);
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const [currentBsDate, setCurrentBsDate] = useState<BsDate>(() => {
    return nepaliCalendar.getBsDateByAdDate(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
  });

  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewBsYear, setViewBsYear] = useState(currentBsDate.bsYear);
  const [viewBsMonth, setViewBsMonth] = useState(currentBsDate.bsMonth);

  const generateEnglishCalendar = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [viewYear, viewMonth]);

  const generateNepaliCalendar = useMemo(() => {
    const daysInMonth = nepaliCalendar.getBsMonthDays(viewBsYear, viewBsMonth);
    const firstDayOfMonth: BsDate = {
      bsYear: viewBsYear,
      bsMonth: viewBsMonth,
      bsDate: 1,
    };
    const startingDayOfWeek = nepaliCalendar.getDayOfWeek(firstDayOfMonth);

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [viewBsYear, viewBsMonth]);

  const handleDateSelect = (day: number) => {
    if (calendarMode === "english") {
      const newDate = new Date(viewYear, viewMonth, day);
      const newBsDate = nepaliCalendar.getBsDateByAdDate(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        newDate.getDate()
      );
      setCurrentDate(newDate);
      setCurrentBsDate(newBsDate);
      onDateChange?.(newDate);
    } else {
      const newBsDate: BsDate = {
        bsYear: viewBsYear,
        bsMonth: viewBsMonth,
        bsDate: day,
      };

      const newAdDate = nepaliCalendar.getAdDateByBsDate(
        viewBsYear,
        viewBsMonth,
        day
      );

      console.log("this is ad date", newAdDate)
      setCurrentBsDate(newBsDate);
      setCurrentDate(newAdDate);
      onDateChange?.(newAdDate);
    }
    setIsVisible(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (calendarMode === "english") {
      if (direction === "next") {
        if (viewMonth === 11) {
          setViewMonth(0);
          setViewYear(viewYear + 1);
        } else {
          setViewMonth(viewMonth + 1);
        }
      } else {
        if (viewMonth === 0) {
          setViewMonth(11);
          setViewYear(viewYear - 1);
        } else {
          setViewMonth(viewMonth - 1);
        }
      }
    } else {
      if (direction === "next") {
        if (viewBsMonth === 12) {
          setViewBsMonth(1);
          setViewBsYear(viewBsYear + 1);
        } else {
          setViewBsMonth(viewBsMonth + 1);
        }
      } else {
        if (viewBsMonth === 1) {
          setViewBsMonth(12);
          setViewBsYear(viewBsYear - 1);
        } else {
          setViewBsMonth(viewBsMonth - 1);
        }
      }
    }
  };

  const isSelectedDay = (day: number) => {
    if (calendarMode === "english") {
      return (
        day === currentDate.getDate() &&
        viewMonth === currentDate.getMonth() &&
        viewYear === currentDate.getFullYear()
      );
    } else {
      return (
        day === currentBsDate.bsDate &&
        viewBsMonth === currentBsDate.bsMonth &&
        viewBsYear === currentBsDate.bsYear
      );
    }
  };

  const formatDisplayDate = () => {
    if (calendarMode === "english") {
      return currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return nepaliCalendar.formatBsDateEN(currentBsDate, "YYYY-MM-DD");
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.container}>
      {renderCustomSelection ? (
        renderCustomSelection({
          onPress: () => setIsVisible(true),
          formattedDate: formatDisplayDate(),
          isVisible,
          open: () => setIsVisible(true),
          close: () => setIsVisible(false),
          mode: calendarMode,
        })
      ) : (
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setIsVisible(true)}
        >
          <Text style={styles.dateButtonText}>{formatDisplayDate()}</Text>
          <Calendar size={18} color="#666" />
        </TouchableOpacity>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              {/* Month/Year Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => navigateMonth("prev")}
                >
                  <Text style={styles.navButtonText}>
                    <ChevronLeft />
                  </Text>
                </TouchableOpacity>

                <Text style={styles.headerText}>
                  {calendarMode === "english"
                    ? `${monthNames[viewMonth]} ${viewYear}`
                    : `${calendarData.bsMonthsENG[viewBsMonth - 1]} ${viewBsYear}`}
                </Text>

                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => navigateMonth("next")}
                >
                  <Text style={styles.navButtonText}>
                    <ChevronRight />
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Day names */}
              <View style={styles.weekDays}>
                {(calendarMode === "english"
                  ? dayNamesShort
                  : calendarData.adDays
                ).map((day, index) => (
                  <Text key={index} style={styles.weekDayText}>
                    {day}
                  </Text>
                ))}
              </View>

              <ScrollView style={styles.calendarScroll}>
                <View style={styles.calendarGrid}>
                  {(calendarMode === "english"
                    ? generateEnglishCalendar
                    : generateNepaliCalendar
                  ).map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayCell,
                        day &&
                          isSelectedDay(day) &&
                          (styles.selectedDayCell as any),
                      ]}
                      onPress={() => day && handleDateSelect(day)}
                      disabled={!day}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          !day && styles.emptyDayText,
                          day &&
                            isSelectedDay(day) &&
                            (styles.selectedDayText as any),
                        ]}
                      >
                        {day || ""}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DatePicker;
const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  calendarIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "97%",
    maxWidth: "97%",
    maxHeight: "100%",
    paddingBottom:40
  },
  modeToggle: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 3,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: "#007AFF",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  navButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  navButtonText: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingBottom: 10,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  calendarScroll: {
    maxHeight: 500,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    height: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  selectedDayCell: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
  },
  dayText: {
    fontSize: 15,
    color: "#333",
  },
  emptyDayText: {
    color: "transparent",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dateInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  dateInfoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  dateInfoText: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  dateInfoTextNepali: {
    fontSize: 16,
    color: "#007AFF",
    marginTop: 2,
  },
});
