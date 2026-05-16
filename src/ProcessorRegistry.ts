import {
  ClassProcessor,
  ConstProcessor,
  DeclarationProcessor,
  FunctionProcessor,
  ImportProcessor,
} from './Processor';
import { ProcessorConstructor } from './types';

export class ProcessorRegistry {
  private readonly map = new Map<string, ProcessorConstructor>([
    ['type', DeclarationProcessor],
    ['interface', DeclarationProcessor],
    ['function', FunctionProcessor],
    ['class', ClassProcessor],
    ['const', ConstProcessor],
    ['import', ImportProcessor],
  ]);

  get(keyword: string): ProcessorConstructor | undefined {
    return this.map.get(keyword);
  }

  keywords(): string[] {
    return [...this.map.keys()];
  }
}
