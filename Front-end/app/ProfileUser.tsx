// app/ProfileDetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {  useRouter } from "expo-router";
import getUserInfo, { UserData, UserResponse } from "../fetchAPI/userAPI"; // Đường dẫn đúng đến file bạn đã tạo trước
import Background from "@/Components/userbackground";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function ProfileDetailScreen() {
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets()
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const info = await getUserInfo();
      setUserInfo(info);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7056A1" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không thể tải thông tin người dùng</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Background>
        <View style={{flex:1, paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
                                 paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,}}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {userInfo?.data.avatar ? (
            <Image source={{ uri: userInfo.data.avatar }} style={styles.avatarImage} />
            ) : (
            <Ionicons name="person" size={80} color="black" />
            )}
          </View>
        </View>

        {/* Username */}
        <Text style={styles.username}>{userInfo.data.username || "Chưa đặt tên"}</Text>
        {/* <Text style={styles.role}>{userInfo.data.role === "user" ? "Người dùng" : userInfo.data.role}</Text> */}

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={24} color="#7056A1" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{userInfo.data.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="phone-portrait-outline" size={24} color="#7056A1" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Số điện thoại</Text>
              <Text style={styles.value}>{userInfo.data.phone || "Chưa cung cấp"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
        
    </Background>
      
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },

  backIcon: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#FFF", justifyContent:"center", alignItems:"center", textAlign:"center" },
  scrollContent: { padding: 20, alignItems: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" },
  loadingText: { color: "#FFF", marginTop: 12, fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" },
  errorText: { color: "#FF6B6B", fontSize: 18, marginBottom: 20 },
  backButton: { backgroundColor: "#7056A1", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: "#FFF", fontWeight: "bold" },
  avatarContainer: { marginBottom: 20 },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#7056A1",
  },
  avatarImage: { width: "100%", height: "100%" },
  username: { fontSize: 28, fontWeight: "bold", color: "#FFF", marginBottom: 20 },
  infoSection: { width: "100%" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16213E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: { marginLeft: 16, flex: 1 },
  label: { fontSize: 14, color: "#AAA" },
  value: { fontSize: 17, color: "#FFF", fontWeight: "600", marginTop: 4 },
});