# home-rnf
Module de base pour les plateformes RNF, basé sur l'authentification sur UsersHub

Procédure nouveau projet RNF
----------------------------

Si l'appli dispose également d'un backend, initialiser le git global aux deux dossiers back et front

1. S'assurer d'être bien dans la version 19 d'angular :
	sudo npm uninstall -g @angular/cli
	sudo npm i -g @angular/cli@19

Si c'est toujours dans une autre version que 15, c'est peut être que le cli est installé en local, dans ce cas enlever le -g (pour global). 

2. Créer le nouveau projet :
	ng new nomduprojet

3. Choisir scss puis N

5. Se placer à la racine du nouveau projet (ex: cd nomduprojet)

6. Importer le sous-module git :
	git submodule add git@github.com:RNF-SI/home-rnf.git src/app/home-rnf

7. Aller à la racine de home-rnf : cd src/app/home-rnf

8. Basculer sur la branche angular-19 : git checkout angular-19

9. Créer le répertoire assets dans src de votre projet

10. Copier le répertoire fonts de home-rnf/fichiers-utiles et son contenu dans assets qui vient d'être créé

11. Copier le répertoire conf de home-rnf/fichiers-utiles et son contenu dans src de votre projet

12. Modifier les champs appName, appTitle, appSubTitle, contact du fichier app.config.ts situé dans conf

13. Adapter le fichier app-route.ts aux besoins :
const routes: Routes = [
  {
    path: '',
    component: NavHomeComponent,
    children: [
      {
        path: 'logout',
        // Ici seulement pour angular, mais toujour redirigé dans le canActivate
        component: LogoutComponent,
        canActivate: [ LogoutLinkService ]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [ LazyDialogLoader ]
      }
    ]
  }
];

14. ajouter HomeRnfModule dans les imports de app.component.ts

15. copier ces lignes dans les dependencies du fichier package.json de votre projet

  "@fortawesome/angular-fontawesome": "^1.0.0",
  "@fortawesome/fontawesome-svg-core": "^6.7.2",
  "@fortawesome/free-brands-svg-icons": "^6.7.2",
  "@fortawesome/free-regular-svg-icons": "^6.4.0",
  "@fortawesome/free-solid-svg-icons": "^6.4.0",

puis se placer à la racine de votre projet et taper npm install

16. Remplacer le contenu du fichier app.component.html par :
	<router-outlet></router-outlet>

17. Remplacer le favicon :
    cp src/app/home-rnf/install_files/favicon.ico src/favicon.ico

18. Modifier le titre de l'application dans index.html

19. Copier le répertoire styles dans src de votre projet


20. lancer l'app
	ng serve