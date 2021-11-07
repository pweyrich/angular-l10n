import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { L10nTranslationService } from './l10n-translation.service';

@Injectable({
    providedIn: 'root'
})
export class L10nResolver implements Resolve<Promise<void>> {

    constructor(private translation: L10nTranslationService) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
        this.translation.addProviders(route.data['l10nProviders']);
        await this.translation.init();
    }
}
