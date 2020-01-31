import { IsInt, Min, Max } from "class-validator";

export class ScoringParam {
  @IsInt()
  id: number;

  @IsInt()
  @Min(0)
  @Max(100)
  value: number;

}
