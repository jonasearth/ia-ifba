import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Provider,
  Logger,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Request, Response } from 'express';
import { WsException } from '@nestjs/websockets';

@Catch()
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    switch (true) {
      case exception instanceof WsException:
        this.wsExceptionCatch(exception, host);
        break;
      case exception instanceof HttpException:
        if (host.getType() === 'ws') {
          this.wsExceptionCatch(exception, host);
        } else {
          this.httpExceptionCatch(exception, host);
        }
        break;
      default:
        this.defaultExceptionCatch(exception, host);
    }
  }

  public httpExceptionCatch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    Logger.error(exception.message);
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: (exception as Error).message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  public wsExceptionCatch(
    exception: HttpException | WsException,
    host: ArgumentsHost,
  ) {
    const client = host.switchToWs().getClient();
    Logger.error(exception.message);
    client.emit('error', {
      message:
        exception instanceof BadRequestException
          ? exception.getResponse()
          : exception.message,
      status: exception instanceof HttpException ? exception.getStatus() : 400,
    });
  }

  public defaultExceptionCatch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    Logger.error(exception.message);
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

export const ExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: ServerExceptionFilter,
};
