import { Directive, forwardRef, OnInit, Input, OnChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { L10nNumberFormatOptions } from '../models/types';
import { L10nValidation } from '../services/l10n-validation';

/**
 * Function that takes a control and returns either null when it’s valid, or an error object if it’s not.
 * @param validation The instance of L10nValidation service
 * @param options A L10n or Intl NumberFormatOptions object
 * @param minValue The minimum value
 * @param maxValue The maximum value
 * @param language The current language
 * @return An error object: 'format', 'minValue' or 'maxValue'; null in case the value is valid
 */
export function l10nValidateNumber(
    validation: L10nValidation,
    options?: L10nNumberFormatOptions,
    minValue = Number.MIN_VALUE,
    maxValue = Number.MAX_VALUE,
    language?: string
): ValidatorFn {
    const validator = (c: AbstractControl): ValidationErrors | null => {
        if (c.value === '' || c.value == null) return null;

        const value = validation.parseNumber(c.value, options, language);
        if (value != null) {
            if (value < minValue) {
                return { minValue: true };
            } else if (value > maxValue) {
                return { maxValue: true };
            }
            return null; // The number is valid.
        } else {
            return { format: true };
        }
    };
    return validator;
}

@Directive({
    selector: '[l10nValidateNumber][ngModel],[l10nValidateNumber][formControl],[l10nValidateNumber][formControlName]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => L10nValidateNumberDirective), multi: true }
    ]
})
export class L10nValidateNumberDirective implements Validator, OnInit, OnChanges {

    @Input() set l10nValidateNumber(options: L10nNumberFormatOptions) {
        this.options = options;
    }

    @Input() public options?: L10nNumberFormatOptions;

    @Input() public minValue?: number;
    @Input() public maxValue?: number;

    @Input() public language?: string;

    protected validator?: ValidatorFn;

    constructor(protected validation: L10nValidation) { }

    public ngOnInit() {
        this.validator = l10nValidateNumber(this.validation, this.options, this.minValue, this.maxValue, this.language);
    }

    public ngOnChanges() {
        this.validator = l10nValidateNumber(this.validation, this.options, this.minValue, this.maxValue, this.language);
    }

    public validate(c: AbstractControl): ValidationErrors | null {
        return this.validator ? this.validator(c) : null;
    }

}
