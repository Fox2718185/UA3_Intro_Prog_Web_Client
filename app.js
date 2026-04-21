// references au DOM
const compteur = document.getElementById("compteur");
const tbody = document.getElementById("tbody-incidents");

const incidents = [
    { id: 1, titre: "Panne imprimante", description: "Imprimante réseau hors service",
      gravite: "Mineur", statut: "Ouvert", dateCreation: "2025-09-18T02:34:29" },

    { id: 2, titre: "Incident sécurité", description: "Tentative d'accès non autorisé",
      gravite: "Majeur", statut: "En cours", dateCreation: "2025-09-18T08:15:00" },

    { id: 3, titre: "Rupture service", description: "API de paiement indisponible",
      gravite: "Critique", statut: "Ouvert", dateCreation: "2025-09-17T14:22:10" }
];

// affichage de la liste
function rafraichirListe() 
{
    tbody.innerText = "";

    incidents.forEach(incident => 
    {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.innerText = incident.id;
        tr.appendChild(tdId);

        const tdTitre = document.createElement("td");
        tdTitre.innerText = incident.titre;
        tr.appendChild(tdTitre);

        const tdGravite = document.createElement("td");
        tdGravite.innerText = incident.gravite;
        tr.appendChild(tdGravite);

        const tdStatut = document.createElement("td");
        tdStatut.innerText = incident.statut;
        tr.appendChild(tdStatut);

        const tdDate = document.createElement("td");
        tdDate.innerText = incident.dateCreation.substring(0, 10);
        tr.appendChild(tdDate);

        const tdActions = document.createElement("td");
        tdActions.innerHTML = `
            <a href='#' onclick="ouvrirDetails(${incident.id})">Details</a> | 
            <a href='#' onclick="ouvrirModifier(${incident.id})">Modifier</a> |
            <a href='#' onclick="ouvrirSupprimer(${incident.id})">Supprimer</a>`;

        tr.appendChild(tdActions);
        tbody.appendChild(tr);
    });

    compteur.innerText = incidents.length + " incident(s) au total";
    
}

rafraichirListe();

// ouvrir creation de modal
const btnOuvrirCreation = document.getElementById("btn-creer");
const modalCreerEl = document.getElementById("modal-creer");
const modalCreer = new bootstrap.Modal(modalCreerEl);

btnOuvrirCreation.addEventListener("click", () => 
{
    modalCreer.show();
});

// enregistrer un incident
const btnEnregistrerCreer = document.getElementById("btn-enregistrer-creer");

btnEnregistrerCreer.addEventListener("click", () => 
{
    
    const titre = document.getElementById("creer-titre").value.trim();
    const description = document.getElementById("creer-description").value.trim();
    const gravite = document.getElementById("creer-gravite").value;
    const statut = document.getElementById("creer-statut").value;

    const erreur = document.getElementById("erreur-creer");

    // validation
    if (titre.length < 3 || gravite === "" || statut === "") 
    {
        erreur.textContent = "Veuillez remplir tout les champs obligatoires";
        erreur.classList.remove("d-none");
        return;
    }

    erreur.classList.add("d-none");

    // generer un nouvel id
    let nouvelId;
    if (incidents.length === 0) 
    {
        nouvelId = 1;
    }
    else
    {
        const dernier = incidents[incidents.length - 1];
        nouvelId = dernier.id +1;
    }

    // construire l'object incident
    const nouvelIncident = 
    {
        id: nouvelId,
        titre,
        description,
        gravite,
        statut,
        dateCreation: new Date().toISOString()
    };

    // ajouter au tableau
    incidents.push(nouvelIncident);

    // rafraichir l'affichage
    rafraichirListe();

    // fermer le modal
    modalCreer.hide();

    // reinitialiser le formulaire
    document.getElementById("form-creer").reset();
});

// ouvrir details modal
const modalDetailsEl = document.getElementById("modal-details");
const modalDetails = new bootstrap.Modal(modalDetailsEl);

function badgeGravite(gravite)
{
    const map = {
        "Mineur":   "background-color: #ffc107; color: black;",
        "Majeur":   "background-color: orange;  color: black;",
        "Critique": "background-color: #dc3545; color: black;"
    };
    return `<span class="badge rounded-pill" 
                  style="${map[gravite] || 'background-color: grey;'} padding: 6px 12px; font-size: 0.85rem;">
                ${gravite}
            </span>`;
}

function badgeStatut(statut)
{
    const map = {
        "Ouvert":   "background-color: #198754; color: black;",
        "En cours": "background-color: #0d6efd; color: black;",
        "Résolu":   "background-color: #4fff46; color: black;"
    };
    return `<span class="badge rounded-pill"
                  style="${map[statut] || 'background-color: grey;'} padding: 6px 12px; font-size: 0.85rem;">
                ${statut}
            </span>`;
}

function ouvrirDetails(id)
{
    const incident = incidents.find(i => i.id === id);

    document.getElementById("modal-details-titre").innerText = `Détails — Incident #${incident.id}`;
    document.getElementById("details-id").innerText = incident.id;
    document.getElementById("details-titre").innerText = incident.titre;
    document.getElementById("details-description").innerText = incident.description || "—";
    document.getElementById("details-gravite").innerHTML = badgeGravite(incident.gravite);
    document.getElementById("details-statut").innerHTML = badgeStatut(incident.statut);
    document.getElementById("details-date").innerText = incident.dateCreation.replace("T", " ");

    modalDetails.show();
}

// ouvrir supprimer modal
const modalSupprimerEl = document.getElementById("modal-supprimer");
const modalSupprimer = new bootstrap.Modal(modalSupprimerEl);

function ouvrirSupprimer(id)
{
    const incident = incidents.find(i => i.id === id);

    document.getElementById("supprimer-id").value = incident.id;
    document.getElementById("supprimer-nom").innerText = `« ${incident.titre} »`;

    modalSupprimer.show();
}

// confirmer la suppression
const btnConfirmerSupprimer = document.getElementById("btn-confirmer-supprimer");

btnConfirmerSupprimer.addEventListener("click", () =>
{
    const id = parseInt(document.getElementById("supprimer-id").value);

    const index = incidents.findIndex(i => i.id === id);
    incidents.splice(index, 1);

    rafraichirListe();
    modalSupprimer.hide();
});