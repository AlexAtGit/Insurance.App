import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { ApiService } from '../../services/api.service';
import { CalculationResponse } from '../../models/calculation.model';
import { of, throwError } from 'rxjs';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['calculate']);

    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('probabilityA')?.value).toBe('');
    expect(component.form.get('probabilityB')?.value).toBe('');
    expect(component.form.get('functionName')?.value).toBe('CombinedWith');
  });

  it('should validate that fields are required', () => {
    const form = component.form;
    expect(form.valid).toBeFalsy();

    form.get('probabilityA')?.setValue('0.5');
    expect(form.valid).toBeFalsy();

    form.get('probabilityB')?.setValue('0.3');
    expect(form.valid).toBeTruthy();
  });

  it('should validate number format', () => {
    const control = component.form.get('probabilityA');
    control?.setValue('abc');
    expect(control?.hasError('notANumber')).toBeTruthy();
  });

  it('should validate probability range (0-1)', () => {
    const control = component.form.get('probabilityA');
    
    control?.setValue('1.5');
    expect(control?.hasError('outOfRange')).toBeTruthy();

    control?.setValue('-0.1');
    expect(control?.hasError('outOfRange')).toBeTruthy();

    control?.setValue('0.5');
    expect(control?.hasError('outOfRange')).toBeFalsy();
  });

  it('should call API service with correct payload on calculate', () => {
    const mockResponse: CalculationResponse = {
      result: 0.15,
      calculatedAt: new Date().toISOString()
    };

    apiService.calculate.and.returnValue(of(mockResponse));

    component.form.patchValue({
      probabilityA: '0.5',
      probabilityB: '0.3',
      functionName: 'CombinedWith'
    });

    component.onCalculate();

    expect(apiService.calculate).toHaveBeenCalledWith({
      probabilityA: 0.5,
      probabilityB: 0.3,
      functionName: 'CombinedWith'
    });
  });

  it('should display result on successful API call', (done) => {
    const mockResponse: CalculationResponse = {
      result: 0.15,
      calculatedAt: new Date().toISOString()
    };

    apiService.calculate.and.returnValue(of(mockResponse));

    component.form.patchValue({
      probabilityA: '0.5',
      probabilityB: '0.3'
    });

    component.onCalculate();

    setTimeout(() => {
      expect(component.result).toEqual(mockResponse);
      expect(component.error).toBeNull();
      done();
    }, 100);
  });

  it('should handle API errors', (done) => {
    apiService.calculate.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    component.form.patchValue({
      probabilityA: '0.5',
      probabilityB: '0.3'
    });

    component.onCalculate();

    setTimeout(() => {
      expect(component.error).toBeTruthy();
      expect(component.result).toBeNull();
      done();
    }, 100);
  });

  it('should reset form on resetForm call', () => {
    component.form.patchValue({
      probabilityA: '0.5',
      probabilityB: '0.3',
      functionName: 'Either'
    });
    component.result = { result: 0.15, calculatedAt: new Date().toISOString() };

    component.resetForm();

    expect(component.form.get('probabilityA')?.value).toBeNull();
    expect(component.form.get('probabilityB')?.value).toBeNull();
    expect(component.form.get('functionName')?.value).toBe('CombinedWith');
    expect(component.result).toBeNull();
    expect(component.error).toBeNull();
  });

  it('should not submit form if validation fails', () => {
    component.form.patchValue({
      probabilityA: 'invalid',
      probabilityB: '0.3'
    });

    component.onCalculate();

    expect(apiService.calculate).not.toHaveBeenCalled();
    expect(component.error).toBeTruthy();
  });
});