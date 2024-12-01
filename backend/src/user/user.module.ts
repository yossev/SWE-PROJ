/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserSchema } from 'models/user-schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports:[MongooseModule.forFeature([{name:'user',schema:UserSchema}])]
})

export class UserModule {}
