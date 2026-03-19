import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { CheckCircle2, Circle, BookOpen } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../constants/theme";
import { scheduleData } from "../data/scheduleData";
import { storyData } from "../data/storyData";

const STORAGE_KEY = "@shizuoka_schedule_done";

export default function ScheduleScreen({ navigation }) {
  const [activeDay, setActiveDay] = useState("day1");
  const [schedule, setSchedule] = useState(scheduleData);
  const validStoryIds = React.useMemo(
    () => new Set(storyData.map((story) => story.id)),
    [],
  );

  // Load persistence data on mount
  useEffect(() => {
    const loadScheduleStatus = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const doneMap = JSON.parse(saved);
          setSchedule((prev) => {
            const newSchedule = { ...prev };
            Object.keys(doneMap).forEach((day) => {
              if (newSchedule[day]) {
                newSchedule[day] = newSchedule[day].map((item) => ({
                  ...item,
                  done: !!doneMap[day][item.id],
                }));
              }
            });
            return newSchedule;
          });
        }
      } catch (e) {
        console.error("Failed to load schedule status", e);
      }
    };
    loadScheduleStatus();
  }, []);

  const toggleDone = async (day, id) => {
    const updatedSchedule = {
      ...schedule,
      [day]: schedule[day].map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    };

    setSchedule(updatedSchedule);

    // Save to persistence
    try {
      const doneMap = {};
      Object.keys(updatedSchedule).forEach((d) => {
        doneMap[d] = {};
        updatedSchedule[d].forEach((item) => {
          if (item.done) doneMap[d][item.id] = true;
        });
      });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(doneMap));
    } catch (e) {
      console.error("Failed to save schedule status", e);
    }
  };

  const openMap = async (url) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.error("Failed to open map url", e);
    }
  };

  const renderTab = (dayKey, label) => (
    <TouchableOpacity
      style={[styles.tab, activeDay === dayKey && styles.activeTab]}
      onPress={() => setActiveDay(dayKey)}
    >
      <Text
        style={[styles.tabText, activeDay === dayKey && styles.activeTabText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.timelineItem}>
      <View style={styles.timeColumn}>
        <View style={styles.timelineLineHalf} />
        <Text style={styles.timeText}>{item.time}</Text>
        <View style={styles.timeDot} />
        <View style={styles.timelineLineHalf} />
      </View>
      <TouchableOpacity
        style={[styles.card, item.done && styles.cardDone]}
        onPress={() => toggleDone(activeDay, item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, item.done && styles.textDone]}>
            {item.title}
          </Text>
          {item.done ? (
            <CheckCircle2 color={theme.colors.accent} size={20} />
          ) : (
            <Circle color={theme.colors.textLight} size={20} />
          )}
        </View>
        <Text style={[styles.cardDesc, item.done && styles.textDone]}>
          {item.desc}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.cardCost}>예상: {item.cost}</Text>
          <View style={styles.rightActionGroup}>
            {item.storyId && validStoryIds.has(item.storyId) && (
              <TouchableOpacity
                style={styles.storyLinkBtn}
                onPress={() =>
                  navigation.navigate("Story", { storyId: item.storyId })
                }
              >
                <BookOpen color={theme.colors.primary} size={14} />
                <Text style={styles.storyLinkText}>상세보기</Text>
              </TouchableOpacity>
            )}
            {item.mapUrl && (
              <TouchableOpacity
                style={styles.mapLinkBtn}
                onPress={() => openMap(item.mapUrl)}
              >
                <Text style={styles.mapLinkText}>이동하기</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {renderTab("day1", "4/12 (일)")}
        {renderTab("day2", "4/13 (월)")}
        {renderTab("day3", "4/14 (화)")}
      </View>
      <FlatList
        data={schedule[activeDay]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textLight,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  timeColumn: {
    width: 60,
    alignItems: "center",
  },
  timelineLineHalf: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.primary,
    opacity: 0.3,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  cardDone: {
    backgroundColor: theme.colors.surfaceMuted,
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.secondary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  cardDesc: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  cardCost: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  rightActionGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  storyLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mapLinkBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  mapLinkText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
  },
  storyLinkText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
  textDone: {
    textDecorationLine: "line-through",
    color: theme.colors.textLight,
  },
});
