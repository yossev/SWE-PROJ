/* eslint-disable prettier/prettier */

export class UpdateThreadDto {

  threadId : string;
  threadTitle?: string; // The title of the thread


  content?: string; // The content of the thread

  forum?: string;

  createdBy?: string; // The user who created the thread

  topics?: string[];
}