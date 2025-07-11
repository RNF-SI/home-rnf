export const AppConfig = {
    "ID_APPLICATION_ANCRAGE":4,
    "ID_APPLICATION_GEONATURE":5,
    "API_ENDPOINT":"site de Geonature",
    "appName": "",
    "appTitle": "",
    "appSubTitle": "",
    "creditHeaderImage": "Etang du Moulin Neuf, Plounérin - © C. Le Gac",
    "SEARCH_INPUT": false,
    "SEARCH_ITEMS_ROUTE": "",
    "SEARCH_PREFIXE": "",
    "SEARCH_PLACEHOLDER": "",
    "menucompte": [
        {
            "texte": "Déconnexion",
            "classFa": "fas" as const,
            "nomFa": "right-from-bracket" as const,
            "lien": "logout"
        },
        {
            "texte":"Mes diagnostics",
            "classFa":"fas" as const,
            "nomFa":"chart-pie" as const,
            "lien":"mes-diagnostics"
        },
    ],
    "menu": [
        {
            "nom":"accueil", 
            "classFa":"fas" as const,
            "nomFa":"house" as const,
            "lien":""
        },{
            "nom":"méthodologie", 
            "classFa":"far" as const,
            "nomFa":"file-lines" as const,
            "lien":"methodologie"
        },
        {
            "nom":"diagnostics",
            "classFa":"fas" as const,
            "nomFa":"chart-pie" as const,
            "lien":"diagnostics-liste"
        },
        {
            "nom":"contacter", 
            "classFa":"far" as const,
            "nomFa":"address-book" as const,
            "lien":"contact"
        },
        {
            "nom":"mentions légales", 
            "classFa":"fas" as const,
            "nomFa":"file-signature" as const,
            "lien":"mentions"
        }
    ]
}