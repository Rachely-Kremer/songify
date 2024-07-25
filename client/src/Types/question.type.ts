export type Message = {
    msg: string;
    type: 'chat' | 'question' | 'answer';
    user: { firstName: string; lastName: string } | null;
    isCorrect?: boolean;
};
