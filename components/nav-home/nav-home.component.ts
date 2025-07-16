import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';

import { AuthService } from '../../services/auth-service.service';
import { SearchItem, SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppConfig } from 'src/conf/app.config';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SearchBarDialogComponent } from '../search-bar-dialog/search-bar-dialog.component';

@Component({
    selector: 'app-nav-home',
    templateUrl: './nav-home.component.html',
    styleUrls: ['./nav-home.component.scss'],
    imports:[CommonModule,FontAwesomeModule,RouterModule,MatMenuModule,MatFormFieldModule,ReactiveFormsModule,MatToolbarModule,MatInputModule,MatAutocompleteModule,MatOptionModule,MatIconModule,MatMenuModule]
})
export class NavHomeComponent implements OnInit {

  private _authService = inject(AuthService);
  private router = inject(Router);
  private searchService = inject(SearchService);
  private dialog = inject(MatDialog);


  // Paramètres provenant d'AppConfig pour la navbar
  title = AppConfig.appTitle;
  subtitle = AppConfig.appSubTitle;
  credit = AppConfig.creditHeaderImage;
  menu = AppConfig.menu;
  menucompte = AppConfig.menucompte
  isHomePage: boolean = false;

  // Pour l'autocomplete de recherche
  searchControl = new FormControl();
  searchItems: SearchItem[] = []; // Items récupérés depuis le backend
  filteredSearchItems!: Observable<SearchItem[]>;
  searchInput = AppConfig.SEARCH_INPUT;
  placeholder = AppConfig.SEARCH_PLACEHOLDER;
  isMobile = false;



  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/';
    });

    // Récupération des items de recherche depuis le backend,
    // en passant l'URL de l'API définie dans AppConfig.
    if (this.searchInput) {
      this.searchService.getSearchItems(AppConfig.SEARCH_ITEMS_ROUTE).subscribe((items: SearchItem[]) => {
        this.searchItems = items;
        // Initialisation de l'autocomplete dès que la liste est disponible
        this.filteredSearchItems = this.searchControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.name),
          map(name => name ? this._filter(name) : this.searchItems.slice())
        );
      });
      this.checkScreenSize();
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 470;
  }
  // Filtrage des items en fonction de la saisie utilisateur (non sensible à la casse)
  private _filter(name: string): SearchItem[] {
    const filterValue = this.removeAccents(name.toLowerCase());
    return this.searchItems.filter(item =>
      this.removeAccents(item.nom.toLowerCase()).includes(filterValue)
    );
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Fonction pour afficher le nom de l'item sélectionné dans l'input
  displayFn(item: SearchItem): string {
    return item && item.nom ? item.nom : '';
  }

  // Lorsqu'un item est sélectionné dans l'autocomplete, naviguer vers la route associée
  onSearchItemSelected(event: any): void {
    const item: SearchItem = event.option.value;
    if (item && item.slug) {

      // Force la navigation en passant par une URL temporaire
      this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
        this.router.navigate([AppConfig.SEARCH_PREFIXE, item.slug]);
        this.searchControl.setValue('');
      });
    }
  }

  toggleSearchBar(){
    this.dialog.open(SearchBarDialogComponent, {
      width: '100%',
      maxWidth: '90vw'
    });
  }

  public get signedIn(): boolean {
    return this._authService.authenticated || false;
  }

  public get user(): null | User {
    return this._authService.getCurrentUser();
  }

}
