import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl: string = environment.apiUrl;

  constructor() {}

  getApiUrl(): string {
    return this.apiUrl;
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  getCalculationEndpoint(): string {
    return `${this.apiUrl}/api/calculator`;
  }
}