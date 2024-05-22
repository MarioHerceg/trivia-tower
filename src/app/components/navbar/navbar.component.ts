import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoutePath } from '../../app-routing.module';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';

enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly currentRoute_ = new BehaviorSubject<RoutePath>(RoutePath.HOME);
  currentRoute$ = this.currentRoute_.asObservable();

  RoutePath = RoutePath;
  AppTheme = AppTheme;

  routePaths = Object.values(RoutePath);

  appTheme = new FormControl<AppTheme>(AppTheme.LIGHT, { nonNullable: true });

  constructor(private router: Router) {
    console.log(this.routePaths);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentRoute_.next(val.url.split('/')[1] as RoutePath);
      }
    });
  }

  changeTheme(theme: AppTheme) {
    const themeToChange = theme === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT;
    this.appTheme.setValue(themeToChange);
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement | null;
    if (themeLink) {
      themeLink.href = `${themeToChange}.css`;
    }
  }
}
