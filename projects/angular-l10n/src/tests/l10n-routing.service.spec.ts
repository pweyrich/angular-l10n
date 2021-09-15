import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';

import { Component, Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location } from '@angular/common';

import { L10nLoader, L10nTranslationService, L10nConfig, L10nTranslationModule, L10nRoutingModule, L10nUserLanguage } from '../public-api';

@Component({
    template: ``
})
class MockComponent { }

@Injectable() export class UserLanguage implements L10nUserLanguage {

    public get(): Promise<string | null> {
        return Promise.resolve(null);
    }

}

describe('L10nRoutingService', () => {
    const mockAsset = {
        'en-US': {
            title: 'Angular localization',
        },
        'it-IT': {
            title: 'Localizzazione in Angular'
        }
    };
    const routes: Route[] = [
        { path: '', redirectTo: 'mock1', pathMatch: 'full' },
        { path: 'mock1', component: MockComponent },
        { path: 'mock2', component: MockComponent },
        { path: '**', redirectTo: 'mock1' }
    ];
    const rootRoutes: Route[] = [
        { path: '', component: MockComponent },
        { path: 'mock2', component: MockComponent },
        { path: '**', redirectTo: '' }
    ];
    describe('Navigation', () => {
        let fixture: ComponentFixture<MockComponent>;
        let loader: L10nLoader;
        let translation: L10nTranslationService;
        let router: Router;
        let location: Location;
        let spyLocation: SpyLocation;
        const config: L10nConfig = {
            format: 'language-region',
            providers: [
                { name: 'asset', asset: mockAsset }
            ],
            keySeparator: '.',
            defaultLocale: { language: 'en-US', currency: 'USD' },
            schema: [
                { locale: { language: 'en-US', currency: 'USD' } },
                { locale: { language: 'it-IT', currency: 'EUR' } },
            ]
        };
        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    RouterTestingModule.withRoutes(routes),
                    L10nTranslationModule.forRoot(config, {
                        userLanguage: UserLanguage
                    }),
                    L10nRoutingModule.forRoot()
                ]
            }).createComponent(MockComponent);
            loader = TestBed.inject(L10nLoader);
            translation = TestBed.inject(L10nTranslationService);
            router = TestBed.inject(Router);
            location = TestBed.inject(Location);
        });
        it('should replace url when the app starts', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.initialNavigation();
                tick();
                expect(location.path()).toBe('/en-US/mock1');
            });
        }));
        it('should replace url when navigation ends', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigate(['/mock2']);
                tick();
                expect(location.path()).toBe('/en-US/mock2');
            });
        }));
        it('should replace url when language changes', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigate(['/mock1']);
                tick();
                translation.setLocale({ language: 'it-IT' });
                tick();
                expect(location.path()).toBe('/it-IT/mock1');
            });
        }));
        it('should keep localized url when goes back', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigate(['/mock1']);
                tick();
                router.navigate(['/mock2']);
                tick();
                location.back();
                expect(location.path()).toBe('/en-US/mock1');
            });
        }));
        it('should go back using localized link', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigate(['/en-US/mock1']);
                tick();
                router.navigate(['/en-US/mock2']);
                tick();
                location.back();
                expect(location.path()).toBe('/en-US/mock1');
            });
        }));
        it('should keep url with query params', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigateByUrl('/mock1?id=1');
                tick();
                expect(location.path()).toBe('/en-US/mock1?id=1');
            });
        }));
        it('should redirect wildcard route', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigate(['/wildcard']);
                tick();
                expect(location.path()).toBe('/en-US/mock1');
            });
        }));
        it('should use schema values when app starts', fakeAsync(() => {
            spyLocation = location as SpyLocation;
            spyLocation.setInitialPath('/it-IT/mock1');
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.initialNavigation();
                tick();
                expect(translation.getLocale()).toEqual(jasmine.objectContaining({
                    language: 'it-IT', currency: 'EUR'
                }));
            });
        }));
    });
    describe('defaultRouting', () => {
        let fixture: ComponentFixture<MockComponent>;
        let loader: L10nLoader;
        let translation: L10nTranslationService;
        let router: Router;
        let location: Location;
        const config: L10nConfig = {
            format: 'language-region',
            defaultLocale: { language: 'en-US', currency: 'USD' },
            providers: [],
            keySeparator: '.',
            schema: [
                { locale: { language: 'en-US', currency: 'USD' } },
                { locale: { language: 'it-IT', currency: 'EUR' } },
            ],
            defaultRouting: true
        };
        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    RouterTestingModule.withRoutes(routes),
                    L10nTranslationModule.forRoot(config, {
                        userLanguage: UserLanguage
                    }),
                    L10nRoutingModule.forRoot()
                ]
            }).createComponent(MockComponent);
            loader = TestBed.inject(L10nLoader);
            translation = TestBed.inject(L10nTranslationService);
            router = TestBed.inject(Router);
            location = TestBed.inject(Location);
        });
        it('should not replace url when the app starts', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.initialNavigation();
                tick();
                expect(location.path()).toBe('/mock1');
            });
        }));
        it('should not replace url when navigation ends', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigate(['/mock2']);
                tick();
                expect(location.path()).toBe('/mock2');
            });
        }));
        it('should replace url when language changes', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigate(['/mock1']);
                tick();
                translation.setLocale({ language: 'it-IT' });
                tick();
                expect(location.path()).toBe('/it-IT/mock1');
            });
        }));
        it('should remove language from default routing', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigate(['/mock1']);
                tick();
                translation.setLocale({ language: 'it-IT' });
                tick();
                translation.setLocale({ language: 'en-US' });
                tick();
                expect(location.path()).toBe('/mock1');
            });
        }));
    });
    describe('root', () => {
        let fixture: ComponentFixture<MockComponent>;
        let loader: L10nLoader;
        let translation: L10nTranslationService;
        let router: Router;
        let location: Location;
        const config: L10nConfig = {
            format: 'language-region',
            defaultLocale: { language: 'en-US', currency: 'USD' },
            providers: [],
            keySeparator: '.',
            schema: [
                { locale: { language: 'en-US', currency: 'USD' } },
                { locale: { language: 'it-IT', currency: 'EUR' } },
            ],
        };
        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    RouterTestingModule.withRoutes(rootRoutes),
                    L10nTranslationModule.forRoot(config, {
                        userLanguage: UserLanguage
                    }),
                    L10nRoutingModule.forRoot()
                ]
            }).createComponent(MockComponent);
            loader = TestBed.inject(L10nLoader);
            translation = TestBed.inject(L10nTranslationService);
            router = TestBed.inject(Router);
            location = TestBed.inject(Location);
        });
        it('should keep root path', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.initialNavigation();
                tick();
                expect(location.path()).toBe('/en-US');
            });
        }));
        it('should keep url with query params or fragment', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigateByUrl('?id=1');
                tick();
                expect(location.path()).toBe('/en-US?id=1');
                router.navigateByUrl('/?id=1');
                tick();
                expect(location.path()).toBe('/en-US?id=1');
                router.navigateByUrl('#1');
                tick();
                expect(location.path()).toBe('/en-US#1');
            });
        }));
        it('should keep url with query params when language changes', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.navigateByUrl('?id=1');
                tick();
                translation.setLocale({ language: 'it-IT' });
                tick();
                expect(location.path()).toBe('/it-IT?id=1');
            });
        }));
    });
});
