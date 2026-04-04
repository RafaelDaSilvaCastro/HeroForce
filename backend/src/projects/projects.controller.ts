import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('projects')
@ApiBearerAuth('jwt')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Criar novo projeto' })
  @ApiBody({
    type: CreateProjectDto,
    schema: {
      example: {
        name: 'Project Name',
        description: 'Project Description',
        status: 'pendente',
        goals: ['encantamento'],
        userId: '57e69c99-06f6-4de6-96af-47d3004c2e3d',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Projeto criado' })
  @ApiResponse({ status: 404, description: 'User não encontrado' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar projetos' })
  @ApiResponse({ status: 200, description: 'Lista de projetos' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar projeto por id' })
  @ApiResponse({ status: 200, description: 'Projeto encontrado' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    if (!project) throw new NotFoundException(`Project with id ${id} not found`);
    return project;
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualizar projeto' })
  @ApiResponse({ status: 200, description: 'Projeto atualizado' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    const project = await this.projectsService.update(id, updateProjectDto);
    if (!project) throw new NotFoundException(`Project with id ${id} not found`);
    return project;
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('admin')
  @ApiOperation({ summary: 'Excluir projeto' })
  @ApiResponse({ status: 204, description: 'Projeto excluído' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado' })
  async remove(@Param('id') id: string) {
    const project = await this.projectsService.remove(id);
  }
}