export interface PushNotification {
    id: number;
    title: string | null;
    message: string | null;
    data: {
        [key: string]: any;
    } | null;
    url: string | null;
}
