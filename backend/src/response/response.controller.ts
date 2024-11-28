import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseSchema, ResponseDocument } from '../../models/responses-schema';
import { CreateResponseDto } from './dto/createResponse.dto'; 
import { UpdateResponseDto, UpdateAnswerDto  } from './dto/updateResponse.dto';  
