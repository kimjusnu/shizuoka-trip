import React, { useRef, useEffect, useState, useCallback } from "react";
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

const carouselSlideWidth = width - theme.spacing.md * 2;

function StoryImageCarousel({ images, itemId }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const syncPageFromOffset = useCallback(
    (offsetX) => {
      const page = Math.round(offsetX / carouselSlideWidth);
      if (page >= 0 && page < images.length) {
        setActiveIndex((prev) => (prev === page ? prev : page));
      }
    },
    [images.length],
  );

  const onMomentumScrollEnd = useCallback(
    (e) => {
      syncPageFromOffset(e.nativeEvent.contentOffset.x);
    },
    [syncPageFromOffset],
  );

  const onScroll = useCallback(
    (e) => {
      syncPageFromOffset(e.nativeEvent.contentOffset.x);
    },
    [syncPageFromOffset],
  );

  const renderImage = useCallback(
    ({ item: imgSource }) => (
      <Image
        source={imgSource}
        style={styles.image}
        resizeMode="cover"
      />
    ),
    [],
  );

  return (
    <View>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(_, i) => `${itemId}-img-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageCarousel}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onMomentumScrollEnd}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      />
      {images.length > 1 && (
        <View style={styles.carouselDotContainer}>
          {images.map((_, i) => (
            <View
              key={`${itemId}-dot-${i}`}
              style={[
                styles.carouselDot,
                i === activeIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

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

  const renderStoryCard = ({ item }) => (
    <View style={styles.card}>
      {item.images && item.images.length > 0 ? (
        <StoryImageCarousel images={item.images} itemId={item.id} />
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
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 5,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
  },
  image: {
    width: width - theme.spacing.md * 2,
    height: 250,
    backgroundColor: theme.colors.surfaceMuted,
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
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.accentStrong,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    paddingLeft: 28,
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
    backgroundColor: theme.colors.accentSoft,
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
    borderBottomColor: theme.colors.border,
    paddingVertical: 8,
  },
  tableCellText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
  },
});
