export enum EventType {
    Message = 1,
    Edit = 2,
    Join = 3,
    Leave = 4,
    NameChange = 5,
    Star = 6,
    Debug = 7,
    Mention = 8,
    Flag = 9,
    Delete = 10,
    FileUpload = 11,
    ModeratorFlag = 12,
    SettingsChanged = 13,
    GlobalNo = 14,
    AccessChanged = 15,
    Notification = 16,
    Invitation = 17,
    Reply = 18,
    MessageMovedOut = 19,
    MessageMovedIn = 20,
    TimeBreak = 21,
    FeedTicker = 22,
    UserSuspension = 29,
    UserMerge = 30,
    UserNameOrAvatarChange = 34
}

export interface NewMessageEvent {
    event_type: EventType.Message,
    time_stamp: number,
    content: string,
    user_id: number,
    user_name: string,
    room_id: number,
    message_id: number
}



export type ChatEvent = {
    event_type: EventType
} & NewMessageEvent