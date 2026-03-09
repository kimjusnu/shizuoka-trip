import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../constants/theme";
import { budgetData } from "../data/budgetData";

export default function BudgetScreen() {
  const renderDayBudget = (dayTitle, items, totalText) => (
    <View style={styles.card}>
      <Text style={styles.dayTitle}>{dayTitle}</Text>

      {items.map((item) => (
        <View key={item.id} style={styles.budgetRow}>
          <Text style={styles.itemText} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.expectedText}>{item.expected}</Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>일별 합계</Text>
        <Text style={styles.totalAmount}>{totalText}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>총 예상 경비 (2인)</Text>
          <Text style={styles.summaryAmount}>61,080엔</Text>
          <Text style={styles.summarySub}>약 549,720원</Text>
        </View>

        {renderDayBudget("Day 1 (4/12)", budgetData.day1, "23,720엔")}
        {renderDayBudget("Day 2 (4/13)", budgetData.day2, "27,360엔")}
        {renderDayBudget("Day 3 (4/14)", budgetData.day3, "10,000엔")}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
  summaryCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  summaryTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  summaryAmount: {
    color: theme.colors.surface,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  summarySub: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2, // Bolder border
    borderColor: "#B7E4C7",
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.secondary,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: theme.spacing.xs,
    alignSelf: "flex-start",
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  itemText: {
    fontSize: 15,
    color: theme.colors.text,
    flex: 1,
    marginRight: 10,
  },
  expectedText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#374151",
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
