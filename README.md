# home-rnf
Module de base pour les plateformes RNF, basé sur l'authentification sur UsersHub

Procédure nouveau projet RNF
----------------------------

Si l'appli dispose également d'un backend, initialiser le git global aux deux dossiers back et front

1. S'assurer d'être bien dans la version 15 d'angular :
	npm uninstall -g @angular/cli
	npm cache clean
	npm cache verify
	npm i -g @angular/cli@15

Si c'est toujours dans une autre version que 15, c'est peut être que le cli est installé en local, dans ce cas enlever le -g (pour global). 

2. Créer le nouveau projet :
	ng new nomduprojet

3. Importer le sous-module git :
	git submodule add https://github.com/RNF-SI/home-rnf.git nomduprojet/src/app/home-rnf

4. Copier les fichiers de config nécessaires :
	cp -r src/app/home-rnf/install_files/assets/* src/assets/
	cp -r src/app/home-rnf/install_files/conf src/conf

    Modifier le fichier conf/app.config.ts selon les besoins

5. Lier le fichier custom scss dans styles.scss :
	@import 'conf/custom.scss';

6. Adapter le fichier app-routing.module.ts aux besoins :
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

7. ajouter HomeRnfModule dans les imports de app.module.ts

8. copier les dependancies du fichier packages.json du sous module vers le package.json du module principal

9. installer les librairies nécessaires à la racine du projet
	npm i

10. Ajouter les lignes d'appel bootstrap dans angular.json :
	"styles": [
	      "@angular/material/prebuilt-themes/deeppurple-amber.css",
              "node_modules/bootstrap/scss/bootstrap.scss",
              "src/styles.scss"
            ],
            "scripts": [
              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]

11. Remplacer le contenu du fichier app.component.html par :
	<router-outlet></router-outlet>

12. Remplacer le favicon :
    cp src/app/home-rnf/install_files/favicon.ico src/favicon.ico

13. Modifier le titre de l'application dans index.html

14. lancer l'app
	npm start	