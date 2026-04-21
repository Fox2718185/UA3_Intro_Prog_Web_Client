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
    while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
}

    incidents.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
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

        // Details
        const lienDetails = document.createElement("a");
        lienDetails.href = "#";
        lienDetails.innerText = "Details";
        lienDetails.addEventListener("click", () => ouvrirDetails(incident.id));

        // separateur
        const sep1 = document.createTextNode(" | ");

        // Modifier
        const lienModifier = document.createElement("a");
        lienModifier.href = "#";
        lienModifier.innerText = "Modifier";
        lienModifier.addEventListener("click", () => ouvrirModifier(incident.id));

        // separateur
        const sep2 = document.createTextNode(" | ");

        // Supprimer
        const lienSupprimer = document.createElement("a");
        lienSupprimer.href = "#";
        lienSupprimer.innerText = "Supprimer";
        lienSupprimer.addEventListener("click", () => ouvrirSupprimer(incident.id));

        // append
        tdActions.appendChild(lienDetails);
        tdActions.appendChild(sep1);
        tdActions.appendChild(lienModifier);
        tdActions.appendChild(sep2);
        tdActions.appendChild(lienSupprimer);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
    });

    compteur.innerText = incidents.length + " incident(s) au total";
    const msgVide = document.getElementById("msg-vide");

    if (incidents.length === 0) {
        msgVide.classList.remove("d-none");
    } else {
        msgVide.classList.add("d-none");
    }
    
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
        let maxId = 0;
        incidents.forEach(i => {
            if (i.id > maxId) maxId = i.id;
        });
        const nouvelId = maxId + 1;
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
    const span = document.createElement("span");

    span.classList.add("badge", "rounded-pill");

    const map = {
        "Mineur":   "background-color: #ffc107; color: black;",
        "Majeur":   "background-color: orange; color: black;",
        "Critique": "background-color: #dc3545; color: black;"
    };

    span.style = map[gravite] || "background-color: grey;";
    span.style.padding = "6px 12px";
    span.style.fontSize = "0.85rem";

    span.innerText = gravite;

    return span;
}

function badgeStatut(statut)
{
    const span = document.createElement("span");

    span.classList.add("badge", "rounded-pill");

    const map = {
        "Ouvert":   "background-color: #198754; color: black;",
        "En cours": "background-color: #0d6efd; color: black;",
        "Résolu":   "background-color: #4fff46; color: black;"
    };

    span.style = map[statut] || "background-color: grey;";
    span.style.padding = "6px 12px";
    span.style.fontSize = "0.85rem";

    span.innerText = statut;

    return span;
}

function ouvrirDetails(id)
{
    const incident = incidents.find(i => i.id === id);

    document.getElementById("modal-details-titre").innerText = `Détails — Incident #${incident.id}`;
    document.getElementById("details-id").innerText = incident.id;
    document.getElementById("details-titre").innerText = incident.titre;
    document.getElementById("details-description").innerText = incident.description || "—";
    const graviteEl = document.getElementById("details-gravite");
    graviteEl.innerText = "";
    graviteEl.appendChild(badgeGravite(incident.gravite));

    const statutEl = document.getElementById("details-statut");
    statutEl.innerText = "";
    statutEl.appendChild(badgeStatut(incident.statut));
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

// Ouvrir modifier modal
const modalModifierEl = document.getElementById("modal-modifier");
const modalModifier = new bootstrap.Modal(modalModifierEl);

function ouvrirModifier(id)
{
    const incident = incidents.find(i => i.id === id);

    document.getElementById("modal-modifier-titre").innerText = `Modifier l'incident #${incident.id}`;

    document.getElementById("modifier-id").value = incident.id;
    document.getElementById("modifier-titre").value = incident.titre;
    document.getElementById("modifier-description").value = incident.description;
    document.getElementById("modifier-gravite").value = incident.gravite;
    document.getElementById("modifier-statut").value = incident.statut;

    modalModifier.show();
}

// enregistrer les modifications
const btnEnregistrerModifier = document.getElementById("btn-enregistrer-modifier");

btnEnregistrerModifier.addEventListener("click", () =>
{
    const id = parseInt(document.getElementById("modifier-id").value);
    const titre = document.getElementById("modifier-titre").value.trim();
    const description = document.getElementById("modifier-description").value.trim();
    const gravite = document.getElementById("modifier-gravite").value;
    const statut = document.getElementById("modifier-statut").value;

    const erreur = document.getElementById("erreur-modifier");

    // validation
    if (titre.length < 3 || gravite === "" || statut === "")
    {
        erreur.innerText = "Veuillez remplir tous les champs obligatoires";
        erreur.classList.remove("d-none");
        return;
    }

    erreur.classList.add("d-none");

    // trouver l'incident
    const incident = incidents.find(i => i.id === id);

    // modifier les valeurs (PAS la date)
    incident.titre = titre;
    incident.description = description;
    incident.gravite = gravite;
    incident.statut = statut;

    // rafraichir
    rafraichirListe();

    // fermer modal
    modalModifier.hide();
});