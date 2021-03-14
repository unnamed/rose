export enum ModerationType {
  MUTE,
  BAN
}

export interface ModerationData {
  type: ModerationType,
  expires?: number
}

