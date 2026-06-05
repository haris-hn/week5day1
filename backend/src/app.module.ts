import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsGateway } from './comments/comments.gateway';
import { CommentsService } from './comments/comments.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { User, UserSchema } from './auth/user.schema';
import { Comment, CommentSchema } from './comments/comment.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://haris:Haris123@cluster1.tpsiw8f.mongodb.net/comments-app'),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  providers: [CommentsGateway, CommentsService, AuthService],
  controllers: [AuthController],
})
export class AppModule {}