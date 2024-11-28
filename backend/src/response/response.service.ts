import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../../models/progress-schema';
import { CreateResponseDto } from './dto/createResponse.dto'; 
import { UpdateResponseDto, UpdateAnswerDto } from './dto/updateResponse.dto'; 