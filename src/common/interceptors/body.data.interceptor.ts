import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class BodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const body = JSON.parse(request.body.data);
      request.body = body;
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return next.handle();
  }
}
