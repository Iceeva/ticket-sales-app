# Diagrammes d'architecture

## Diagramme d'architecture globale

┌─────────────────────────────────────────────────────────────┐
│ Client Browser │
│ React App │
└─────────────────────────┬───────────────────────────────────┘
│ HTTP/HTTPS
▼
┌─────────────────────────────────────────────────────────────┐
│ Backend Server (Node.js) │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Routes │ │ Controllers │ │ Middleware │ │
│ └──────┬──────┘ └──────┬──────┘ └─────────────┘ │
│ │ │ │
│ └─────────────────┘ │
│ │ │
│ ▼ │
│ ┌─────────────────────────────┐ │
│ │ Models │ │
│ └──────────────┬──────────────┘ │
└──────────────────┼──────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Fichiers JSON │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ users.json │ │ events.json │ │tickets.json │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────┘



## Diagramme de flux utilisateur

┌──────────┐
│ Accueil │
└────┬─────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ Navigation │
├───────────────┬─────────────────┬──────────────────────┤
│ ▼ │ ▼ │ ▼ │
│ Événements │ Connexion/ │ Panier │
│ │ Inscription │ │
└───────┬───────┴────────┬────────┴──────────┬───────────┘
│ │ │
▼ ▼ ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Détail │ │ Profil │ │ Validation │
│ événement │ │ utilisateur │ │ commande │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
│ │ │
▼ ▼ ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Réservation │ │ Historique │ │ Paiement │
│ tickets │ │ achats │ │ simulé │
└───────────────┘ └───────────────┘ └───────┬───────┘
│
▼
┌───────────────┐
│ Confirmation │
│ ticket │
└───────────────┘



## Diagramme logique des données

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Users │ │ Events │ │ Tickets │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ id (PK) │ │ id (PK) │ │ id (PK) │
│ email │ │ title │ │ userId (FK) │
│ password │ │ description │ │ eventId (FK) │
│ name │───────│ date │───────│ quantity │
│ role │ │ location │ │ totalPrice │
│ createdAt │ │ price │ │ status │
└─────────────────┘ │ totalTickets │ │ bookingDate │
│ availableTickets│ │ ticketCode │
│ category │ │ paymentStatus │
│ image │ └─────────────────┘
│ createdAt │
└─────────────────┘

Relations:

Un utilisateur peut avoir plusieurs tickets (1:N)

Un événement peut avoir plusieurs tickets (1:N)

Un ticket appartient à un utilisateur et un événement