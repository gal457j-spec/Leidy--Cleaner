export interface ChatMessage {
    id: string;
    bookingId: string;
    senderId: string;
    senderRole: 'customer' | 'staff' | 'admin';
    message: string;
    messageType: 'text' | 'image' | 'file';
    fileUrl?: string;
    isRead: boolean;
    createdAt: string;
}
export interface ChatRoom {
    bookingId: string;
    customerId: string;
    staffId?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
}
export declare class ChatService {
    /**
     * Cria ou obtém uma sala de chat para um booking
     */
    static getOrCreateChatRoom(bookingId: string): Promise<ChatRoom | null>;
    /**
     * Salva uma mensagem no chat
     */
    static saveMessage(bookingId: string, senderId: string, senderRole: 'customer' | 'staff' | 'admin', message: string, messageType?: 'text' | 'image' | 'file', fileUrl?: string): Promise<ChatMessage | null>;
    /**
     * Obtém mensagens de um chat
     */
    static getMessages(bookingId: string, limit?: number, offset?: number): Promise<ChatMessage[]>;
    /**
     * Marca mensagens como lidas
     */
    static markAsRead(bookingId: string, userId: string): Promise<void>;
    /**
     * Obtém salas de chat do usuário
     */
    static getUserChatRooms(userId: string, userRole: string): Promise<ChatRoom[]>;
    /**
     * Obtém estatísticas do chat
     */
    static getStats(): Promise<{
        totalRooms: number;
        totalMessages: number;
        activeChats: number;
    }>;
}
//# sourceMappingURL=ChatService.d.ts.map