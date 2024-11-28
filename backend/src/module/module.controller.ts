import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ModuleService } from './module.service'; 
import {Quiz } from '../../models/quizzes-schema';   
import {Module } from '../../models/module-schema'; 
import { UpdateModuleDto } from './DTO/module.update.dto';
import { CreateModuleDto } from './DTO/module.create.dto';

@Controller('interactive')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {} 

    @Get()
    async getAllModules(): Promise<Module[]> {
        return await this.moduleService.findAll();
    }
    @Get(':id')
    async getModuleById(@Param('id') id: string):Promise<Module> {
        const module = await this.moduleService.findById(id);
        return module;
    }

    @Post()
    async createModule(@Body()moduleData: CreateModuleDto) :Promise<Module> {
        const newModule= await this.moduleService.create(moduleData);
        return newModule;
    }

    @Put(':id')
    async updateModule(@Param('id') id:string,@Body()moduleData: UpdateModuleDto) :Promise<Module>{
        const updatedModule = await this.moduleService.update(id, moduleData);
        return updatedModule;       
    }
    
    @Delete(':id')
    async deleteModule(@Param('id')id:string):Promise<Module>  {
        const deletedmodule = await this.moduleService.delete(id);
       return deletedmodule;
    }

}


