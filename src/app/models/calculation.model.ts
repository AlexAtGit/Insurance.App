export interface CalculationRequest {
  probabilityA: number;
  probabilityB: number;
  functionName: 'CombinedWith' | 'Either';
}

export interface CalculationResponse {
  result: number;
  calculatedAt: string;
}

export interface CalculationError {
  error: string;
  details?: string;
}
