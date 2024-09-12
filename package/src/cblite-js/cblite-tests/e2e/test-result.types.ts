export interface ITestResult {
  testName: string;
  success: boolean;
  message: string | undefined;
  data: string | undefined;
}

export interface ITestCaseResult {
  name: string;
  success: boolean;
  errorMessage: string | undefined;
}
