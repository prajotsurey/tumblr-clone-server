import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Not} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";
import { Note } from "./Note";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;
  
  @Field()
  @Column()
  text!: string;

  @Field()
  @ManyToOne(() => User, user => user.posts)
  creator: User;

  @Field()
  @Column()
  creatorId!: number;

  @Field(() => [Note], {nullable: true})
  @OneToMany(() => Note, note => note.post)
  notes?: Note[];

  @Field()
  @Column({default : 0})
  noteCount: number;


  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}