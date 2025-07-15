# home-rnf
Module de base pour les plateformes RNF, basé sur l'authentification sur UsersHub

Procédure nouveau projet RNF
----------------------------

Si l'appli dispose également d'un backend, initialiser le git global aux deux dossiers back et front

1. S'assurer d'être bien dans la version 19 d'angular :
    sudo npm uninstall -g @angular/cli
	  sudo npm i -g @angular/cli@19

Si c'est toujours dans une autre version que 19, c'est peut être que le cli est installé en local, dans ce cas enlever le -g (pour global). 

2. Créer le nouveau projet :
	  ng new nomduprojet

3. Choisir scss puis N

4. Se placer à la racine du nouveau projet (ex: cd nomduprojet)

5. Importer le sous-module git :
	git submodule add git@github.com:RNF-SI/home-rnf.git src/app/home-rnf

6. Aller à la racine de home-rnf : cd src/app/home-rnf

7. Basculer sur la branche angular-19 : git checkout angular-19

8. Copier le répertoire assets de home-rnf/install-files vers src de votre projet

9. Copier le répertoire environments de home-rnf/install-files vers src de votre projet

10. Copier le répertoire conf de home-rnf/install-files vers src de votre projet

11. Copier le répertoire styles de home-rnf/install-files vers src de votre projet

12. Copier le répertoire pipes de home-rnf/install-files vers src/app de votre projet

13. Modifier les champs appName, appTitle, appSubTitle, contact du fichier app.config.ts situé dans conf

14. Adapter le fichier app-route.ts aux besoins :
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

15. Dans main.ts de votre projet, remplacer ce qui existe par :
    import { bootstrapApplication } from '@angular/platform-browser';
    import { AppComponent } from './app/app.component';
    import { provideHomeRnf } from './app/home-rnf/home-rnf.module';

    bootstrapApplication(AppComponent, {
      providers: [
        ...provideHomeRnf()
      ]
    });

16. Compléter le fichier angular.json du projet (projects>architects>build>options) :
    "stylePreprocessorOptions": {
                "includePaths": [
                  "node_modules",
                  "src",
                  "."
                ]
              },

Puis dans projects>architects>build>configurations>production, remplacer le contenu de budgets par ces valeurs :
    "budgets": [
                  {
                    "type": "initial",
                    "maximumWarning": "20mb",
                    "maximumError": "50mb"
                  },
                  {
                    "type": "anyComponentStyle",
                    "maximumWarning": "200kB",
                    "maximumError": "500kB"
                  }
    ],

17. Toujours dans le fichier angular, remplacer :
    "assets": [
      {
        "glob": "**/*",
        "input": "public"
      }
    ]

par : 

    "assets": [
      "src/favicon.ico",
      "src/assets"
    ]

18. Compléter le fichier tsconfig.json du projet. Dans complierOptions, ajouter la ligne :
    "baseUrl": "./",

19. Dans packaage.json, remplacez les dependencies par celles-ci :

    "dependencies": {
      "@angular/animations": "^19.2.14",
      "@angular/cdk": "^19.2.19",
      "@angular/common": "^19.2.0",
      "@angular/compiler": "^19.2.0",
      "@angular/core": "^19.2.0",
      "@angular/forms": "^19.2.0",
      "@angular/material": "^19.2.19",
      "@angular/platform-browser": "^19.2.0",
      "@angular/platform-browser-dynamic": "^19.2.0",
      "@angular/router": "^19.2.0",
      "@fortawesome/angular-fontawesome": "^1.0.0",
      "@fortawesome/fontawesome-svg-core": "^6.7.2",
      "@fortawesome/free-brands-svg-icons": "^6.7.2",
      "@fortawesome/free-regular-svg-icons": "^6.4.0",
      "@fortawesome/free-solid-svg-icons": "^6.4.0",
      "ngx-toaster": "^1.0.1",
      "ngx-toastr": "^19.0.0",
      "rxjs": "~7.8.0",
      "tslib": "^2.3.0",
      "zone.js": "~0.15.0"
    },

20. Se placer à la racine du projet et taper npm install

21. Remplacer le contenu du fichier app.component.html par :
	  "<router-outlet></router-outlet>"

22. Dans app.component.ts, ajouter HomeRnfModule dans les imports.

23. Remplacer le favicon :
    cp src/app/home-rnf/install_files/favicon.ico src/favicon.ico

24. Modifier le titre de l'application dans index.html

25. Remplacer le contenu du fichier styles.scss par :
    @use 'styles/custom-theme.scss' as custom;
    @use 'conf/custom.scss' as conf;
    @use '@angular/material' as mat;


    html, body { height: 100%; }
    body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }

    h2{
        margin-top:1% !important;
        margin-bottom:2%;
        font-size:30px !important;
        text-align: center;
        font-weight: bold;
    }

    h3{
        font-size: 24px !important;
        font-weight: bold !important;
        margin-top: 1%!important;
    }

    h4{
        font-size: 20px !important;
        font-weight: bold !important;
        margin-top: 1%!important;
    }

26. lancer l'app
	  ng serve