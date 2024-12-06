/* eslint-disable prettier/prettier */
import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';
//import { Types } from 'mongoose';

export class SearchThreadDto {
    threadTitle? : string;

    topics?: string[];
}