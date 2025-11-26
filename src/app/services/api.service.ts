import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { CalculationRequest, CalculationResponse } from '../models/calculation.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  calculate(request: CalculationRequest): Observable<CalculationResponse> {
    const endpoint = this.configService.getCalculationEndpoint();
    return this.http.post<CalculationResponse>(endpoint, request).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  private getErrorMessage(error: any): string {
    if (error.error instanceof ErrorEvent) {
      return `Client Error: ${error.error.message}`;
    }
    return error.status 
      ? `Server Error: ${error.status} - ${error.statusText}` 
      : 'An unknown error occurred';
  }
}