import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/home-rnf/models/user.model';
import { AdminGuardService } from '../../services/admin-guard.service';
import { AuthService } from '../../services/auth-service.service';
import { NotificationBadgeService } from 'src/app/home-rnf/services/notification-badge.service';
import { SearchItem, SearchService } from '../../services/search.service';
import { AppConfig, NavMenuItem } from 'src/conf/app.config';
import { MeResponse } from 'src/app/services/api.service';

@Component({
  standalone: false,
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.scss']
})
export class NavHomeComponent implements OnInit, OnDestroy {

  constructor(
    public _authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private notificationBadge: NotificationBadgeService,
    private adminGuard: AdminGuardService,
    private cdr: ChangeDetectorRef,
  ) { }

  title = AppConfig.appTitle;
  subtitle = AppConfig.appSubTitle;
  credit = AppConfig.creditHeaderImage;
  menucompte = AppConfig.menucompte;
  unreadCount = 0;
  showNotifications = AppConfig.features?.notifications !== false;
  menuItems: NavMenuItem[] = AppConfig.menu;
  isHomePage = false;
  displayFooter = (AppConfig as { displayFooter?: boolean }).displayFooter ?? true;

  searchControl = new FormControl();
  searchItems: SearchItem[] = [];
  filteredSearchItems!: Observable<SearchItem[]>;
  searchInput = (AppConfig as { SEARCH_INPUT?: boolean }).SEARCH_INPUT;
  placeholder = (AppConfig as { SEARCH_PLACEHOLDER?: string }).SEARCH_PLACEHOLDER;

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isHomePage = this.router.url === '/';
      });

    if (this.searchInput) {
      this.searchService.getSearchItems((AppConfig as { SEARCH_ITEMS_ROUTE?: string }).SEARCH_ITEMS_ROUTE || '').subscribe((items: SearchItem[]) => {
        this.searchItems = items;
        this.filteredSearchItems = this.searchControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.name),
          map(name => name ? this._filter(name) : this.searchItems.slice())
        );
      });
    }

    this.notificationBadge.getUnreadCount$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count) => {
        this.unreadCount = count;
        this.cdr.markForCheck();
      });
    this._authService.restoreSession().subscribe(() => this.onSessionReady());
  }

  private onSessionReady(): void {
    if (!this.signedIn) {
      this.notificationBadge.stopPolling();
      this.notificationBadge.setUnreadCount(0);
      this.menuItems = this.filterMenuItems(null);
      this.cdr.markForCheck();
      return;
    }
    const finish = () => {
      this.notificationBadge.refreshUnreadCount();
      this.notificationBadge.startPolling();
      this.refreshMenuItems();
      this.cdr.markForCheck();
    };
    if (this._authService.getCurrentUser()) {
      finish();
    } else {
      this._authService.refreshMeFromApi().subscribe({ next: finish, error: finish });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _filter(name: string): SearchItem[] {
    const filterValue = this.removeAccents(name.toLowerCase());
    return this.searchItems.filter(item =>
      this.removeAccents(item.nom.toLowerCase()).includes(filterValue)
    );
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  displayFn(item: SearchItem): string {
    return item && item.nom ? item.nom : '';
  }

  onSearchItemSelected(event: { option: { value: SearchItem } }): void {
    const item: SearchItem = event.option.value;
    if (item && item.slug) {
      this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
        this.router.navigate([(AppConfig as { SEARCH_PREFIXE?: string }).SEARCH_PREFIXE, item.slug]);
        this.searchControl.setValue('');
      });
    }
  }

  public get signedIn(): boolean {
    return this._authService.authenticated || false;
  }

  public get user(): null | User {
    return this._authService.getCurrentUser();
  }

  private refreshMenuItems(): void {
    this.menuItems = this.filterMenuItems(this._authService.getMeSnapshot());
    this._authService.refreshMeFromApi().subscribe({
      next: (me) => {
        this.menuItems = this.filterMenuItems(me);
        this.cdr.markForCheck();
      },
      error: () => {
        this.menuItems = this.filterMenuItems(this._authService.getMeSnapshot());
        this.cdr.markForCheck();
      },
    });
  }

  private filterMenuItems(me: MeResponse | null): NavMenuItem[] {
    const adminLink = AppConfig.security?.adminMenuLink || 'admin';
    const hideAdminMenu = AppConfig.security?.hideAdminMenuForNonAdmins !== false;
    return AppConfig.menu.filter((item) => {
      if (!hideAdminMenu || item.lien !== adminLink) {
        return true;
      }
      if (!this.signedIn) {
        return false;
      }
      return this.adminGuard.canAccessAdmin(me);
    });
  }

}
