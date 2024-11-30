import { Body, Controller, Delete, Get, Param, Post, Put, BadRequestException } from '@nestjs/common';
import { QuestionBankService } from './questionbank.service'; 
import { QuestionBank } from '../../models/questionbank-schema'; 
import { UpdateQuestionBankDto } from './DTO/questionbank.update.dto';
import { CreateQuestionBankDto } from './DTO/questionbank.create.dto';

@Controller('questionbank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get()
  async getAllQuestionBanks(): Promise<QuestionBank[]> {
    return await this.questionBankService.findAll();
  }

  @Get(':id')
  async getQuestionBankById(@Param('id') id: string): Promise<QuestionBank> {
    const questionBank = await this.questionBankService.findById(id);
    return questionBank;
  }

  @Post()
  async createQuestionBank(
    @Body() questionBankData: CreateQuestionBankDto, 
    @Body('userId') userId: string // Include userId in the request body
  ): Promise<QuestionBank> {
    const newQuestionBank = await this.questionBankService.create(questionBankData, userId); // Pass userId to service
    return newQuestionBank;
  }

  @Put(':id')
  async updateQuestionBank(@Param('id') id: string, @Body() questionBankData: UpdateQuestionBankDto): Promise<QuestionBank> {
    const updatedQuestionBank = await this.questionBankService.update(id, questionBankData);
    return updatedQuestionBank;
  }

  @Delete(':id')
  async deleteQuestionBank(@Param('id') id: string): Promise<QuestionBank> {
    const deletedQuestionBank = await this.questionBankService.delete(id);
    return deletedQuestionBank;
  }
}
