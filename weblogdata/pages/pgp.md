---
title: "Elektronisch briefgeheim: PGP"
layout: page
permalink: /edwin/pgp/index.html
eleventyExcludeFromCollections: true
description: PHP handleiding
---

```
From edwinjm@dds.hacktic.nl Wed Apr 13 00:18:11 1994
Received: from dds.hacktic.nl by xs4all.hacktic.nl with SMTP id AA10433
  (5.67b/IDA-1.5 for <ranx@hacktic.nl>); Wed, 13 Apr 1994 00:18:09 +0200
Received: by dds.hacktic.nl id AA07544
  (5.67a/IDA-1.5 for ranx@hacktic.nl); Wed, 13 Apr 1994 00:18:06 +0200
Date: Wed, 13 Apr 1994 00:18:06 +0200
From: Edwin Martin <edwinjm@dds.hacktic.nl>
Message-Id: <199404122218.AA07544@dds.hacktic.nl>
Subject: Elektronisch briefgeheim: PGP
Apparently-To: ranx@hacktic.nl
Status: R

XI - Elektronisch briefgeheim: PGP

U zult zich misschien afvragen in welke mate uw privacy gewaarborgd
is als u elektronische brieven stuurt en ontvangt. Nu zullen de
systeembeheerders over het algemeen andere interesses hebben dan
het lezen van uw post maar dat is geen reden om daar blind op te
vertrouwen. Zij kunnen bovendien uw post per ongeluk onder ogen
krijgen, bijvoorbeeld als er iets mis gaat met het hele systeem.
Bovendien bestaat elektronische post vaak uit een hele serie
schakels. Als u bijvoorbeeld post stuurt naar een e-mailadres in de
Verenigde Staten, passeert uw bericht vele systemen en systeembe-
heerders. En gaat mogelijk langs evenveel geheime diensten die het
telefoonverkeer en datacommunicatieverkeer (kunnen) volgen.
Datacommunicatieverkeer kan gewoon afgeluisterd worden.
Het versturen van e-mail is dan ook in zekere zin te vergelijken
met het versturen van briefkaarten. Als u een briefkaart op de post
doet, weet u nooit zeker of niet 
iemand anders de briefkaart leest. De postbode kan hem lezen, een
huisgenoot van de geadresseerde, een overheidsdienst enzovoorts.
Veel mensen stoppen hun brief daarom in een envelop. PGP is nu een
versleutelingsprogramma dat functioneert als een envelop voor
e-mail.

PGP staat voor Pretty Good Privacy. Het is een Amerikaans programma
geschreven door Philip Zimmerman dat teksten versluierd (vercrypt)
door middel van cryptografie. De teksten worden daardoor onleesbaar
voor iedereen behalve voor diegenen die de juiste sleutel bezit.
Alleen die persoon kan de crypto-tekst weer omzetten in leesbare
tekst (ontcrypten). PGP is over de hele wereld verspreid.
Cryptografie kunt u gebruiken voor alle e-mail waarvan u het
belangrijk vindt, om wat voor reden dan ook, dat alleen de
geadresseerde de post kan lezen. Er is dus niet een
systeembeheerder ergens op het netwerk, of een huisgenoot die
gebruik maakt van uw computer, die de envelop kan openen.
Ook PGP kan ongetwijfeld ooit ontcijferd worden, maar dit ligt
buiten het bereik van bijna iedereen, omdat PGP met het principe
van RSA werkt, een heel sterk versleutelingsalgoritme. Een computer
die PGP zal kunnen ontcijferen kost vele miljoenen en dan nog duurt
het erg lang voordat de sleutel gevonden is. Een geheime
overheidsdienst heeft het zo stukken moeilijker en kan niet meer
gewoon alle berichten scannen op woorden waaraan zij een negatieve
waarde toekennen. Vooral als iedereen voor alles PGP zou gebruiken
is het elektronisch briefgeheim zo goed als gegarandeerd.

Bijzondere van PGP
PGP is zo bijzonder omdat het de mogelijkheid biedt om de sleutel
via openbare kanalen te versturen. Berichten worden namelijk
gecrypt met een zogeheten 'public key' en ontcrypt met een 'secret
key'. Stel suske wil een geheim bericht via e-mail zenden aan
wiske. Hij typt dan de tekst, vercrypt deze tekst met de public key
van wiske en stuurt de tekst naar wiske. Suske had de public key
van wiske daarvoor al naar zijn computer gehaald. Nu is de tekst
vercrypt en kan alleen ontcrypt worden door de secret key van
wiske. Alleen wiske heeft die secret key, niemand anders. Iedereen
stelt dus haar/zijn public key beschikbaar aan iedereen (hoe?
daarover verderop meer) en houdt zijn secret key in haar/zijn eigen
computer. Zelfs al zou iemand die secret key stelen, dan nog heeft
diegene er niets aan, omdat de secret key met een wachtwoord
beveiligd is. Het bijzondere van PGP is dat je dus de sleutel
openbaar kan verspreiden, terwijl alleen de geadresseerde een tekst
van ontcrypten. Bij gewone cryptosystemen was dit altijd een
probleem, omdat daar de sleutel voor vercrypten dezelfde was als de
sleutel voor ontcrypten en er dus een veilige weg moest zijn om die
sleutel aan de geadresseerde te sturen (niet via e-mail dus, maar
bijvoorbeeld door de key persoonlijk te brengen).

PGP-stappen 
Hieronder staan de achtereenvolgende stappen om minimaal gebruik te
kunnen maken van PGP, daarna komen een aantal opties voor
gevorderden aan de orde. Eerst de noodzakelijke, algemene,
eenmalige stappen om het programma draaiende te krijgen en daarna
de stappen die suske moet doorlopen om een crypto-bericht aan wiske
te sturen.

Stap 1: Het programma PGP moet u ergens vandaan halen. In december
1993 was de meest recente versie 2.3. Ga altijd op zoek naar de
nieuwste uitgaven. De versies die beginnen met 2 zijn
non-compatible (doen het niet samen met) versies beginnend met een
1. PGP is te vinden op XS4ALL in de directory /pub/msdos/crypt. De
file heet pgp23A.zip. Kopieer deze file met het commando "cp" naar
uw home directory en haal de file dan met "sz pgp23A.zip" naar uw
eigen computer.

Stap 2: Kopieer de file naar een directory die u 'pgp' noemt.
Aangezien de file een .zip-extentie heeft, moet deze file ontzipt
worden. Dit wordt elders behandeld.

Stap 3: Pas uw autoexec.bat file aan door de volgende regels toe te
voegen:
     
     SET PGPPATH=C:\PGP
     SET PATH=C:\PGP;%PATH%
     SET TZ=MET-1DST
     
Start daarna uw computer opnieuw op.

Stap 4: Nu moet u een paar sleutels aanmaken. Dat doet u door
vanuit de directory PGP het commando
     
     pgp -kg
     
te geven. Kies daarna voor de veiligste optie, dat is optie 3.
Hierna wordt u gevraagd uw user i.d. te geven. Daaraan bent u voor
de buitenwereld te herkennen. Geef hier uw login-naam gevolgd door
uw e-mailadres en plaats het e-mailadres tussen <  >. 
Dus in het geval van suske is dat:
     
     suske  <suske@hacktic.nl>
     
Nu moet u een wachtwoord opgeven. Kies een wachtwoord niet te kort
(minstens 8 tekens) en gebruik zowel letters als cijfers. Schrijf
het wachtwoord nergens op, maar onthou het goed.
Hierna moet u een aantal willekeurige, niets steeds dezelfde
toetsen indrukken en dan maar wachten want het kan even duren
voordat uw sleutelpaar klaar is. Als het klaar is, heeft u in uw
PGP-directory er (o.a.) de files pubring.pgp en secring.pgp bij.
Dit worden sleutelhangers genoemd, keyrings in het Engels. De
keyring pubring.pgp bevat op dit moment slechts uw eigen public
key. De bedoeling is dat u aan deze keyring de public keys hangt
van alle mensen aan wie u ooit een crypto bericht wil schrijven. De
andere keyring, secring.pgp bevat uw secret key en die is beveiligd
met uw wachtwoord. U kunt de inhoud van de keyrings controleren met
het commando:

     
     pgp -kv keyring
     
In plaats van keyring typt u dan "pubring.pgp" of "secring.pgp".

stap 5: Nu moet u uw public key van de keyring halen om hem de
wereld in te zenden, zodat iedereen die u een crypto-bericht wil
sturen, er over kan beschikken. Dat doet u met het commando:

     pgp -kxa suske pubring.pgp

In plaats van suske vult u uiteraard uw eigen naam in. De letter a
levert een ASCII-tekst op, die geschikt is voor verzending via
e-mail In uw pgp directory staat nu de file pubring.asc.

stap 6: De file pubring.asc kunt u nu de 'wereld' insturen. Dat kan
op een aantal manieren.
Ten eerste kunt u mensen die erom vragen uw key per e-mail
opsturen.
Ten tweede kunt u de key op een daarvoor gereserveerd gebied op een
BBS (Bulletin Board System) plaatsen.
Ten derde kunt u de key op speciale key-servers plaatsen. Dat zijn
computers die keys uit de hele wereld verzamelen. Er zijn meer van
dit soort key-servers, maar u hoeft uw key slechts aan één zo'n
server te sturen. Deze server stuurt ze dan door aan de andere
servers. Het adres van één zo'n key-server is:

     pgp-public-keys@demon.co.uk 

Om uw sleutel toe te voegen moet u "add" (zonder de "") in de
subject-regel zetten en dan als brief uw public key verzenden (in
ASCII). Met "help" in de subject-regel krijgt u meer uitleg over
hoe de key-server werkt.
Ten vierde, en dat is waarschijnlijk de beste oplossing, kunt u uw
public key in uw .plan-file plaatsen. Daartoe verplaatst u eerst
het bestand 'pubring.asc' van uw computer naar uw home directory op
XS4ALL (of De Digitale Stad). Vervolgens geeft u de volgende
commando's:

     mv pubring.asc .plan 

(dit verplaatst het bestand naar uw .plan file). Dan geeft u:

     pico .plan 

Hierna komt uw key in beeld, u moet nu de ^M aan het eind van
iedere regel verwijderen, en daarna de nieuwe file saven met
"Ctrl-x". Uw kunt testen of dat allemaal gelukt is met:

     finger suske

In plaats van suske uiteraard weer uw eigen login-naam. Nu moet u
nog zorgen dat ook anderen uw .plan file kunnen lezen en daartoe
dus de juiste toegangsstatus hebben. Dat gaat het snelst met het
commando:

     chmod 644 .plan

Daarna maakt u ook uw home directory toegankelijk voor anderen:

     cd ..
     chmod 711 suske

Nu heeft u alle stappen doorlopen om een bericht te kunnen
ontvangen. Wat u met een ontvangen bericht moet doen, komt verderop
aan de orde. Eerst gaat suske een bericht aan wiske sturen. Dat
gaat als volgt:

Stap 1: suske heeft voor het versturen van een bericht de public
key van wiske nodig. Die kan hij dus op diverse plaatsen vinden,
afhankelijk van waar wiske haar sleutel heeft achtergelaten. Als
suske het commando:

     finger wiske

geeft en er verschijnt een public key blok, dan kan suske dat blok
als volgt downloaden:

     finger wiske > wiske.pub
     sz wiske.pub

Stap 2: De public key van wiske moet nu aan de public keyring van
suske worden gehangen. Dat gaat met het commando:

     pgp -ka wiske.pub

De file wiske.pub heeft suske nu niet meer nodig en kan verwijderd
worden.

Stap 3: Nu kan het bericht dat verstuurd moet worden, laten we het
'tekst.txt' noemen, vercrypt worden. Dat gaat als volgt:

     pgp -ea tekst.txt wiske

Hiermee wordt dus aangegeven voor wie de tekst is (dus de enige is,
die de tekst kan ontcijferen) en om welke tekst (tekst.txt) het
gaat. Het resultaat van deze actie is een bestand met de naam
'tekst.asc'. Deze tekst stuurt suske naar wiske via e-mail.
Wanneer wiske deze tekst heeft ontvangen, hoeft zij slechts het
commando:

     pgp tekst.asc

te geven. Het programma vraagt daarna om haar wachtwoord en als dat
goed is wordt 'tekst.asc' weer omgezet in een leesbare file genaamd
'tekst.txt'

Andere opties
Het commando "pgp -h" geeft een overzicht van de bestaande
commando's. Voor nog meer info zie de (engelstalige) .doc-files die
bij het programma geleverd worden en die ook in de directory pgp
staan. Een paar van deze commando's behandelen we hier.

U kunt naast het vercrypten van een tekst deze ook nog tekenen met
uw handtekening. Dan weet degene die de tekst ontvangt dat de tekst
van u afkomstig is. Suske doet dat voor tekst.txt als volgt:

     pgp -esa tekst.txt wiske

Als u alleen maar een stuk tekst voor uzelf wilt crypten, dan kunt
u ook het commando

     pgp -c tekst.tst

gebruiken. In plaats van test.tst dan de te crypten tekst. Het 
wachtwoord van crypten en ontcrypten is dan hetzelfde.

Bij het vercrypten kunt u ook de nog aanwezige leesbare tekst
meteen volledig vernietigen door het commando te geven:

     pgp -wea 

Met het commando

     pgp -ke 

kan suske aangeven in hoeverre hij de public key van wiske
vertrouwt. Hij moet dus zeker zijn dat hij de key van wiske heeft
en niet van iemand die doet alsof hij wiske is, om op die manier de
post voor wiske te kunnen onderscheppen en ontcijferen. Wilt u
kijken hoe het met deze zogenaamde "trust parameters staat" dan
kunt u het commando

     pgp -kc

geven.

Verder zijn er nog mogelijkheden om de tekst alleen op het scherm
te laten verschijnen en niet naar een ontcijferd bestand (veiliger)
en om elkaars keys over de telefoon met elkaar te controleren ("pgp
-kvc"). Er zijn nog meer opties, maar daarvoor moet u de .doc files
maar lezen.
```