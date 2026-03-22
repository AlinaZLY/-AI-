import {
  IsString,
  Length,
  IsOptional,
  IsNumber,
  IsObject,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MaxJsonLength', async: false })
class MaxJsonLengthConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value == null) return true;
    try {
      const str = typeof value === 'string' ? value : JSON.stringify(value);
      return str.length <= 500000;
    } catch {
      return false;
    }
  }
  defaultMessage() {
    return '简历内容过大';
  }
}

export class CreateResumeDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  targetPosition?: string;

  @IsOptional()
  @IsNumber()
  templateId?: number;

  @IsOptional()
  @IsObject()
  @Validate(MaxJsonLengthConstraint)
  content?: Record<string, any>;
}
