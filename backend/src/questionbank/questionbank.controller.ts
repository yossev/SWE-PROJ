import { Body, Controller, Delete, Get, Param, Post, Put, BadRequestException } from '@nestjs/common';
import { QuestionBankService } from './questionbank.service';
import { QuestionBank } from '../../models/questionbank-schema';
import { UpdateQuestionBankDto } from './DTO/questionbank.update.dto';
import { CreateQuestionBankDto } from './DTO/questionbank.create.dto';

@Controller('questionbank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get()
  async getAllQuestionBanks(@Body('userId') userId: string): Promise<QuestionBank[]> {
    return await this.questionBankService.findAll(userId);
  }

  @Get(':id')
  async getQuestionBankById(@Param('id') id: string, @Body('userId') userId: string): Promise<QuestionBank> {
    return await this.questionBankService.findById(id, userId); 
  }

  @Post('createquestion')
  async createQuestionBank(
    @Body() questionBankData: CreateQuestionBankDto,
    @Body('userId') userId: string
  ): Promise<QuestionBank> {
    return await this.questionBankService.create(questionBankData, userId);
  }

  @Put(':id')
  async updateQuestionBank(
    @Param('id') id: string,
    @Body() questionBankData: UpdateQuestionBankDto,
    @Body('userId') userId: string
  ): Promise<QuestionBank> {
    return await this.questionBankService.update(id, questionBankData, userId); 
  }

  @Delete(':id')
  async deleteQuestionBank(@Param('id') id: string, @Body('userId') userId: string): Promise<QuestionBank> {
    return await this.questionBankService.delete(id, userId);
  }
}
