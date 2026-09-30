import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  ExerciseEntity,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../content/core/exercise.entity';

export class UpdateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ExerciseSkill)
  @IsNotEmpty()
  skill: ExerciseSkill;

  @IsEnum(ExerciseFormat)
  @IsNotEmpty()
  format: ExerciseFormat;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topics?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  references?: string[];

  @IsOptional()
  @IsString()
  scenario?: string;

  @IsOptional()
  @IsString()
  paragraph?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prompts?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  validResponses?: string[];

  @IsOptional()
  @IsString()
  word?: string;

  @IsOptional()
  @IsString()
  meaning?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  clues?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sentences?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  words?: string[];

  @IsOptional()
  @IsString()
  sentence?: string;

  @IsNotEmpty()
  @IsEnum(ExerciseStatus)
  status: ExerciseStatus;

  toEntity(): Omit<
    ExerciseEntity,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
  > {
    return {
      name: this.name,
      skill: this.skill,
      format: this.format,
      topics: this.topics ?? [],
      references: this.references ?? [],
      status: this.status,
      scenario: this.scenario,
      paragraph: this.paragraph,
      prompts: this.prompts,
      validResponses: this.validResponses,
      word: this.word,
      meaning: this.meaning,
      clues: this.clues,
      sentences: this.sentences,
      words: this.words,
      sentence: this.sentence,
    };
  }
}
