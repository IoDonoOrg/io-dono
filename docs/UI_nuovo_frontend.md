### Dashboard Amministratore (`AdminDashboard`, `AdminStats`, `HoverUser`)

La Dashboard Amministratore è stata trasformata, ora l'area principale contiene una serie di 
grafici interattivi che illustrano il trend temporale delle donazioni, la suddivisione per 
categoria, lo stato delle segnalazioni e la distribuzione dei ruoli utente. 

Sotto l'area analitica sono stati inseriti tre tile cliccabili di accesso rapido per la gestione di  associazioni, segnalazioni e utenti. 

Un'interazione introdotta per gli admin è il  popover a comparsa: posizionando il cursore sul nome di un utente, appare un pannello da cui è possibile applicare o revocare un ban.

### Dashboard Associazione e Statistiche (`AssociationDashboard`, `AssociationStatistics`, 
`DateRangeField`)

Nella Dashboard Associazione, l'interfaccia si concentra ora su tre percorsi principali tramite 
pulsanti dedicati: lo storico donazioni, la mappa e le statistiche. 

L'area statistica si apre  in un modale e fornisce metriche di impatto come le donazioni ricevute, una stima dei rifiuti  ridotti e il numero di donatori univoci. 

I dati vengono visulizzati attraverso grafici che mostrano i donatori più attivi, i beni raccolti su base giornaliera e la loro ripartizione per tipologia. Il range dei giorni dei grafici può essere cambiato attraverso i campi "Da/A".

### Mappa e Gestione Donazioni (`DonationMapDialog`, `DonationBar`, `CompleteDonationDialog`)

La mappa utilizza ora dei marker colorati dinamicamente (verde, arancione, blu, rosso) per 
riflettere lo stato esatto di ciascuna donazione. 

La barra della singola donazione presenta un  nuovo menu contestuale a tendina che mostra in modo dinamico solo le azioni appropriate  (Visualizza, Accetta, Completa, Modifica, Segnala, Elimina) in base ai permessi dell'utente e  allo stato della transazione. 

Il flusso per completare una donazione è stato aggiornato con un modale dedicato in cui l'associazione può lasciare un feedback testuale e assegnare una valutazione tramite un componente interattivo a 10 cuori.

### Sistema di Segnalazioni (`HeaderBar`, `CreateReportDialog`, `ReportHistory`, `ReportView`, 
`CloseReportDialog`)

Il Sistema di Segnalazioni è stato integrato nel layout principale aggiungendo due nuove voci 
nel menu utente in alto a destra: una per aprire una segnalazione e una per consultare lo 
storico. 

La creazione avviene tramite un modale con un'area di testo espansa per descrivere il 
problema. 

Lo storico elenca le segnalazioni sotto forma di barre orizzontali, con indicatori 
colorati che ne comunicano immediatamente lo stato (Aperta/Chiusa) e il tipo.

Cliccando su una  segnalazione si accede a una vista di dettaglio con tutte le informazioni relative a creatore, utente segnalato e risoluzione, mentre gli admin dispongono di una finestra separata per inserire le note di chiusura del ticket.

### Moduli di Registrazione (`UserTypeDialog`, `CreateAssocDialog`)

Il modale iniziale mostrato agli utenti pubblici è stato ridotto a una singola scelta binaria: 
donatore "Privato" o "Commerciale". 

L'intera interfaccia e la logica per la registrazione delle associazioni sono state rimosse dal percorso pubblico e relegate in un modale esclusivo accessibile unicamente dalla dashboard amministrativa.
