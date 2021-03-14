export enum ModerationType {
  MUTE,
  BAN
}

export interface ModerationData {
  guild: string,
  target: string,
  moderator: string,
  reason: string,
  type: ModerationType,
  expires?: number
}

