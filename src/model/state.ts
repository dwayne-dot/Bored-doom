// The app's persisted state, typed. This is the prototype's `S` object made
// explicit, so every native screen reads and writes the same shape.
// Persist with AsyncStorage under key "bd-state-v1" (Phase 5).

export type Mood = 'bored' | 'stressed' | 'tired' | 'anxious' | 'great';
export type Provider = 'Apple' | 'Google' | 'email';
export type IdStyle = 'classic' | 'official' | 'cosmic' | 'gold';
export type IdPhoto = 'head-happy' | 'face-wave' | 'face-calm' | 'face-thinking';
export type DangerHour = 'morning' | 'afternoon' | 'evening' | 'late';
export type Accessory = 'none' | 'sunglasses' | 'scarf' | 'hat' | 'bandana' | 'bowtie' | 'crown' | 'beanie';
export type LockGroup = 'social' | 'video' | 'games' | 'shopping';

export interface JournalEntry { id: string; ts: number; text: string; mood?: Mood; reply: string; urge?: boolean }
export interface Feedback { contentId: string; vote: 'up' | 'down'; reasons?: string[]; text?: string; ts: number }
export interface LockedIn { start: number; until: number; durationHours: 1 | 4 | 8 | 24; groups: LockGroup[] }

export interface AppState {
  // identity & account
  onboarded: boolean;
  name: string;
  signedIn: boolean;
  provider?: Provider;
  pro: boolean;
  // habit setup
  habits: string[];
  hours: DangerHour[];
  dangerWindow: { startHour: number; endHour: number }; // e.g. 21–25 (=1 AM)
  why: { text: string; img: string | null };
  // progress
  streak: number;
  best: number;
  beatenToday: number;
  treats: number;
  mercyLeft: number;          // Milo's Mercy: streak saves per week
  moods: Record<Mood, number>;
  slips: { ts: number; note?: string }[];
  lastWin: number | null;
  journal: JournalEntry[];
  worked: Record<string, number>; // pick id → times it helped (Milo's Picks)
  feedback: Feedback[];
  // Milo
  bandana: string;            // color id
  accessory: Accessory;
  owned: Accessory[];
  room: string[];             // room item ids
  id: { style: IdStyle; photo: IdPhoto; issuedAt: number; since: number };
  // modes
  shield: boolean;
  bedtime: boolean;
  lockedIn: LockedIn | null;
  // preferences
  checkIns: boolean;
  sound: boolean;
  haptics: boolean;
  reduceMotion: boolean;
  largerText: boolean;
  mic: boolean;
  ai: { replies: boolean | undefined; journal: boolean; timing: boolean }; // replies undefined = not asked yet
}

export const defaultState: AppState = {
  onboarded: false, name: '', signedIn: false, pro: false,
  habits: [], hours: ['late'], dangerWindow: { startHour: 21, endHour: 25 },
  why: { text: '', img: null },
  streak: 0, best: 0, beatenToday: 0, treats: 0, mercyLeft: 1,
  moods: { bored: 0, stressed: 0, tired: 0, anxious: 0, great: 0 },
  slips: [], lastWin: null, journal: [], worked: {}, feedback: [],
  bandana: 'amber', accessory: 'none', owned: ['none'], room: ['rug'],
  id: { style: 'classic', photo: 'head-happy', issuedAt: 0, since: 0 },
  shield: true, bedtime: false, lockedIn: null,
  checkIns: true, sound: true, haptics: true, reduceMotion: false, largerText: false, mic: false,
  ai: { replies: undefined, journal: false, timing: true },
};

export const ID_VALID_DAYS = 30;
export function idExpiresAt(s: AppState) { return s.id.issuedAt + ID_VALID_DAYS * 864e5; }
export function lockActive(s: AppState, now = Date.now()) { return !!s.lockedIn && s.lockedIn.until > now; }
