import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { L10nDateTimeFormatOptions } from '../models/types';
import { L10nAsyncPipe } from '../models/l10n-async-pipe';
import { L10nIntlService } from '../services/l10n-intl.service';
import { L10nTranslationService } from '../services/l10n-translation.service';

@Pipe({
    name: 'l10nDate',
    pure: true
})
export class L10nDatePipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) { }

    public transform(value: any, language: string, options?: L10nDateTimeFormatOptions, timezone?: string): string | null {
        if (value == null || value === '') return null;

        return this.intl.formatDate(value, options, language, timezone);
    }

}

@Pipe({
    name: 'l10nDateAsync',
    pure: false
})
export class L10nDateAsyncPipe extends L10nAsyncPipe implements PipeTransform {

    constructor(
        protected override translation: L10nTranslationService,
        protected override cdr: ChangeDetectorRef,
        protected intl: L10nIntlService
    ) {
        super(translation, cdr);
    }

    public transform(value: any, options?: L10nDateTimeFormatOptions, language?: string, timezone?: string): string | null {
        if (value == null || value === '') return null;

        return this.intl.formatDate(value, options, language, timezone);
    }

}
