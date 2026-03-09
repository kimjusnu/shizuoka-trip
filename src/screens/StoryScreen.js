import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { MapPin } from "lucide-react-native";
import { theme } from "../constants/theme";
import { storyData } from "../data/storyData";

const { width } = Dimensions.get("window");

// For placeholder images, we'll use a reliable service
const getImageUrl = (index) =>
  `https://picsum.photos/seed/shizuoka${index}/800/600`;

export default function StoryScreen({ route }) {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (route.params?.storyId) {
      const index = storyData.findIndex(
        (item) => item.id === route.params.storyId,
      );
      if (index !== -1 && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current.scrollToIndex({ index, animated: true });
        }, 100);
      }
    }
  }, [route.params?.storyId]);

  const renderContent = (content) => {
    if (!content) return null;

    return content.map((section, idx) => {
      if (section.type === "text") {
        return (
          <Text key={idx} style={styles.description}>
            {section.text}
          </Text>
        );
      }
      if (section.type === "boldText") {
        return (
          <Text key={idx} style={[styles.description, { fontWeight: "bold" }]}>
            {section.text}
          </Text>
        );
      }
      if (section.type === "bullet") {
        return (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{section.text}</Text>
          </View>
        );
      }
      if (section.type === "table") {
        return (
          <View key={idx} style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              {section.headers.map((h, i) => (
                <Text key={i} style={styles.tableHeaderText}>
                  {h}
                </Text>
              ))}
            </View>
            {section.rows.map((row, ri) => (
              <View key={ri} style={styles.tableRow}>
                {row.map((cell, ci) => (
                  <Text key={ci} style={styles.tableCellText}>
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        );
      }
      return null;
    });
  };

  const renderImage = ({ item: imgSource }) => (
    <Image source={imgSource} style={styles.image} resizeMode="cover" />
  );

  const renderStoryCard = ({ item, index }) => (
    <View style={styles.card}>
      {item.images && item.images.length > 0 ? (
        <View>
          <FlatList
            data={item.images}
            renderItem={renderImage}
            keyExtractor={(_, i) => `${item.id}-img-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageCarousel}
          />
          {item.images.length > 1 && (
            <View style={styles.carouselDotContainer}>
              {item.images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.carouselDot, i === 0 && styles.activeDot]}
                />
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{item.imagePlaceholder}</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <MapPin color={theme.colors.primary} size={20} />
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <View style={styles.divider} />
        {renderContent(item.structuredContent)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={storyData}
        keyExtractor={(item) => item.id}
        renderItem={renderStoryCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8", // Slightly tinted background for contrast with white cards
  },
  listContent: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
    borderWidth: 2, // Bolder border
    borderColor: "#B7E4C7",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: width - theme.spacing.md * 2, // Full width of the card
    height: 250,
    backgroundColor: "#e1e4e8",
  },
  imageCarousel: {
    width: "100%",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.border,
  },
  placeholderText: {
    color: theme.colors.textLight,
    fontWeight: "600",
  },
  carouselDotContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
    width: 12,
  },
  content: {
    padding: theme.spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    paddingLeft: 28, // Align with title text
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  description: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 18,
    color: theme.colors.primary,
    marginRight: 8,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 24,
  },
  tableContainer: {
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#FFEDF0",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.secondary,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 8,
  },
  tableCellText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
  },
});
