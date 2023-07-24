export class User {
    id_role: string;
    id_organisme: number;
    prenom_role: string;
    nom_role: string;
    identifiant: string;

    constructor(id_role:string,id_organisme: number,prenom_role: string,nom_role: string,identifiant: string) {
        this.id_role = id_role;
        this.id_organisme = id_organisme;
        this.prenom_role = prenom_role;
        this.nom_role = nom_role;
        this.identifiant = identifiant;
    }
}
