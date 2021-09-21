import internal from "stream";
import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity} from "typeorm";
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
    @OneToMany(() => Post, post => post.user)
    posts: Post[];

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