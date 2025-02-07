import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { User } from 'src/app/home-rnf/models/user.model';
import { AppConfig } from 'src/conf/app.config';
import { AuthService } from '../../services/auth-service.service';
import { SearchItem, SearchService } from '../../services/search.service';

@Component({
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.scss']
})
export class NavHomeComponent implements OnInit {

  constructor(
    public _authService: AuthService,
    private router: Router,
    private searchService: SearchService
  ) { }

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

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/';
    });

    // Récupération des items de recherche depuis le backend,
    // en passant l'URL de l'API définie dans AppConfig.
    this.searchService.getSearchItems(AppConfig.SEARCH_ITEMS_ROUTE).subscribe((items: SearchItem[]) => {
      this.searchItems = items;
      // Initialisation de l'autocomplete dès que la liste est disponible
      this.filteredSearchItems = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.name),
        map(name => name ? this._filter(name) : this.searchItems.slice())
      );
    });
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

  public get signedIn(): boolean {
    return this._authService.authenticated || false;
  }

  public get user(): null | User {
    return this._authService.getCurrentUser();
  }

  onSearch(searchTerm: string): void {
    if (searchTerm && searchTerm.trim()) {
      console.log("Recherche lancée pour :", searchTerm);
      // Exemple : rediriger vers une page de résultats en passant le terme recherché dans les queryParams
      this.router.navigate(['/search'], { queryParams: { q: searchTerm } });
    }
  }

}
