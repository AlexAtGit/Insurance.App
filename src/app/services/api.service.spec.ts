import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { CalculationRequest, CalculationResponse } from '../models/calculation.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, ConfigService]
    });
    service = TestBed.inject(ApiService);
    configService = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call calculate endpoint with correct payload', () => {
    const mockRequest: CalculationRequest = {
      probabilityA: 0.5,
      probabilityB: 0.3,
      functionName: 'CombinedWith'
    };

    const mockResponse: CalculationResponse = {
      result: 0.15,
      calculatedAt: new Date().toISOString()
    };

    service.calculate(mockRequest).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(configService.getCalculationEndpoint());
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should handle HTTP errors', () => {
    const mockRequest: CalculationRequest = {
      probabilityA: 0.5,
      probabilityB: 0.3,
      functionName: 'Either'
    };

    service.calculate(mockRequest).subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(configService.getCalculationEndpoint());
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Internal Server Error' });
  });
});