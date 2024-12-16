import { Body, Controller, Delete, Get, Param, Post, Put, BadRequestException } from '@nestjs/common';
import { QuestionBankService } from './questionbank.service';
import { QuestionBank } from '../../src/models/questionbank-schema';
import { UpdateQuestionBankDto } from './DTO/questionbank.update.dto';
import { CreateQuestionBankDto } from './DTO/questionbank.create.dto';
import { Query } from '@nestjs/common';
@Controller('questionbank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get('allquestionbanks')
  async getAllQuestionBanks(): Promise<QuestionBank[]> {
      return await this.questionBankService.findAll();  
  }
  

@Get('questionbank')
async getQuestionBankById(@Query('id') id: string): Promise<QuestionBank> {
  console.log('Received ID: ' + id );
  return await this.questionBankService.findById(id);
}
@Post('createquestion')
async createQuestionBank(
  @Body() questionBankData: CreateQuestionBankDto
): Promise<QuestionBank> {
  return await this.questionBankService.create(questionBankData);
}



@Put('updatequestionbank')
async updateQuestionBank(
  @Query('id') id: string,
  @Body() questionBankData: UpdateQuestionBankDto
): Promise<QuestionBank> {
  console.log('Received ID: ' + id);
  return await this.questionBankService.update(id, questionBankData);
}


@Delete('deletequestionbank')
async deleteQuestionBank(@Query('id') id: string): Promise<QuestionBank> {
  console.log('Received ID: ' + id);
  return await this.questionBankService.delete(id); 
}

}