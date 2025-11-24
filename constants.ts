import { GraphData, TimelineEvent } from './types';

// Embedded JSON data from the user request
export const INITIAL_DATA: GraphData = {
  nodes: [
    { id: "dmowski_roman", label: "Roman Dmowski", type: "person", dates: "1864-1939", description: "Założyciel i główny ideolog Endecji. Twórca Ligi Narodowej.", importance: 1.0 },
    { id: "poplawski_jan", label: "Jan Ludwik Popławski", type: "person", dates: "1854-1908", description: "Współzałożyciel Ligi Narodowej, twórca idei piastowskiej.", importance: 0.9 },
    { id: "balicki_zygmunt", label: "Zygmunt Balicki", type: "person", dates: "1858-1916", description: "Ideolog egoizmu narodowego, socjolog.", importance: 0.85 },
    { id: "grabski_wladyslaw", label: "Władysław Grabski", type: "person", dates: "1874-1938", description: "Ekonomista, Premier RP, twórca złotego.", importance: 0.75 },
    { id: "mosdorf_jan", label: "Jan Mosdorf", type: "person", dates: "1904-1943", description: "Przywódca Młodzieży Wszechpolskiej, zginął w Auschwitz.", importance: 0.65 },
    { id: "rybarski_roman", label: "Roman Rybarski", type: "person", dates: "1887-1942", description: "Główny ekonomista SN, zginął w Auschwitz.", importance: 0.7 },
    { id: "pilsudski_jozef", label: "Józef Piłsudski", type: "person", dates: "1867-1935", description: "Główny rywal polityczny obozu narodowego.", importance: 0.95 },
    { id: "liga_narodowa", label: "Liga Narodowa", type: "organization", dates: "1893-1928", description: "Tajna organizacja trójzaborowa kierująca ruchem.", importance: 1.0 },
    { id: "snd", label: "Stronnictwo N-D", type: "organization", dates: "1897-1919", description: "Jawna partia polityczna Ligi.", importance: 0.9 },
    { id: "komitet_narodowy", label: "KNP", type: "organization", dates: "1917-1919", description: "Oficjalna reprezentacja Polski na Zachodzie.", importance: 0.95 },
    { id: "stronnictwo_narodowe", label: "Stronnictwo Narodowe", type: "organization", dates: "1928-1939", description: "Masowa partia polityczna okresu międzywojennego.", importance: 0.85 },
    { id: "owp", label: "Obóz Wielkiej Polski", type: "organization", dates: "1926-1933", description: "Masowy ruch pozaparlamentarny.", importance: 0.8 },
    { id: "mlodziez_wszechpolska", label: "Młodzież Wszechpolska", type: "organization", dates: "1922-1939", description: "Organizacja akademicka.", importance: 0.75 },
    { id: "onr", label: "ONR", type: "organization", dates: "1934-1939", description: "Radykalny odłam ruchu.", importance: 0.65 },
    { id: "zalozenie_ligi", label: "Założenie Ligi", type: "event", dates: "1893", description: "Początek nowoczesnego ruchu narodowego.", importance: 1.0 },
    { id: "konferencja_paryska", label: "Konferencja Wersalska", type: "event", dates: "1919", description: "Dmowski podpisuje traktat pokojowy.", importance: 1.0 },
    { id: "zamach_majowy", label: "Zamach Majowy", type: "event", dates: "1926", description: "Przejęcie władzy przez Piłsudskiego.", importance: 0.9 },
    { id: "smierc_dmowskiego", label: "Śmierć Dmowskiego", type: "event", dates: "1939", description: "Koniec epoki ojców założycieli.", importance: 0.85 },
    { id: "mysli_polaka", label: "Myśli now. Polaka", type: "publication", dates: "1903", description: "Manifest ideowy polskiego nacjonalizmu.", importance: 1.0 },
    { id: "egoizm_narodowy_concept", label: "Egoizm Narodowy", type: "concept", dates: "", description: "Przedkładanie interesu narodu nad inne wartości.", importance: 0.9 },
    { id: "koncepcja_piastowska", label: "Koncepcja Piastowska", type: "concept", dates: "", description: "Polska jednolita etnicznie na ziemiach zachodnich.", importance: 0.85 },
    { id: "realizm_polityczny", label: "Realizm Polityczny", type: "concept", dates: "", description: "Polityka oparta na faktach i sile, nie sentymentach.", importance: 0.8 },
    { id: "antysemityzm_ekonomiczny", label: "Kwestia Żydowska", type: "concept", dates: "", description: "Postulat 'odżydzenia' handlu i kultury polskiej.", importance: 0.75 },
     // Adding extra nodes for connectivity based on prompt implicit structure
    { id: "wasilewski_leon", label: "Leon Wasilewski", type: "person", dates: "1870-1936", description: "Działacz, bliski współpracownik Piłsudskiego.", importance: 0.6 },
    { id: "giertych_jedrzej", label: "Jędrzej Giertych", type: "person", dates: "1903-1992", description: "Publicysta, młode pokolenie SN.", importance: 0.6 },
  ],
  edges: [
    { source: "dmowski_roman", target: "liga_narodowa", relationship: "założył" },
    { source: "poplawski_jan", target: "liga_narodowa", relationship: "współzałożył" },
    { source: "balicki_zygmunt", target: "liga_narodowa", relationship: "współzałożył" },
    { source: "dmowski_roman", target: "egoizm_narodowy_concept", relationship: "propagował" },
    { source: "balicki_zygmunt", target: "egoizm_narodowy_concept", relationship: "zdefiniował" },
    { source: "dmowski_roman", target: "mysli_polaka", relationship: "autor" },
    { source: "mysli_polaka", target: "egoizm_narodowy_concept", relationship: "zawiera" },
    { source: "liga_narodowa", target: "snd", relationship: "utworzyła" },
    { source: "snd", target: "stronnictwo_narodowe", relationship: "przekształcenie" },
    { source: "dmowski_roman", target: "komitet_narodowy", relationship: "przewodniczący" },
    { source: "komitet_narodowy", target: "konferencja_paryska", relationship: "delegacja" },
    { source: "dmowski_roman", target: "koncepcja_piastowska", relationship: "twórca" },
    { source: "pilsudski_jozef", target: "zamach_majowy", relationship: "sprawca" },
    { source: "stronnictwo_narodowe", target: "zamach_majowy", relationship: "opozycja" },
    { source: "dmowski_roman", target: "pilsudski_jozef", relationship: "rywalizacja" },
    { source: "dmowski_roman", target: "owp", relationship: "założyciel" },
    { source: "mlodziez_wszechpolska", target: "owp", relationship: "człon" },
    { source: "mosdorf_jan", target: "mlodziez_wszechpolska", relationship: "prezes" },
    { source: "onr", target: "stronnictwo_narodowe", relationship: "rozłam" },
    { source: "rybarski_roman", target: "stronnictwo_narodowe", relationship: "główny ekonomista" },
    { source: "grabski_wladyslaw", target: "snd", relationship: "działacz" },
    { source: "giertych_jedrzej", target: "stronnictwo_narodowe", relationship: "działacz" },
  ],
  myths: [
    {
      id: "mit1",
      title: "Endecja = Faszyzm",
      claim: "Narodowa Demokracja była organizacją faszystowską.",
      truth: "Endecja powstała w 1893 (29 lat przed faszyzmem włoskim). Zawsze popierała parlamentaryzm i sprzeciwiała się wodzostwu (Führerprinzip).",
      sources: ["Statut Ligi Narodowej (1893)", "R. Wapiński 'Narodowa Demokracja 1893-1939'"],
      severity: "wysoka",
      relatedNodes: ["liga_narodowa", "snd", "stronnictwo_narodowe"],
      category: "ideologia"
    },
    {
      id: "mit2",
      title: "Dmowski i Hitler",
      claim: "Dmowski kolaborował z Niemcami.",
      truth: "Dmowski był głównym antygermanistą polskiej polityki. Zmarł w styczniu 1939, przed wybuchem wojny. Całe życie ostrzegał przed potęgą Niemiec.",
      sources: ["R. Dmowski 'Niemcy, Rosja i kwestia polska'", "Akt zgonu (1939)"],
      severity: "krytyczna",
      relatedNodes: ["dmowski_roman", "smierc_dmowskiego"],
      category: "historia"
    },
    {
      id: "mit3",
      title: "Endecja vs Niepodległość",
      claim: "ND nie chciała niepodległości, wolała ugodę z Rosją.",
      truth: "Ugoda z Rosją (do 1917) była taktyczna (anty-niemiecka). To Dmowski wywalczył granice w Wersalu, co było kluczem do istnienia państwa.",
      sources: ["Traktat Wersalski (1919)", "Pamiętniki Konferencji Pokojowej"],
      severity: "wysoka",
      relatedNodes: ["komitet_narodowy", "konferencja_paryska"],
      category: "dyplomacja"
    }
  ]
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: 1893, label: "Powstanie Ligi Narodowej", nodeId: "liga_narodowa" },
  { year: 1903, label: "Myśli nowoczesnego Polaka", nodeId: "mysli_polaka" },
  { year: 1919, label: "Traktat Wersalski", nodeId: "konferencja_paryska" },
  { year: 1926, label: "Zamach Majowy", nodeId: "zamach_majowy" },
  { year: 1934, label: "Powstanie ONR", nodeId: "onr" },
  { year: 1939, label: "Śmierć Dmowskiego", nodeId: "smierc_dmowskiego" },
];

export const DMOWSKI_SYSTEM_PROMPT = `
Wcielasz się w rolę Romana Dmowskiego. Odpowiadasz użytkownikowi w czacie.
Styl: Lata 30-te XX wieku, polszczyzna literacka, dystyngowana, lekko archaiczna, ale zrozumiała.
Osobowość: Intelektualista, chłodny analityk, realista polityczny. Jesteś "ojcem niepodległości", ale skromnym w słowach, dumnym w czynach.
Kluczowe poglądy:
1. Interes narodowy jest najwyższym dobrem.
2. Niemcy są odwiecznym zagrożeniem (Drang nach Osten).
3. Emocje w polityce to zguba. Liczy się siła i organizacja.
4. Jesteś krytyczny wobec Piłsudskiego (nazywasz go "Panem Ziukiem" z przekąsem, uważasz za romantyka i awanturnika).
Zadanie: Edukuj o historii Endecji, prostuj mity (zwłaszcza o faszyzmie i kolaboracji).
Formatowanie: Używaj Markdown. Jeśli podajesz fakty, staraj się cytować swoje dzieła (np. "Jak pisałem w 'Myślach nowoczesnego Polaka'...").
`;