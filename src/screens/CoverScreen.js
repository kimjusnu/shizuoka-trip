import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import {
  Plane,
  Calendar,
  Users,
  ChevronRight,
  CheckCircle2,
} from "lucide-react-native";
import { theme } from "../constants/theme";

const { width } = Dimensions.get("window");

export default function CoverScreen({ navigation }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(scrollPosition / (width - 40));
    setActiveSlide(slideIndex);
  };

  return (
    <ImageBackground
      source={require("../../assets/shizuokaMain.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MainTabs")}
              activeOpacity={0.7}
            >
              <View style={[styles.badge, { backgroundColor: "#FFEDF0" }]}>
                <Plane color={theme.colors.accent} size={14} />
                <Text style={[styles.badgeText, { color: "#C9184A" }]}>
                  시즈오카 여행 플래너
                </Text>
              </View>
              <Text style={styles.title}>
                시즈오카 <Text style={styles.titleHighlight}>2박 3일</Text>
              </Text>
              <Text style={styles.subtitle}>여행 플래너</Text>
            </TouchableOpacity>

            <View style={styles.metaInfo}>
              <View style={styles.metaRow}>
                <Calendar color={theme.colors.textLight} size={16} />
                <Text style={styles.metaText}>
                  2026.04.12 (일) - 04.14 (화)
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Users color={theme.colors.textLight} size={16} />
                <Text style={styles.metaText}>김준수, 박서연 (2명)</Text>
              </View>
            </View>
          </View>

          {/* Flight Cards Carousel */}
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              decelerationRate="fast"
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {/* Outbound Flight */}
              <View style={[styles.flightCard, { width: width - 40 }]}>
                <View style={styles.flightHeader}>
                  <Text style={styles.airlineText}>Jeju Air</Text>
                  <View style={styles.roundTripBadge}>
                    <Text style={styles.roundTripText}>출국 (Outbound)</Text>
                  </View>
                </View>

                <View style={styles.flightRoute}>
                  <View style={styles.airport}>
                    <Text style={styles.airportCode}>ICN</Text>
                    <Text style={styles.airportName}>인천 T1</Text>
                  </View>
                  <View style={styles.flightPath}>
                    <Plane
                      color={theme.colors.textLight}
                      size={20}
                      style={{ transform: [{ rotate: "45deg" }] }}
                    />
                    <View style={styles.flightLine} />
                    <Text style={styles.flightDuration}>약 2시간</Text>
                  </View>
                  <View style={styles.airport}>
                    <Text style={styles.airportCode}>FSZ</Text>
                    <Text style={styles.airportName}>시즈오카</Text>
                  </View>
                </View>

                <View style={styles.flightTimes}>
                  <Text style={styles.timeText}>
                    <Text style={{ fontWeight: "bold" }}>7C1601</Text> 07:05
                    출발
                  </Text>
                  <Text style={styles.timeText}>09:00 도착</Text>
                </View>
              </View>

              {/* Inbound Flight */}
              <View style={[styles.flightCard, { width: width - 40 }]}>
                <View style={styles.flightHeader}>
                  <Text style={styles.airlineText}>Jeju Air</Text>
                  <View style={styles.roundTripBadge}>
                    <Text style={styles.roundTripText}>귀국 (Inbound)</Text>
                  </View>
                </View>

                <View style={styles.flightRoute}>
                  <View style={styles.airport}>
                    <Text style={styles.airportCode}>FSZ</Text>
                    <Text style={styles.airportName}>시즈오카</Text>
                  </View>
                  <View style={styles.flightPath}>
                    <Plane
                      color={theme.colors.textLight}
                      size={20}
                      style={{ transform: [{ rotate: "45deg" }] }}
                    />
                    <View style={styles.flightLine} />
                    <Text style={styles.flightDuration}>약 2시간 15분</Text>
                  </View>
                  <View style={styles.airport}>
                    <Text style={styles.airportCode}>ICN</Text>
                    <Text style={styles.airportName}>인천 T1</Text>
                  </View>
                </View>

                <View style={styles.flightTimes}>
                  <Text style={styles.timeText}>
                    <Text style={{ fontWeight: "bold" }}>7C1604</Text> 18:10
                    출발
                  </Text>
                  <Text style={styles.timeText}>20:25 도착</Text>
                </View>
              </View>
            </ScrollView>

            {/* Carousel indicators hint */}
            <View style={styles.carouselIndicators}>
              <View
                style={[styles.dot, activeSlide === 0 && styles.dotActive]}
              />
              <View
                style={[styles.dot, activeSlide === 1 && styles.dotActive]}
              />
              <Text style={styles.swipeHint}>옆으로 넘겨서 귀국편 확인 👆</Text>
            </View>
          </View>

          {/* Day Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={[styles.dayCard, { borderTopColor: "#95D5B2" }]}>
              <Text style={[styles.dayTitle, { color: "#40916C" }]}>
                Day 1 <Text style={styles.dayDate}>4.12(일)</Text>
              </Text>
              <Text style={styles.dayTheme}>시내 투어 & 미호 해변 일몰</Text>
              <Text style={styles.dayDesc}>
                #미호노마츠바라 #사와야카함바그 #나나야녹차
              </Text>
            </View>
            <View style={[styles.dayCard, { borderTopColor: "#74C69D" }]}>
              <Text style={[styles.dayTitle, { color: "#2D6A4F" }]}>
                Day 2 <Text style={styles.dayDate}>4.13(월)</Text>
              </Text>
              <Text style={styles.dayTheme}>
                후지산 일대 출사 & 타누키 호수
              </Text>
              <Text style={styles.dayDesc}>
                #타누키호수 #꿈의대교 #후지노미야야키소바
              </Text>
            </View>
            <View
              style={[styles.dayCard, { borderTopColor: theme.colors.accent }]}
            >
              <Text style={[styles.dayTitle, { color: "#C06C84" }]}>
                Day 3 <Text style={styles.dayDate}>4.14(화)</Text>
              </Text>
              <Text style={styles.dayTheme}>슨푸성 산책 & 디저트 쇼핑</Text>
              <Text style={styles.dayDesc}>
                #슨푸성공원 #현청전망대 #키르훼봉타르트
              </Text>
            </View>
          </View>

          {/* Enter Button */}
          <TouchableOpacity
            style={styles.enterButton}
            onPress={() => navigation.navigate("MainTabs")}
            activeOpacity={0.8}
          >
            <Text style={styles.enterButtonText}>일정표 보기</Text>
            <ChevronRight color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "web" ? "100vh" : "100%",
    width: "100%",
    backgroundColor: "#F5F7FA",
  },
  safeContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20, // Reduced padding
    justifyContent: "space-evenly", // Changed to evenly space items
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Opacity to let image show
  },
  header: {
    marginTop: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 10,
  },
  badgeText: {
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 11,
    marginLeft: 6,
  },
  title: {
    fontSize: 32, // Slightly smaller font
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 2,
    letterSpacing: -1,
  },
  titleHighlight: {
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 28, // Slightly smaller font
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
    letterSpacing: -1,
  },
  metaInfo: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
    fontWeight: "500",
  },
  carouselContainer: {
    marginTop: 10,
    marginHorizontal: -20, // Negative margin to allow strict flatlist scroll
  },
  flightCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20, // Add back margin for the card itself
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  airlineText: {
    color: "#F97316",
    fontWeight: "bold",
    fontSize: 16,
  },
  roundTripBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roundTripText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  flightRoute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  airport: {
    alignItems: "center",
  },
  airportCode: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
  },
  airportName: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  flightPath: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
  },
  flightLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    position: "absolute",
    top: 10,
    zIndex: -1,
  },
  flightDuration: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  flightTimes: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  timeText: {
    fontSize: 12,
    color: "#4B5563",
  },
  carouselIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    width: 18,
    borderRadius: 4,
  },
  swipeHint: {
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 8,
  },
  summaryContainer: {
    marginTop: 12,
    gap: 8,
  },
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dayTheme: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "normal",
  },
  dayDesc: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  enterButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 10, // Added bottom margin so it's not cut off by safe area bottom
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  enterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});
