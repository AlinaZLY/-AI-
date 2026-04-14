import { IsString, IsOptional, IsEnum, Length } from 'class-validator';
import { NoteType } from '../entities/application-note.entity';

export class CreateNoteDto {
  @IsOptional()
  @IsEnum(NoteType)
  type?: NoteType;

  @IsString()
  @Length(1, 5000)
  content: string;
}
