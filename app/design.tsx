import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Text, Tactile, PrimaryButton, GhostButton, LinkButton, Chip, Row, Section, IconBubble, PawToggle } from '@/components/ui';
import { KitIcon, YouIcon, LockIcon, PawIcon } from '@/components/icons/Icons';
import { Milo, MiloFace } from '@/components/milo/Milo';
import type { Pose } from '@/components/milo/poses';
import { KIT, type KitKey } from '@/icons/xml';
import { colors, spacing } from '@/theme';
import { type } from '@/theme/tokens';

const POSE_CHIPS: Pose[] = ['happy', 'wave', 'calm', 'thinking', 'celebrate', 'skate', 'sleep', 'rainy'];

// Phase 2 deliverable: every shared component, live, so we can feel them on
// a real phone before building screens with them.
export default function DesignSystem() {
  const insets = useSafeAreaInsets();
  const [pose, setPose] = useState<Pose>('happy');
  const [pets, setPets] = useState(0);
  const [shield, setShield] = useState(true);
  const [bedtime, setBedtime] = useState(false);
  const [locked, setLocked] = useState(false);
  const [dur, setDur] = useState('4 hours');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: spacing.screen, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="display">Design</Text>
        <Tactile onPress={() => router.back()} radius={22} accessibilityLabel="Close"
          contentStyle={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <X size={20} color={colors.cream} strokeWidth={2.6} />
        </Tactile>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.screen, paddingBottom: insets.bottom + 40, gap: 22 }}>
        <Text variant="body" color="muted">Native React Native components for Bored Doom. Everything here is real: tap, hold, rub Milo, flip the toggles.</Text>

        {/* Milo */}
        <Section title="Milo">
          <Tactile contentStyle={{ alignItems: 'center', paddingVertical: 18, gap: 10 }}>
            <Milo pose={pose} size={200} rubbable onPet={setPets} />
            <Text variant="caption" color="muted">{pets ? `Pets: ${pets} — he loves it` : 'Rub Milo to pet him'}</Text>
          </Tactile>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {POSE_CHIPS.map((p) => <Chip key={p} label={p} selected={p === pose} onPress={() => setPose(p)} />)}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            {(['happy', 'sad', 'sleep', 'anxious', 'calm'] as const).map((f) => <MiloFace key={f} face={f} size={58} />)}
          </View>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <PrimaryButton label="I rode it out" onPress={() => {}} />
          <GhostButton label="Log out" onPress={() => {}} />
          <GhostButton label="Delete account" danger onPress={() => {}} />
          <LinkButton label="I slipped, and that's okay" onPress={() => {}} />
        </Section>

        {/* Rows */}
        <Section title="Settings rows">
          <Row icon={<YouIcon name="shield" />} title="Milo shield" subtitle="Pauses social apps in danger hours" toggle={{ value: shield, onChange: setShield }} />
          <Row icon={<YouIcon name="bedtime" />} title="Bedtime mode" subtitle="Wind down from 11:30 PM" toggle={{ value: bedtime, onChange: setBedtime }} />
          <Row icon={<YouIcon name="sound" />} title="Sound, motion & text" onPress={() => {}} />
          <Row icon={<YouIcon name="help" />} title="Help & support" onPress={() => {}} />
          <Row icon={<YouIcon name="privacy" />} title="AI & privacy" subtitle="How Milo uses your words" onPress={() => {}} />
        </Section>

        {/* Locked In card */}
        <Section title="Locked In">
          <Tactile onPress={() => setLocked((l) => !l)} bg="#183A33"
            contentStyle={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderWidth: 1.5, borderColor: locked ? colors.gold : 'rgba(242,204,107,.35)', borderRadius: 28 }}>
            <IconBubble size={44} bg={colors.gold}><LockIcon open={!locked} color={colors.ink} /></IconBubble>
            <View style={{ flex: 1 }}>
              <Text variant="title">{locked ? 'Locked In' : 'Locked In mode'}</Text>
              <Text variant="caption" color={locked ? 'gold' : 'muted'}>{locked ? '4h left · until 4:18 AM' : "Go strict. No off switch until time's up."}</Text>
            </View>
          </Tactile>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {['1 hour', '4 hours', '8 hours', '24 hours'].map((d) => <Chip key={d} label={d} selected={d === dur} onPress={() => setDur(d)} />)}
          </View>
        </Section>

        {/* Toolkit */}
        <Section title="Milo's toolkit icons">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 }}>
            {(Object.keys(KIT) as KitKey[]).map((k) => (
              <Pressable key={k} style={{ width: '23%', alignItems: 'center', gap: 6 }} accessibilityRole="button" accessibilityLabel={KIT[k].label}>
                <IconBubble size={64} bg={KIT[k].bg}><KitIcon name={k} size={38} /></IconBubble>
                <Text variant="micro" align="center">{KIT[k].label}</Text>
              </Pressable>
            ))}
          </View>
        </Section>

        {/* Cream card */}
        <Section title="Cream card">
          <Tactile bg={colors.cream} contentStyle={{ padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }} onPress={() => {}}>
            <MiloFace face="wave" size={52} />
            <View style={{ flex: 1 }}>
              <Text variant="title" color="ink">Your Milo Wrapped is ready</Text>
              <Text variant="caption" color="ink2">Your week in 6 tiny stories</Text>
            </View>
          </Tactile>
        </Section>

        {/* Type */}
        <Section title="Type scale (Nunito)">
          {(Object.keys(type) as (keyof typeof type)[]).filter((k) => k !== 'timer').map((k) => (
            <Text key={k} variant={k}>{k} · {type[k].size}pt</Text>
          ))}
          <Text variant="timer" color="amber">0:58</Text>
        </Section>

        {/* Colours */}
        <Section title="Colours">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {(['bg', 'bg2', 'cream', 'amber', 'gold', 'green', 'mint', 'coral', 'muted', 'ink'] as const).map((c) => (
              <View key={c} style={{ alignItems: 'center', gap: 4 }}>
                <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors[c], borderWidth: 1, borderColor: colors.line }} />
                <Text variant="micro" color="muted">{c}</Text>
              </View>
            ))}
          </View>
        </Section>

        <View style={{ alignItems: 'center', gap: 6, opacity: 0.7 }}>
          <PawIcon size={22} color={colors.muted} />
          <Text variant="caption" color="muted">Phase 2 · design system</Text>
        </View>
      </ScrollView>
    </View>
  );
}
