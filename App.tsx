import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { scanLibrary } from './src/services/media';
import { BackupSummary } from './src/types';

const initialSummary: BackupSummary = {
  photos: 0,
  videos: 0,
  totalAssets: 0,
  backedUpAssets: 0,
  reclaimableBytes: 0,
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<BackupSummary>(initialSummary);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const reclaimable = useMemo(() => formatBytes(summary.reclaimableBytes), [summary.reclaimableBytes]);

  useEffect(() => {
    void bootstrap();
  }, []);

  async function bootstrap() {
    setLoading(true);
    const permission = await MediaLibrary.requestPermissionsAsync();
    const granted = permission.granted || permission.accessPrivileges === 'limited';
    setPermissionGranted(granted);

    if (granted) {
      const next = await scanLibrary();
      setSummary(next);
    }
    setLoading(false);
  }

  function startBackup() {
    if (!permissionGranted) {
      Alert.alert('ต้องอนุญาตการเข้าถึงรูป', 'KeepPic ต้องเห็นรูปและวิดีโอก่อนจึงจะสำรองข้อมูลได้');
      return;
    }
    Alert.alert('Backup Queue พร้อมแล้ว', 'ขั้นถัดไปคือเชื่อม Backup API และ Object Storage เพื่ออัปโหลดไฟล์จริง');
  }

  function freeSpace() {
    Alert.alert(
      'ระบบป้องกันการลบข้อมูล',
      'KeepPic จะเปิดให้คืนพื้นที่ได้เฉพาะไฟล์ที่เซิร์ฟเวอร์ยืนยันแล้วว่าสำรองสำเร็จและตรวจสอบ hash ตรงกันเท่านั้น',
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>กำลังตรวจคลังรูป...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>KeepPic</Text>
        <Text style={styles.title}>สำรองรูป แล้วคืนพื้นที่มือถือ</Text>
        <Text style={styles.subtitle}>รูปต้นฉบับยังอยู่ครบ จนกว่าระบบจะยืนยันการสำรองสำเร็จ</Text>

        <View style={styles.heroCard}>
          <Text style={styles.cardLabel}>คลังรูปบนเครื่อง</Text>
          <Text style={styles.bigNumber}>{summary.totalAssets.toLocaleString()}</Text>
          <Text style={styles.muted}>รูป {summary.photos.toLocaleString()} · วิดีโอ {summary.videos.toLocaleString()}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.cardLabel}>สำรองแล้ว</Text>
            <Text style={styles.statNumber}>{summary.backedUpAssets.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.cardLabel}>คืนพื้นที่ได้</Text>
            <Text style={styles.statNumber}>{reclaimable}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={startBackup}>
          <Text style={styles.primaryButtonText}>เริ่มสำรองข้อมูล</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={freeSpace}>
          <Text style={styles.secondaryButtonText}>คืนพื้นที่อย่างปลอดภัย</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>หลักการความปลอดภัย</Text>
          <Text style={styles.listItem}>1. ห้ามลบไฟล์ที่ยังไม่สำรองสำเร็จ</Text>
          <Text style={styles.listItem}>2. ตรวจ checksum/hash ก่อนเปลี่ยนสถานะเป็นสำรองแล้ว</Text>
          <Text style={styles.listItem}>3. ให้ผู้ใช้เลือกคืนพื้นที่เอง ไม่ลบอัตโนมัติแบบเงียบ</Text>
          <Text style={styles.listItem}>4. รองรับ Wi‑Fi only และ Charging only ในรุ่นถัดไป</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatBytes(bytes: number) {
  if (bytes <= 0) return '0 GB';
  const gb = bytes / 1024 / 1024 / 1024;
  return `${gb.toFixed(gb >= 10 ? 0 : 1)} GB`;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  container: { padding: 24, gap: 16 },
  brand: { fontSize: 18, fontWeight: '700', letterSpacing: 0.3 },
  title: { fontSize: 30, lineHeight: 38, fontWeight: '800' },
  subtitle: { fontSize: 15, lineHeight: 22, color: '#5B6472' },
  heroCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 22, borderWidth: 1, borderColor: '#E5E9F0' },
  row: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E5E9F0' },
  cardLabel: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  bigNumber: { fontSize: 38, fontWeight: '800' },
  statNumber: { fontSize: 24, fontWeight: '800' },
  muted: { color: '#6B7280' },
  primaryButton: { backgroundColor: '#111827', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingVertical: 16, alignItems: 'center', backgroundColor: '#FFFFFF' },
  secondaryButtonText: { color: '#111827', fontWeight: '700', fontSize: 16 },
  section: { marginTop: 8, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  listItem: { color: '#374151', lineHeight: 21 },
});
