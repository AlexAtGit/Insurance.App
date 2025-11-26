import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CalculationRequest, CalculationResponse } from '../../models/calculation.model';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  form: FormGroup;
  result: CalculationResponse | null = null;
  error: string | null = null;
  loading: boolean = false;
  submitted: boolean = false;

  functionOptions = [
    { value: 'CombinedWith', label: 'CombinedWith' },
    { value: 'Either', label: 'Either' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.form = this.formBuilder.group({
      probabilityA: ['', [Validators.required, this.numberValidator.bind(this)]],
      probabilityB: ['', [Validators.required, this.numberValidator.bind(this)]],
      functionName: ['CombinedWith', Validators.required]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  numberValidator(control: any): { [key: string]: any } | null {
    if (control.value === null || control.value === '') {
      return null;
    }
    const value = parseFloat(control.value);
    if (isNaN(value)) {
      return { notANumber: true };
    }
    if (value < 0 || value > 1) {
      return { outOfRange: true };
    }
    return null;
  }

  onCalculate(): void {
    this.submitted = true;
    this.error = null;
    this.result = null;

    if (this.form.invalid) {
      this.error = 'Please fix the errors in the form';
      return;
    }

    this.loading = true;

    const request: CalculationRequest = {
      probabilityA: parseFloat(this.form.get('probabilityA')?.value),
      probabilityB: parseFloat(this.form.get('probabilityB')?.value),
      functionName: this.form.get('functionName')?.value
    };

    this.apiService.calculate(request).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'An error occurred during calculation';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.form.reset({ functionName: 'CombinedWith' });
    this.result = null;
    this.error = null;
    this.submitted = false;
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors || !this.submitted) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName} is required`;
    }
    if (field.errors['notANumber']) {
      return `${fieldName} must be a valid number`;
    }
    if (field.errors['outOfRange']) {
      return `${fieldName} must be between 0 and 1`;
    }
    return '';
  }
}