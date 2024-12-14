/* eslint-disable prettier/prettier */
import { Request } from 'express';
import { UserDocument } from 'src/models/user-schema'; // Adjust the import to your User schema or document type

export interface CustomRequest extends Request {
  user: UserDocument; // Use the appropriate type (e.g., UserDocument or a derived type)
}
