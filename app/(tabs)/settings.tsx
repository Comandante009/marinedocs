import { useState } from 'react';
import { ScrollView, View, Text, Pressable, Switch, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/Strings';
import { formatFileSize } from '@/utils/helpers';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingsRowProps {
  icon: IconName;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  danger?: boolean;
}

function SettingsRow({ icon, iconColor = Colors.accent, label, value, onPress, rightComponent, danger }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !rightComponent}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: pressed && onPress ? Colors.cardHover : 'transparent',
      })}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          borderCurve: 'continuous',
          backgroundColor: (danger ? Colors.danger : iconColor) + '20',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={16} color={danger ? Colors.danger : iconColor} />
      </View>
      <Text
        style={{
          flex: 1,
          fontFamily: Fonts.medium,
          fontSize: 15,
          color: danger ? Colors.danger : Colors.textPrimary,
        }}
      >
        {label}
      </Text>
      {value && (
        <Text
          selectable
          style={{
            fontFamily: Fonts.regular,
            fontSize: 14,
            color: Colors.textTertiary,
          }}
        >
          {value}
        </Text>
      )}
      {rightComponent}
      {onPress && !rightComponent && (
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      )}
    </Pressable>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 2 }}>
      <Text
        style={{
          fontFamily: Fonts.semiBold,
          fontSize: 13,
          color: Colors.textTertiary,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 8,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: Colors.card,
          borderRadius: 14,
          borderCurve: 'continuous',
          marginHorizontal: 16,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Divider() {
  return (
    <View style={{ height: 1, backgroundColor: Colors.divider, marginLeft: 60 }} />
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const lang = useAppStore((s) => s.preferences.language);
  const pinEnabled = useAppStore((s) => s.preferences.pinEnabled);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const setPinEnabled = useAppStore((s) => s.setPinEnabled);
  const documents = useAppStore((s) => s.documents);
  const isOnline = useAppStore((s) => s.isOnline);
  const setIsOnline = useAppStore((s) => s.setIsOnline);

  const [showPin, setShowPin] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const totalSize = documents.reduce((acc, d) => acc + d.fileSize, 0);

  const handlePinToggle = (value: boolean) => {
    if (value) {
      setShowPin(true);
    } else {
      setPinEnabled(false);
      setShowPin(false);
      setPinInput('');
    }
  };

  const handlePinSubmit = () => {
    if (pinInput.length === 4) {
      setPinEnabled(true);
      setShowPin(false);
      setPinInput('');
      Alert.alert(
        lang === 'en' ? 'PIN Set' : 'PIN Ayarlandı',
        lang === 'en' ? 'Your PIN has been set successfully.' : 'PIN başarıyla ayarlandı.'
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 8 }}>
        <Text
          style={{
            fontFamily: Fonts.bold,
            fontSize: 28,
            color: Colors.textPrimary,
            letterSpacing: -0.5,
          }}
        >
          {t('settings', lang)}
        </Text>
      </View>

      {/* General */}
      <SettingsSection title={lang === 'en' ? 'General' : 'Genel'}>
        <SettingsRow
          icon="language"
          label={t('language', lang)}
          rightComponent={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Pressable
                onPress={() => setLanguage('en')}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 6,
                  borderCurve: 'continuous',
                  backgroundColor: lang === 'en' ? Colors.accent : Colors.surface,
                }}
              >
                <Text style={{ fontFamily: Fonts.semiBold, fontSize: 12, color: lang === 'en' ? '#fff' : Colors.textTertiary }}>
                  EN
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setLanguage('tr')}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 6,
                  borderCurve: 'continuous',
                  backgroundColor: lang === 'tr' ? Colors.accent : Colors.surface,
                }}
              >
                <Text style={{ fontFamily: Fonts.semiBold, fontSize: 12, color: lang === 'tr' ? '#fff' : Colors.textTertiary }}>
                  TR
                </Text>
              </Pressable>
            </View>
          }
        />
        <Divider />
        <SettingsRow
          icon="wifi"
          iconColor={isOnline ? Colors.teal : Colors.warning}
          label={lang === 'en' ? 'Network Status' : 'Ağ Durumu'}
          rightComponent={
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: Colors.surface, true: Colors.teal + '50' }}
              thumbColor={isOnline ? Colors.teal : Colors.textTertiary}
            />
          }
        />
      </SettingsSection>

      {/* Security */}
      <SettingsSection title={lang === 'en' ? 'Security' : 'Güvenlik'}>
        <SettingsRow
          icon="lock-closed"
          iconColor={Colors.warning}
          label={t('pinLock', lang)}
          rightComponent={
            <Switch
              value={pinEnabled}
              onValueChange={handlePinToggle}
              trackColor={{ false: Colors.surface, true: Colors.accent + '50' }}
              thumbColor={pinEnabled ? Colors.accent : Colors.textTertiary}
            />
          }
        />
        {showPin && (
          <>
            <Divider />
            <View style={{ padding: 16, gap: 12 }}>
              <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>
                {lang === 'en' ? 'Enter a 4-digit PIN:' : '4 haneli PIN girin:'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  value={pinInput}
                  onChangeText={(text) => setPinInput(text.replace(/[^0-9]/g, '').slice(0, 4))}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  placeholder="• • • •"
                  placeholderTextColor={Colors.textTertiary}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.surface,
                    borderRadius: 10,
                    borderCurve: 'continuous',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    fontFamily: Fonts.bold,
                    fontSize: 20,
                    color: Colors.textPrimary,
                    textAlign: 'center',
                    letterSpacing: 8,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                  }}
                />
                <Pressable
                  onPress={handlePinSubmit}
                  disabled={pinInput.length !== 4}
                  style={{
                    backgroundColor: pinInput.length === 4 ? Colors.accent : Colors.surface,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    borderCurve: 'continuous',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: pinInput.length === 4 ? '#fff' : Colors.textTertiary }}>
                    {lang === 'en' ? 'Set' : 'Ayarla'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </SettingsSection>

      {/* Storage */}
      <SettingsSection title={t('storage', lang)}>
        <SettingsRow
          icon="folder"
          iconColor={Colors.teal}
          label={t('storageUsed', lang)}
          value={formatFileSize(totalSize)}
        />
        <Divider />
        <SettingsRow
          icon="documents"
          iconColor={Colors.accent}
          label={lang === 'en' ? 'Document Count' : 'Belge Sayısı'}
          value={documents.length.toString()}
        />
        <Divider />
        <SettingsRow
          icon="trash-outline"
          iconColor={Colors.danger}
          label={t('clearCache', lang)}
          danger
          onPress={() => {
            Alert.alert(
              t('clearCache', lang),
              lang === 'en'
                ? 'This will clear the search index cache. Documents will not be deleted.'
                : 'Arama dizin önbelleği temizlenecek. Belgeler silinmeyecek.',
              [
                { text: lang === 'en' ? 'Cancel' : 'İptal', style: 'cancel' },
                {
                  text: lang === 'en' ? 'Clear' : 'Temizle',
                  style: 'destructive',
                  onPress: () => Alert.alert(lang === 'en' ? 'Cache Cleared' : 'Önbellek Temizlendi'),
                },
              ]
            );
          }}
        />
      </SettingsSection>

      {/* Categories */}
      <SettingsSection title={lang === 'en' ? 'Data' : 'Veri'}>
        <SettingsRow
          icon="grid"
          label={t('manageCategories', lang)}
          onPress={() => Alert.alert(
            t('manageCategories', lang),
            lang === 'en' ? 'Category management interface would open here.' : 'Kategori yönetim arayüzü burada açılır.'
          )}
        />
        <Divider />
        <SettingsRow
          icon="download-outline"
          iconColor={Colors.teal}
          label={t('exportBackup', lang)}
          onPress={() => Alert.alert(
            t('exportBackup', lang),
            lang === 'en' ? 'Export document index as a backup file.' : 'Belge dizinini yedek dosya olarak dışa aktarın.'
          )}
        />
      </SettingsSection>

      {/* About */}
      <SettingsSection title={t('about', lang)}>
        <SettingsRow
          icon="information-circle"
          label="DocSearch"
          value="v1.0.0"
        />
        <Divider />
        <SettingsRow
          icon="boat"
          iconColor={Colors.teal}
          label={lang === 'en' ? 'Maritime Document Management' : 'Denizcilik Belge Yönetimi'}
        />
      </SettingsSection>

      {/* Footer */}
      <View style={{ alignItems: 'center', paddingTop: 24, gap: 4 }}>
        <Text style={{ fontFamily: Fonts.regular, fontSize: 12, color: Colors.textTertiary }}>
          DocSearch © 2026
        </Text>
        <Text style={{ fontFamily: Fonts.regular, fontSize: 11, color: Colors.textTertiary }}>
          {lang === 'en' ? 'Built for maritime professionals' : 'Denizcilik profesyonelleri için geliştirildi'}
        </Text>
      </View>
    </ScrollView>
  );
}
