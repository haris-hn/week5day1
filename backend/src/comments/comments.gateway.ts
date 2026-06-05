import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private commentsService: CommentsService) {}

  // When user connects
  async handleConnection(client: Socket) {
    console.log('User connected:', client.id);
    const comments = await this.commentsService.getAll();
    client.emit('load_comments', comments);
  }

  // When user disconnects
  handleDisconnect(client: Socket) {
    console.log('User disconnected:', client.id);
  }

  // ➕ ADD COMMENT
  @SubscribeMessage('add_comment')
  async handleAddComment(@MessageBody() data: any) {
    if (!data?.text || !data?.username) return;

    const comment = await this.commentsService.add({
      text: data.text,
      userId: data.username,
      createdAt: new Date(),
      likes: 0,
      parentId: data.parentId || null,
    });

    this.server.emit('new_comment', comment);
  }

  // ✏️ EDIT COMMENT
  @SubscribeMessage('edit_comment')
  async handleEdit(@MessageBody() data: any) {
    const updated = await this.commentsService.update(data.id, data.text);
    if (updated) {
      this.server.emit('updated_comment', updated);
    }
  }

  // ❌ DELETE COMMENT
  @SubscribeMessage('delete_comment')
  async handleDelete(@MessageBody() id: string) {
    await this.commentsService.delete(id);
    this.server.emit('deleted_comment', id);
  }

  // ❤️ LIKE COMMENT
  @SubscribeMessage('like_comment')
  async handleLike(@MessageBody() id: string) {
    const updated = await this.commentsService.like(id);
    if (updated) {
      this.server.emit('liked_comment', updated);
    }
  }
}