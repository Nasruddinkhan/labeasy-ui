import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';
import { ThemeModule } from './theme/theme.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Required for AOT compilation
export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemDataService } from './shared/in-mem/in-mem-data.service';
import { BASE_URL } from '@core/interceptors/base-url-interceptor';
import { environment } from '@env/environment';
import { httpInterceptorProviders } from '@core';
import { appInitializerProviders } from '@core/initializers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    ThemeModule,
    RoutesModule,
    SharedModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // Need to be change
    HttpClientInMemoryWebApiModule.forRoot(InMemDataService, {
      dataEncapsulation: false,
      passThruUnknownUrl: true,
    }),
  ],
  providers: [
    { provide: BASE_URL, useValue: environment.baseUrl },
    httpInterceptorProviders,
    appInitializerProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
