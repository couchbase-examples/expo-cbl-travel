
import { LogLevel, LogDomain } from './log-sinks-enums';
 

/**
 * Configuration for console log sink
 */
export interface ConsoleLogSinkConfig {
  /** The minimum log level to log */
  level: LogLevel;
  
  /** The log domains to log. Defaults to all domains if not specified. */
  domains?: LogDomain[];
}

/**
 * Configuration for file log sink
 */
export interface FileLogSinkConfig {
  /** The minimum log level to log */
  level: LogLevel;
  
  /** The directory where log files will be stored */
  directory: string;
  
  /** Use plaintext format instead of binary. Defaults to false. */
  usePlaintext?: boolean;
  
  /** Maximum size of a log file in bytes. Defaults to 524288 (512KB). */
  maxFileSize?: number;
  
  /** Maximum number of rotated log files to keep. Defaults to 2. */
  maxKeptFiles?: number;
}

/**
 * Configuration for custom log sink with callback
 */
export interface CustomLogSinkConfig {
  /** The minimum log level to log */
  level: LogLevel;
  
  /** The log domains to log. Defaults to all domains if not specified. */
  domains?: LogDomain[];
  
  /** Callback function that receives log messages */
  callback: (level: LogLevel, domain: LogDomain, message: string) => void;
}


/**
 * Arguments for setting console log sink (internal bridge use)
 * Note: level of -1 is used as a sentinel value to indicate "disable"
 */
export interface LogSinksSetConsoleArgs {
  level: number;
  domains: string[];
}

/**
 * Arguments for setting file log sink (internal bridge use)
 * Note: level of -1 and empty config is used as a sentinel value to indicate "disable"
 */
export interface LogSinksSetFileArgs {
  level: number;
  config: {
    directory?: string;
    usePlaintext?: boolean;
    maxFileSize?: number;
    maxKeptFiles?: number;
  };
}

/**
 * Arguments for setting custom log sink (internal bridge use)
 * Note: level of -1 and empty token is used as a sentinel value to indicate "disable"
 */
export interface LogSinksSetCustomArgs {
  level: number;
  domains: string[];
  token: string;
}