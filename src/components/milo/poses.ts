// Milo's static poses (PNG). The Rive file replaces these later
// (see the Rive brief); keep the same names so screens don't change.
export const POSES = {
  happy: require('../../../assets/milo/happy.png'),
  wave: require('../../../assets/milo/wave.png'),
  point: require('../../../assets/milo/point.png'),
  calm: require('../../../assets/milo/calm.png'),
  sad: require('../../../assets/milo/sad.png'),
  anxious: require('../../../assets/milo/anxious.png'),
  thinking: require('../../../assets/milo/thinking.png'),
  sleep: require('../../../assets/milo/sleep.png'),
  neutral: require('../../../assets/milo/neutral.png'),
  celebrate: require('../../../assets/milo/celebrate.png'),
  cheering: require('../../../assets/milo/cheering.png'),
  dance: require('../../../assets/milo/dance.png'),
  skate: require('../../../assets/milo/skate.png'),
  walk: require('../../../assets/milo/walk.png'),
  spin: require('../../../assets/milo/spin.png'),
  frontflip: require('../../../assets/milo/frontflip.png'),
  backflip: require('../../../assets/milo/backflip.png'),
  cartwheel: require('../../../assets/milo/cartwheel.png'),
  sunny: require('../../../assets/milo/sunny.png'),
  rainy: require('../../../assets/milo/rainy.png'),
  windy: require('../../../assets/milo/windy.png'),
  cold: require('../../../assets/milo/cold.png'),
  storm: require('../../../assets/milo/storm.png'),
  rainbow: require('../../../assets/milo/rainbow.png'),
} as const;
export type Pose = keyof typeof POSES;

export const FACES = {
  happy: require('../../../assets/milo/face-happy.png'),
  calm: require('../../../assets/milo/face-calm.png'),
  sad: require('../../../assets/milo/face-sad.png'),
  thinking: require('../../../assets/milo/face-thinking.png'),
  sleep: require('../../../assets/milo/face-sleep.png'),
  anxious: require('../../../assets/milo/face-anxious.png'),
  wave: require('../../../assets/milo/face-wave.png'),
  neutral: require('../../../assets/milo/face-neutral.png'),
  head: require('../../../assets/milo/head-happy.png'),
} as const;
export type Face = keyof typeof FACES;
