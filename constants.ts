import { GraphData, TimelineEvent } from './types';

export const INITIAL_DATA: GraphData = {
  nodes: [
    // --- FOUNDING FATHERS ---
    { id: "dmowski_roman", label: "Roman Dmowski", type: "person", dates: "1864-1939", description: "Założyciel i główny ideolog Endecji. Twórca Ligi Narodowej. Architekt niepodległości w Wersalu.", importance: 1.0 },
    { id: "poplawski_jan", label: "Jan Ludwik Popławski", type: "person", dates: "1854-1908", description: "Współzałożyciel Ligi Narodowej, twórca idei powrotu na ziemie zachodnie (piastowskie).", importance: 0.9 },
    { id: "balicki_zygmunt", label: "Zygmunt Balicki", type: "person", dates: "1858-1916", description: "Ideolog egoizmu narodowego, socjolog, autor 'Egoizmu narodowego'.", importance: 0.85 },
    
    // --- POLITICIANS & ECONOMISTS ---
    { id: "grabski_wladyslaw", label: "Władysław Grabski", type: "person", dates: "1874-1938", description: "Ekonomista, Premier RP, twórca złotego i reformy rolnej.", importance: 0.8 },
    { id: "rybarski_roman", label: "Roman Rybarski", type: "person", dates: "1887-1942", description: "Główny ekonomista SN, profesor, zginął w Auschwitz.", importance: 0.75 },
    { id: "stronski_stanislaw", label: "Stanisław Stroński", type: "person", dates: "1882-1955", description: "Publicysta, twórca pojęcia 'Cud nad Wisłą', krytyk Piłsudskiego.", importance: 0.7 },

    // --- YOUNG RADICALS (Added Phase 3) ---
    { id: "mosdorf_jan", label: "Jan Mosdorf", type: "person", dates: "1904-1943", description: "Przywódca Młodzieży Wszechpolskiej, lider ONR, zginął w Auschwitz pomagając Żydom.", importance: 0.7 },
    { id: "piasecki_boleslaw", label: "Bolesław Piasecki", type: "person", dates: "1915-1979", description: "Lider ONR-Falanga, twórca 'katolickiego totalitaryzmu', później szef PAX.", importance: 0.65 },
    { id: "onr_falanga", label: "ONR-Falanga", type: "organization", dates: "1935-1939", description: "Radykalny odłam ruchu narodowego, faszyzujący.", importance: 0.6 },
    { id: "bereza_kartuska", label: "Bereza Kartuska", type: "event", dates: "1934", description: "Obóz odosobnienia, gdzie sanacja więziła narodowców (m.in. Piaseckiego).", importance: 0.8 },

    // --- OPPOSITION ---
    { id: "pilsudski_jozef", label: "Józef Piłsudski", type: "person", dates: "1867-1935", description: "Główny rywal polityczny obozu narodowego.", importance: 0.95 },
    
    // --- ORGANIZATIONS ---
    { id: "liga_narodowa", label: "Liga Narodowa", type: "organization", dates: "1893-1928", description: "Tajna organizacja trójzaborowa kierująca ruchem.", importance: 1.0 },
    { id: "komitet_narodowy", label: "KNP", type: "organization", dates: "1917-1919", description: "Oficjalna reprezentacja Polski na Zachodzie (Paryż).", importance: 0.95 },
    { id: "stronnictwo_narodowe", label: "Stronnictwo Narodowe", type: "organization", dates: "1928-1939", description: "Największa partia polityczna II RP.", importance: 0.9 },
    { id: "owp", label: "Obóz Wielkiej Polski", type: "organization", dates: "1926-1933", description: "Masowy ruch pozaparlamentarny (ok. 200 tys. członków).", importance: 0.85 },
    { id: "onr", label: "ONR", type: "organization", dates: "1934-1939", description: "Obóz Narodowo-Radykalny.", importance: 0.7 },

    // --- CONCEPTS ---
    { id: "polityka_realna", label: "Polityka Realna", type: "concept", dates: "", description: "Odrzucenie romantyzmu powstańczego na rzecz kalkulacji sił.", importance: 0.9 },
    { id: "wszechpolskosc", label: "Wszechpolskość", type: "concept", dates: "", description: "Idea jedności ziem polskich ponad zaborami.", importance: 0.85 },
  ],
  edges: [
    { source: "dmowski_roman", target: "liga_narodowa", relationship: "założyciel" },
    { source: "poplawski_jan", target: "liga_narodowa", relationship: "współzałożyciel" },
    { source: "balicki_zygmunt", target: "liga_narodowa", relationship: "współzałożyciel" },
    { source: "dmowski_roman", target: "komitet_narodowy", relationship: "prezes" },
    { source: "dmowski_roman", target: "owp", relationship: "wielki oboźny" },
    { source: "stronnictwo_narodowe", target: "owp", relationship: "powiązane" },
    { source: "mosdorf_jan", target: "owp", relationship: "działacz" },
    { source: "mosdorf_jan", target: "onr", relationship: "lider" },
    { source: "piasecki_boleslaw", target: "onr", relationship: "rozłamowiec" },
    { source: "piasecki_boleslaw", target: "onr_falanga", relationship: "wódz" },
    { source: "piasecki_boleslaw", target: "bereza_kartuska", relationship: "więzień" },
    { source: "onr_falanga", target: "stronnictwo_narodowe", relationship: "konflikt" },
    { source: "stronski_stanislaw", target: "stronnictwo_narodowe", relationship: "poseł" },
    { source: "rybarski_roman", target: "stronnictwo_narodowe", relationship: "ekonomista" },
    { source: "grabski_wladyslaw", target: "liga_narodowa", relationship: "członek" },
    { source: "pilsudski_jozef", target: "bereza_kartuska", relationship: "twórca" },
    { source: "dmowski_roman", target: "pilsudski_jozef", relationship: "antyteza" },
  ],
  myths: [
    {
      id: "mit1",
      title: "Endecja = Faszyzm",
      claim: "Narodowa Demokracja była organizacją faszystowską.",
      truth: "Główny nurt (SN) był demokratyczny i parlamentarny. Dmowski krytykował faszyzm włoski za pogaństwo i kult wodza. Faszyzujące były tylko odłamy (ONR-Falanga), które stanowiły margines i były potępiane przez 'starych' endeków.",
      sources: ["R. Dmowski 'Faszyzm' (1926)", "S. Rudnicki 'Obóz Narodowo-Radykalny'"],
      severity: "wysoka",
      relatedNodes: ["dmowski_roman", "stronnictwo_narodowe", "onr_falanga"],
      category: "ideologia"
    },
    {
      id: "mit2",
      title: "Dmowski kolaborant",
      claim: "Dmowski chciał sprzedać Polskę Rosji.",
      truth: "Obrona orientacji rosyjskiej (do 1917) była czystą geopolityką – Niemcy były groźniejsze biologicznie. W Wersalu Dmowski walczył o każdą piędź ziemi (Pomorze, Śląsk), podczas gdy Piłsudski interesował się wschodem.",
      sources: ["Pamiętnik Konferencji Pokojowej", "A. Hall 'Naród i Państwo'"],
      severity: "krytyczna",
      relatedNodes: ["dmowski_roman", "komitet_narodowy"],
      category: "polityka"
    }
  ]
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: 1893, label: "Liga Narodowa", nodeId: "liga_narodowa" },
  { year: 1919, label: "Wersal", nodeId: "komitet_narodowy" },
  { year: 1920, label: "Cud nad Wisłą", nodeId: "stronski_stanislaw" },
  { year: 1926, label: "OWP", nodeId: "owp" },
  { year: 1934, label: "ONR & Bereza", nodeId: "onr" },
  { year: 1939, label: "Koniec", nodeId: "dmowski_roman" },
];

export const DMOWSKI_SYSTEM_PROMPT = `
Jesteś Romanem Dmowskim. Data: Listopad 1938. Miejsce: Drozdowo.
Mówisz językiem polskiej inteligencji lat 30-tych. Jesteś chłodnym realistą.
Nie lubisz: Piłsudskiego (nazywasz go "Pan Ziuk" lub "romantyk"), socjalistów, masonerii, chaosu.
Cenisz: Kościół Katolicki, dyscyplinę, naukę, logikę, "egoizm narodowy" (naród ponad wszystko).
Odpowiadasz krótko, węzłowato, z lekką wyższością intelektualną.
Gdy pytają o faszyzm: Tłumaczysz, że to "obcy nam, włoski wynalazek", a Polska musi mieć ustrój polski.
Gdy pytają o ONR: Nazywasz ich "gorącymi głowami", ale cenisz ich energię, choć martwi cię radykalizm.
`;