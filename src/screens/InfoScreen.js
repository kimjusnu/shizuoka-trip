import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  CheckSquare,
  Square,
  Plane,
  Briefcase,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../constants/theme";
import { infoData } from "../data/infoData";

const STORAGE_KEY = "@shizuoka_checklist";

export default function InfoScreen() {
  const [checklist, setChecklist] = useState(infoData.checklist);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Load persistence data on mount
  useEffect(() => {
    const loadChecklistStatus = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const doneIds = JSON.parse(saved);
          setChecklist((prev) =>
            prev.map((item) => ({
              ...item,
              done: !!doneIds[item.id],
            })),
          );
        }
      } catch (e) {
        console.error("Failed to load checklist status", e);
      }
    };
    loadChecklistStatus();
  }, []);

  const toggleCheck = async (id) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item,
    );

    setChecklist(updatedChecklist);

    // Save to persistence
    try {
      const doneIds = {};
      updatedChecklist.forEach((item) => {
        if (item.done) doneIds[item.id] = true;
      });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(doneIds));
    } catch (e) {
      console.error("Failed to save checklist status", e);
    }
  };

  const copyToClipboard = async (text, index) => {
    await Clipboard.setStringAsync(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // 2초 후 원래 아이콘으로 복귀
  };

  const renderSectionHeader = (title, icon) => (
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Flight Info Section */}
      <View style={styles.card}>
        {renderSectionHeader(
          "항공 및 필수 정보",
          <Plane color={theme.colors.primary} size={24} />,
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>출국편</Text>
          <Text style={styles.infoText}>{infoData.flights.outbound}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>귀국편</Text>
          <Text style={styles.infoText}>{infoData.flights.inbound}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>예약번호</Text>
          <Text style={styles.infoText}>
            {infoData.flights.agencyRef} / {infoData.flights.airlineRef}
          </Text>
        </View>
        {infoData.flights.passengers.map((p, index) => (
          <View key={index} style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Text style={styles.infoLabel}>e-Ticket</Text>
              <Text style={styles.infoSubLabel}>({p.name})</Text>
            </View>
            <Text style={[styles.infoText, styles.ticketText]} selectable>
              {p.ticket}
            </Text>
            <TouchableOpacity
              style={[
                styles.copyButton,
                copiedIndex === index && styles.copyButtonDone,
              ]}
              onPress={() => copyToClipboard(p.ticket, index)}
            >
              {copiedIndex === index ? (
                <Check color="#52B788" size={16} />
              ) : (
                <Copy color={theme.colors.primary} size={16} />
              )}
              <Text
                style={[
                  styles.copyText,
                  copiedIndex === index && { color: "#52B788" },
                ]}
              >
                {copiedIndex === index ? "복사됨" : "복사"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Checklist Section */}
      <View style={styles.card}>
        {renderSectionHeader(
          "준비물 체크리스트",
          <Briefcase color={theme.colors.primary} size={24} />,
        )}
        {checklist.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checkItem}
            onPress={() => toggleCheck(item.id)}
            activeOpacity={0.7}
          >
            {item.done ? (
              <CheckSquare color={theme.colors.accent} size={24} />
            ) : (
              <Square color={theme.colors.textLight} size={24} />
            )}
            <Text style={[styles.checkText, item.done && styles.textDone]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Phrases Section */}
      <View style={[styles.card, { marginBottom: theme.spacing.xl }]}>
        {renderSectionHeader(
          "짧은 일본어 메모",
          <MessageCircle color={theme.colors.primary} size={24} />,
        )}
        {infoData.phrases.map((phrase, index) => (
          <View key={index} style={styles.phraseItem}>
            <Text style={styles.phraseKr}>{phrase.kr}</Text>
            <Text style={styles.phraseJp} selectable>
              {phrase.jp}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2, // Bolder border
    borderColor: "#B7E4C7",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.secondary,
    marginLeft: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: theme.spacing.sm,
    alignItems: "center", // Changed to center
  },
  infoLabelContainer: {
    width: 80,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textLight,
  },
  infoSubLabel: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginLeft: theme.spacing.md,
  },
  ticketText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  copyButtonDone: {
    backgroundColor: "#D8F3DC", // 연한 초록 배경
  },
  copyText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 4,
    fontWeight: "600",
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  checkText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  textDone: {
    textDecorationLine: "line-through",
    color: theme.colors.textLight,
  },
  phraseItem: {
    backgroundColor: "#f8f9fa",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  phraseKr: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  phraseJp: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
});
