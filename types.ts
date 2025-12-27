
export enum TaskMode {
  STEP_CORRECTION = 'STEP_CORRECTION',
  GEOMETRY_ANALYSIS = 'GEOMETRY_ANALYSIS',
  PROBLEM_VARIATION = 'PROBLEM_VARIATION'
}

export interface AnalysisResult {
  content: string;
  error?: string;
}

export interface AppState {
  mode: TaskMode;
  image: string | null;
  analyzing: boolean;
  result: AnalysisResult | null;
}
