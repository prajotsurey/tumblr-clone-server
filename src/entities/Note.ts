import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity()
export class Note extends BaseEntity{
  @Field()
  @PrimaryColumn()  
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: "CASCADE",
  })  
  user: User;

  @Field()
  @PrimaryColumn()
  postId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, post => post.notes,{
    onDelete: "CASCADE",
  })
  post: Post;
  
}