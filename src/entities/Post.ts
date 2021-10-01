import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Note } from "./Note";
import { User } from "./User";

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

  @Field( () => User)
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
  noteStatus: Boolean;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}