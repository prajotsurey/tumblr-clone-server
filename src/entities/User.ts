import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Note } from "./Note";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique: true})
    username!: string;

    @Field()
    @Column()
    email!: string;

    @Column()
    password!: string;

    @Field(() => [Post])
    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @Field(() => [Note], {nullable: true})
    @OneToMany(() => Note, note => note.user)
    notes?: Note[];

    @Field()
    @Column("int", { default:0 })
    tokenVersion: number;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;

}