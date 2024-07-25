export type ChatMessage = {
    msg: string;
    type: string;
    user: { firstName: string; lastName: string } | null;
};