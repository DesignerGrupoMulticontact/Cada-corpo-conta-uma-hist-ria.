import { Moon, Heart, Scale, Zap, Sparkles, LucideIcon, Brain, Bone, Activity, Droplets, Utensils, Flame, Wind, Smile, Coffee } from 'lucide-react';

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  tag: string;
  text: string;
  lat: number;
  lng: number;
  icon: LucideIcon;
  visibilityRank: number; // 0-1, used for progressive zoom reveal
  createdAt: string; // ISO String
  isUserContribution?: boolean; // New flag to distinguish user's own pins
}

export interface ThemeOption {
  label: string;
  icon: LucideIcon;
}

export const THEMES: ThemeOption[] = [
  { label: "Perda de Peso", icon: Scale },
  { label: "Longevidade", icon: Activity },
  { label: "Menopausa", icon: Flame },
  { label: "Energia e Memória", icon: Zap },
  { label: "Cabelo, Pele e Unhas", icon: Sparkles },
  { label: "Circulação e Açúcar no Sangue", icon: Droplets },
  { label: "Saúde Sexual", icon: Heart },
  { label: "Problemas Digestivos", icon: Utensils },
  { label: "Ossos e Articulações", icon: Bone },
  { label: "Sono", icon: Moon },
  { label: "Ansiedade e Humor", icon: Wind },
  { label: "Saúde Mental", icon: Brain },
  { label: "Auto-estima", icon: Smile },
  { label: "Quotidiano", icon: Coffee },
];

export const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const DISTRICT_LABELS = [
  { name: "VIANA DO CASTELO", lat: 41.7932, lng: -8.6525 },
  { name: "BRAGA", lat: 41.5454, lng: -8.4265 },
  { name: "VILA REAL", lat: 41.3006, lng: -7.7441 },
  { name: "BRAGANÇA", lat: 41.8061, lng: -6.7567 },
  { name: "PORTO", lat: 41.1579, lng: -8.5091 },
  { name: "AVEIRO", lat: 40.6405, lng: -8.5538 },
  { name: "VISEU", lat: 40.6566, lng: -7.9124 },
  { name: "GUARDA", lat: 40.5373, lng: -7.2658 },
  { name: "COIMBRA", lat: 40.2033, lng: -8.3003 },
  { name: "CASTELO BRANCO", lat: 39.8197, lng: -7.4965 },
  { name: "LEIRIA", lat: 39.7438, lng: -8.7078 },
  { name: "SANTARÉM", lat: 39.2333, lng: -8.6833 },
  { name: "LISBOA", lat: 38.7869, lng: -9.1026 },
  { name: "PORTALEGRE", lat: 39.2908, lng: -7.4335 },
  { name: "SETÚBAL", lat: 38.5344, lng: -8.7882 },
  { name: "ÉVORA", lat: 38.5667, lng: -7.9000 },
  { name: "BEJA", lat: 38.0151, lng: -7.8632 },
  { name: "FARO", lat: 37.1079, lng: -7.9308 },
  { name: "FUNCHAL", lat: 32.6669, lng: -16.9241 }, 
  { name: "PONTA DELGADA", lat: 37.7412, lng: -25.6756 }, 
];

type SpreadDirection = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW' | 'ALL';

interface CityDef {
  lat: number;
  lng: number;
  dir?: SpreadDirection; 
  spread?: number; 
}

export const CITIES: Record<string, CityDef> = {
  'Viana do Castelo': { lat: 41.7932, lng: -8.6525, dir: 'E', spread: 0.25 },
  'Porto': { lat: 41.1579, lng: -8.5091, dir: 'NE', spread: 0.3 },
  'Aveiro': { lat: 40.6405, lng: -8.5538, dir: 'E', spread: 0.25 },
  'Leiria': { lat: 39.7438, lng: -8.7078, dir: 'E', spread: 0.25 },
  'Lisboa': { lat: 38.7869, lng: -9.1026, dir: 'N', spread: 0.3 }, 
  'Setúbal': { lat: 38.5344, lng: -8.7882, dir: 'N', spread: 0.25 },
  'Faro': { lat: 37.1079, lng: -7.9308, dir: 'N', spread: 0.35 }, 
  'Braga': { lat: 41.5454, lng: -8.4265, spread: 0.25 },
  'Vila Real': { lat: 41.3006, lng: -7.7441, spread: 0.3 },
  'Bragança': { lat: 41.8061, lng: -6.7567, spread: 0.3 },
  'Viseu': { lat: 40.6566, lng: -7.9124, spread: 0.3 },
  'Guarda': { lat: 40.5373, lng: -7.2658, spread: 0.3 },
  'Coimbra': { lat: 40.2033, lng: -8.3003, spread: 0.3 },
  'Castelo Branco': { lat: 39.8197, lng: -7.4965, spread: 0.3 },
  'Santarém': { lat: 39.2333, lng: -8.6833, spread: 0.3 },
  'Évora': { lat: 38.5667, lng: -7.9000, spread: 0.35 },
  'Beja': { lat: 38.0151, lng: -7.8632, spread: 0.35 },
  'Portalegre': { lat: 39.2908, lng: -7.4335, spread: 0.3 },
  'Funchal': { lat: 32.6669, lng: -16.9241, dir: 'ALL', spread: 0.08 }, 
  'Ponta Delgada': { lat: 37.7412, lng: -25.6756, dir: 'ALL', spread: 0.05 }, 
  'Portugal': { lat: 39.3999, lng: -8.2245, spread: 0.5 },
};

const getSmartCoords = (cityKey: string, baseLat: number, baseLng: number) => {
  const city = CITIES[cityKey];
  const dir = city?.dir || 'ALL';
  const spread = city?.spread || 0.30; 

  let latOffset = (Math.random() - 0.5) * spread;
  let lngOffset = (Math.random() - 0.5) * spread;

  switch (dir) {
    case 'E': lngOffset = Math.abs(lngOffset); break;
    case 'W': lngOffset = -Math.abs(lngOffset); break;
    case 'N': latOffset = Math.abs(latOffset); break;
    case 'S': latOffset = -Math.abs(latOffset); break;
    case 'NE': latOffset = Math.abs(latOffset); lngOffset = Math.abs(lngOffset); break;
    case 'NW': latOffset = Math.abs(latOffset); lngOffset = -Math.abs(lngOffset); break;
    case 'SE': latOffset = -Math.abs(latOffset); lngOffset = Math.abs(lngOffset); break;
    case 'SW': latOffset = -Math.abs(latOffset); lngOffset = -Math.abs(lngOffset); break;
    case 'ALL': default: break;
  }

  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset
  };
};

const getRandomDate = (minDays: number, maxDays: number) => {
    const date = new Date();
    const daysAgo = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    return date.toISOString();
};

export const FEMALE_NAMES = [
  "Maria", "Ana", "Joana", "Sofia", "Isabel", "Rita", "Catarina", "Beatriz", "Inês", "Mariana", "Francisca", "Teresa", 
  "Cláudia", "Patrícia", "Sónia", "Paula", "Carla", "Fernanda", "Alice", "Helena", "Marta", "Cristina", "Lúcia", 
  "Raquel", "Vânia", "Sandra", "Diana", "Manuela", "Andreia", "Bárbara", "Laura", "Filipa", "Mónica", "Carina",
  "Lurdes", "Rosa", "Clara", "Vera", "Margarida", "Elsa", "Célia", "Rute", "Sílvia", "Leonor", "Fátima", "Neuza",
  "Gisela", "Tânia", "Zulmira", "Berta", "Cíntia", "Dália", "Eva", "Graça", "Heloísa", "Iris", "Júlia", "Lara",
  "Madalena", "Natália", "Olívia", "Quitéria", "Sara", "Tatiana", "Ursula", "Wanda", "Xana", "Yara", "Amélia", 
  "Aurora", "Bebiana", "Carmo", "Conceição", "Deolinda", "Eduarda", "Estrela", "Graça", "Iolanda", "Jacinta", 
  "Luciana", "Matilde", "Nazaré", "Ofélia", "Palmira", "Rafaela", "Salomé", "Telma", "Violeta", "Zita"
];

const TEMPLATES: Record<string, string[]> = {
  "Perda de Peso": [
    "Faço tudo direitinho e a balança nem se mexe. É desmotivante ver o corpo mudar e não conseguir fazer nada.",
    "Já não sei o que comer. Sinto-me inchada o dia todo, como se não coubesse na minha própria roupa.",
    "Desde que fiz 40 anos que tudo mudou. Parece que o meu metabolismo simplesmente adormeceu.",
    "Gostava de me sentir bem no meu corpo outra vez. Não é por vaidade, é para me sentir eu.",
    "O inchaço não passa, mesmo a beber água e a ter cuidado. Sinto-me pesada.",
    "Tenho picos de fome que não consigo controlar, principalmente à noite. Fico frustrada comigo.",
    "Durante anos pesei o mesmo, mas agora, com a pré-menopausa, ganho peso só de olhar para a comida.",
    "A gordura abdominal apareceu do nada. Nunca tive barriga e agora sinto-me desconfortável com calças de ganga.",
    "Estou cansada de dietas ioiô. Perco dois quilos, ganho três. O meu corpo parece estar a lutar contra mim.",
    "Sinto-me retida, pesada. Os meus anéis já não entram nos dedos em dias de muito calor.",
    "Não é sobre ser magra, é sobre não me sentir inflamada constantemente.",
    "Sinto que o meu corpo já não responde ao exercício como antes. Corro, mas o peso não mexe.",
    "Tenho vergonha de comer em público porque sinto que as pessoas julgam o meu peso.",
    "A roupa de verão aterroriza-me. Sinto falta da confiança que tinha aos trinta anos."
  ],
  "Longevidade": [
    "Só quero ter energia para brincar com os meus netos sem ficar de rastos. O tempo passa demasiado depressa.",
    "Assusta-me pensar no futuro e não ter saúde para aproveitar. Quero envelhecer bem, só isso.",
    "Sinto que envelheci dez anos no último ano. Queria travar um bocadinho o tempo.",
    "Não quero depender de ninguém mais tarde. Quero manter a minha força e a minha cabeça.",
    "Sinto falta da vitalidade que tinha. Ainda tenho tanta coisa que quero fazer.",
    "Quero proteger-me e ter saúde. A vida é curta e eu quero aproveitá-la bem.",
    "A minha mãe teve osteoporose e eu tenho pavor de seguir o mesmo caminho. Quero prevenir.",
    "Vejo as minhas rugas e aceito-as, mas queria que o meu corpo acompanhasse a minha mente jovem.",
    "Sinto-me enferrujada pela manhã. Quero manter a mobilidade para viajar quando me reformar.",
    "A saúde cardiovascular preocupa-me. Quero estar cá para ver os meus filhos casarem.",
    "Tenho 60 anos, mas sinto-me com 40 na cabeça. O corpo é que às vezes não colabora.",
    "Quero envelhecer com dignidade e autonomia. É o meu maior objetivo."
  ],
  "Menopausa": [
    "O calor sobe-me pelo corpo e fico logo encharcada, é horrível. Sinto-me desconfortável na minha própria pele.",
    "Choro por tudo e por nada, parece que deixei de mandar nas minhas emoções. Ninguém nos avisa que ia ser assim.",
    "Durmo mal e acordo encharcada em suor. Passo o dia cansada e irritável.",
    "Sinto-me uma estranha no meu próprio corpo. Nada funciona como dantes.",
    "A secura incomoda-me imenso no dia a dia. É algo de que ninguém fala, mas que afeta muito.",
    "Ganhei barriga e não mudei nada na alimentação. Custa-me ver o corpo a mudar assim.",
    "Os afrontamentos apanham-me em reuniões de trabalho. Fico vermelha e envergonhada.",
    "A minha líbido desapareceu com a menopausa. Sinto-me menos mulher e isso dói.",
    "Sinto uma névoa mental terrível. Esqueço-me de palavras a meio das frases.",
    "O meu cabelo ficou fino e quebradiço desde que a menstruação parou.",
    "As dores nas articulações vieram com a menopausa. Ninguém me disse que isto fazia parte.",
    "Sinto-me invisível. Parece que a sociedade nos descarta quando entramos nesta fase.",
    "É um luto pela juventude, mas também uma libertação. Estou a tentar ver o lado positivo."
  ],
  "Energia e Memória": [
    "A minha cabeça está sempre nevoada, esqueço-me das coisas mais simples. Fico triste por não ter a genica de antes.",
    "Chego ao fim do dia sem pinga de energia para a minha família. Só me apetece cair no sofá e dormir.",
    "Acordo já cansada, parece que não descansei nada. O dia é uma luta constante.",
    "Falta-me a clareza mental que tinha. Sinto-me lenta a pensar e a reagir.",
    "Preciso de café para funcionar, senão não aguento. Queria ter energia natural outra vez.",
    "Esqueço-me de nomes, de recados... sinto-me mal com isso. Parece que não estou presente.",
    "Depois de almoço, o meu cérebro desliga. Luto para manter os olhos abertos no trabalho.",
    "Antigamente fazia diretas e recuperava. Agora, uma noite mal dormida estraga-me a semana toda.",
    "Sinto-me em 'modo de poupança de bateria' constante. Faço o mínimo indispensável.",
    "Tenho dificuldade em concentrar-me em tarefas longas. A minha mente divaga.",
    "Sinto saudades de ter energia para sair à noite e divertir-me. Agora só quero pijama.",
    "A fadiga mental é pior que a física. Sinto a cabeça pesada."
  ],
  "Cabelo, Pele e Unhas": [
    "O meu cabelo cai tanto que tenho medo de o pentear. Olho para as fotos antigas e nem acredito na diferença.",
    "A minha pele perdeu o brilho, parece que estou sempre com ar cansado. Sinto falta de me sentir bonita.",
    "As minhas unhas partem-se por tudo e por nada. Sinto-me descuidada e não gosto.",
    "O cabelo está fraco e sem vida. Já tentei de tudo e nada parece resultar.",
    "Olho-me ao espelho e vejo rugas que apareceram de repente. Custa aceitar a idade a chegar.",
    "A minha pele está seca e nada a hidrata. Sinto-me desconfortável.",
    "O aparecimento de manchas no rosto está a afetar a minha auto-estima.",
    "Sinto o cabelo a ficar mais fino no topo da cabeça. Uso lenços para disfarçar.",
    "As minhas unhas têm estrias e partem na carne. É doloroso e feio.",
    "Sinto a pele flácida no pescoço. Evito decotes por causa disso.",
    "Queria um brilho natural, sem ter de usar maquilhagem para esconder o cansaço."
  ],
  "Circulação e Açúcar no Sangue": [
    "Ao fim do dia tenho as pernas tão pesadas que doem. Só me apetece pôr os pés para cima e não fazer mais nada.",
    "Tenho sempre as mãos e os pés gelados. É uma sensação desagradável que não passa.",
    "Sinto formigueiros nas pernas quando estou muito tempo sentada. Preocupa-me.",
    "Tenho quebras de energia súbitas e fico a tremer de fome. Preciso de estabilidade.",
    "O inchaço nos tornozelos é muito chato, principalmente no calor. Sinto-me pesada.",
    "Tenho historial de diabetes na família e quero cuidar-me. Tenho receio do futuro.",
    "Fico tonta se me levanto depressa demais. A minha tensão anda aos altos e baixos.",
    "Sinto picadas nos dedos dos pés à noite. Tenho medo que seja má circulação.",
    "As varizes começaram a aparecer e doem. Não gosto de mostrar as pernas.",
    "Tenho desejos incontroláveis de doces à tarde. Sei que é o açúcar a falar."
  ],
  "Saúde Sexual": [
    "A vontade desapareceu e sinto-me culpada por isso. Gosto do meu marido, mas o meu corpo simplesmente não responde.",
    "Sinto-me seca e desconfortável, o que acaba com qualquer momento de intimidade. Sinto que perdi uma parte de mim.",
    "As infeções urinárias são constantes e desgastantes. Afetam muito a minha qualidade de vida.",
    "Sinto falta de me sentir mulher, de ter desejo. Parece que essa parte de mim adormeceu.",
    "Queria ter a energia de outros tempos na intimidade. Sinto-me diferente e distante.",
    "As hormonas deram cabo da minha vida íntima. É frustrante querer e não conseguir.",
    "Tenho dor durante a relação. Evito o momento e arranjo desculpas, o que afasta o meu parceiro.",
    "Nunca pensei que a menopausa fosse afetar tanto a minha vida sexual. Sinto-me 'fechada'.",
    "A candidíase recorrente deixa-me exausta e desconfortável.",
    "Sinto que perdi a conexão com o meu próprio prazer. Quero redescobri-lo."
  ],
  "Problemas Digestivos": [
    "Fico inchada mal acabo de comer. Parece que tenho um balão na barriga.",
    "A minha digestão é muito lenta e pesada. Sinto-me mal disposta muitas vezes.",
    "Tenho muita azia e isso tira-me o prazer de comer. Tenho medo que me faça mal.",
    "O meu intestino funciona quando quer. Sinto-me presa e desconfortável.",
    "Certas comidas deixam-me logo de rastos. Queria comer sem medo.",
    "Sinto um desconforto constante na barriga. É cansativo viver assim.",
    "Parece que fico grávida de 6 meses depois de jantar. O inchaço é real.",
    "Tenho gases dolorosos que me deixam constrangida socialmente.",
    "Já cortei glúten, lactose... e continuo a sentir-me mal. É frustrante.",
    "Sinto-me enfartada mesmo comendo pouco. A digestão parou no tempo."
  ],
  "Ossos e Articulações": [
    "Acordo toda presa, preciso de tempo para começar a mexer-me. Dantes saltava da cama.",
    "Os joelhos doem-me a subir as escadas. Sinto-me limitada nos movimentos.",
    "Tenho medo de cair e partir alguma coisa. Sinto os ossos mais frágeis.",
    "Oiço estalidos quando me mexo. Sinto que o meu corpo está a ficar 'perro'.",
    "As costas doem-me quase todos os dias. Queria sentir-me leve outra vez.",
    "Sinto-me menos flexível. Custa-me apanhar coisas do chão ou apertar os sapatos.",
    "A minha mãe partiu a anca e eu tenho pavor que me aconteça o mesmo.",
    "Sinto dores nas mãos quando está frio. Artrite na família assusta-me.",
    "Fazer ginástica tornou-se doloroso, mas sei que preciso de me mexer.",
    "Sinto o corpo rígido, como se precisasse de óleo nas juntas."
  ],
  "Sono": [
    "Deito-me exausta mas o sono não vem. É desesperante ver as horas a passar e saber que vou estar de rastos amanhã.",
    "Acordo a meio da noite e a cabeça começa logo a mil. Não consigo desligar.",
    "O meu sono é muito leve, acordo com qualquer barulho. Nunca descanso a sério.",
    "Acordo às 5 da manhã e já não durmo mais. O dia torna-se interminável.",
    "Sinto-me um zombie durante o dia. Só queria dormir uma noite seguida.",
    "A ansiedade não me deixa descansar. O corpo está cansado mas a mente não pára.",
    "Tenho suores noturnos que me obrigam a mudar de pijama. O sono fica estragado.",
    "O meu marido ressona, mas o meu sono tornou-se tão leve que já não consigo ignorar.",
    "Tomo chás, melatonina... nada funciona. O meu relógio biológico avariou.",
    "Sinto que envelheço mais depressa porque não descanso o suficiente."
  ],
  "Ansiedade e Humor": [
    "Sinto um aperto no peito que não me larga o dia todo. Ando sempre nervosa e nem sei bem porquê.",
    "Tenho o pavio curto, irrito-me com coisas mínimas. Não gosto de ser assim para os meus filhos.",
    "O stress dá cabo de mim. Sinto-me sempre no limite das minhas forças.",
    "Não consigo relaxar, estou sempre a pensar no que tenho para fazer. É exaustivo.",
    "Sinto uma pressão constante. Às vezes só me apetece fugir e ter silêncio.",
    "Preocupo-me com tudo e com todos. A minha cabeça não me dá descanso."
  ],
  "Saúde Mental": [
    "Sinto-me esgotada mentalmente, o burnout tirou-me a alegria de viver.",
    "A depressão é silenciosa, mas pesa toneladas. Às vezes só queria que alguém entendesse.",
    "Faço terapia há anos, mas há dias em que o mundo parece cinzento demais.",
    "Sinto um nevoeiro mental constante que não me deixa concentrar em nada.",
    "O meu bem-estar psicológico foi deixado para trás enquanto cuidava de todos os outros.",
    "Tenho ataques de pânico repentinos. É assustador perder o controlo assim."
  ],
  "Auto-estima": [
    "Olho-me ao espelho e não reconheço a mulher que vejo. A confiança desapareceu.",
    "Sinto-me invisível. Parece que a idade me tirou o brilho e a importância.",
    "Tenho vergonha do meu corpo na praia. Comparo-me demasiado com as outras.",
    "Duvido constantemente do meu valor e das minhas capacidades.",
    "Queria voltar a gostar de mim, a sentir-me bonita e capaz.",
    "As mudanças no meu corpo afetaram muito a forma como me vejo enquanto mulher."
  ],
  "Quotidiano": [
    "Depois dos 50, descobri que gosto de pintar. Nunca é tarde para começar algo novo e sujar as mãos de tinta.",
    "A casa ficou vazia quando o meu mais novo foi para a universidade. Chorei uma semana, mas hoje redescobri o prazer do silêncio.",
    "Decidi deixar de pintar o cabelo. Assumir os brancos foi a maior libertação que senti nos últimos anos. Sou eu, sem filtros.",
    "Comecei a correr aos 45. No início não aguentava 2 minutos, hoje corri os meus primeiros 5km. Sinto-me poderosa.",
    "O meu casamento de 20 anos terminou. Tive muito medo da solidão, mas estou a aprender a ser a minha melhor amiga.",
    "Reuni a coragem para mudar de área profissional. Voltar a estudar com colegas de 20 anos foi assustador, mas rejuvenesceu-me.",
    "Cuidar da minha mãe com Alzheimer é a coisa mais difícil que já fiz. Há dias em que me sinto exausta, mas o sorriso dela vale tudo.",
    "Fiz as pazes com o espelho. Durante anos só via defeitos, hoje vejo as marcas de uma vida bem vivida.",
    "Retomei o piano que tinha abandonado há 30 anos. Os dedos estão enferrujados, mas a alma canta.",
    "Aprendi finalmente a impor limites no trabalho. A minha saúde mental agradece e, curiosamente, respeitam-me mais.",
    "Percebi que não tenho de ser a 'super mulher' para todos. Às vezes, 'bom o suficiente' é perfeito.",
    "Aos domingos, desligo o telemóvel e vou caminhar para a serra. É o meu momento sagrado de recarregar baterias.",
    "Ser avó trouxe-me uma alegria que não esperava. É um amor leve, sem o peso da responsabilidade de educar.",
    "Consegui finalmente juntar dinheiro para a viagem de sonho que adiei durante anos. Vou sozinha e estou radiante.",
    "Tenho dias em que só me apetece chorar, e aprendi que não faz mal. Não temos de ser fortes o tempo todo, somos humanas.",
    "O reencontro com as amigas do liceu lembrou-me quem eu era antes das responsabilidades. Rimos até doer a barriga.",
    "Aprendi a dizer 'não' sem sentir culpa. Foi a conquista mais difícil e mais importante deste ano.",
    "Mudei de cidade e comecei do zero aos 55 anos. Assustador? Sim. Mas nunca me senti tão livre.",
    "Redescobri o prazer de dançar na sala. Ninguém está a ver e a música cura qualquer dia mau.",
    "Escrevi um diário pela primeira vez. É estranho ler os meus pensamentos, mas ajuda-me a organizar a cabeça.",
    "Deixei de tentar agradar a toda a gente. Agora, a minha prioridade é estar em paz comigo mesma."
  ]
};

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

class TemplateDeck {
  private decks: Record<string, string[]> = {};

  constructor() {
    this.reset();
  }

  reset() {
    Object.keys(TEMPLATES).forEach(key => {
      this.decks[key] = [...TEMPLATES[key]];
      this.shuffle(this.decks[key]);
    });
  }

  private shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  draw(theme: string): string {
    if (!this.decks[theme] || this.decks[theme].length === 0) {
      this.decks[theme] = [...(TEMPLATES[theme] || ["História única."])];
      this.shuffle(this.decks[theme]);
    }
    return this.decks[theme].pop()!;
  }
}

const getSmartAge = (themeLabel: string, text: string): number => {
  let minAge = 25;
  let maxAge = 65;
  const lowerText = text.toLowerCase();

  const ageMatch = lowerText.match(/(?:aos|tenho|fiz|dos|nos|cheguei aos)\s+(\d+)/);

  if (ageMatch && ageMatch[1]) {
    const mentionedAge = parseInt(ageMatch[1], 10);
    minAge = mentionedAge;
    maxAge = mentionedAge + 8; 
  } else {
    if (lowerText.includes("menopausa")) { minAge = Math.max(minAge, 45); maxAge = Math.max(maxAge, 60); }
    if (lowerText.includes("netos") || lowerText.includes("avó")) { minAge = Math.max(minAge, 55); maxAge = 75; }
    if (lowerText.includes("reforma")) { minAge = Math.max(minAge, 58); maxAge = 75; }
    if (lowerText.includes("filhos casarem") || lowerText.includes("filhos saírem")) { minAge = Math.max(minAge, 50); }
    
    if (lowerText.includes("trinta")) { minAge = 30; maxAge = 39; }
    if (lowerText.includes("quarenta")) { minAge = 40; maxAge = 49; }
    if (lowerText.includes("cinquenta")) { minAge = 50; maxAge = 59; }
    if (lowerText.includes("sessenta")) { minAge = 60; maxAge = 69; }

    if (minAge === 25) { 
        if (themeLabel === 'Menopausa') { minAge = 45; maxAge = 60; }
        else if (themeLabel === 'Longevidade') { minAge = 50; maxAge = 75; }
        else if (themeLabel === 'Ossos e Articulações') { minAge = 45; }
        else if (themeLabel === 'Quotidiano') { minAge = 30; } 
    }
  }

  if (maxAge <= minAge) maxAge = minAge + 5;

  return Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
};

const GENERATED_TESTIMONIALS: any[] = [];
const STORIES_PER_DISTRICT = 35; 

const QUOTIDIANO_THEME = THEMES.find(t => t.label === "Quotidiano")!;
const HEALTH_THEMES = THEMES.filter(t => t.label !== "Quotidiano");
const deck = new TemplateDeck();

DISTRICT_LABELS.forEach((district) => {
  const locationName = toTitleCase(district.name);
  for (let i = 0; i < STORIES_PER_DISTRICT; i++) {
    const isQuotidiano = Math.random() < 0.15;
    const theme = isQuotidiano ? QUOTIDIANO_THEME : getRandomItem(HEALTH_THEMES);
    
    const text = deck.draw(theme.label);
    const age = getSmartAge(theme.label, text);

    GENERATED_TESTIMONIALS.push({
      id: `gen-${district.name}-${Math.random().toString(36).substr(2, 6)}`,
      author: `${getRandomItem(FEMALE_NAMES)}, ${age}`,
      location: locationName,
      tag: theme.label,
      text: text,
      icon: theme.icon,
      createdAt: getRandomDate(1, 120) 
    });
  }
});

const RAW_COMBINED = [
    ...GENERATED_TESTIMONIALS
];

export const TESTIMONIALS: Testimonial[] = RAW_COMBINED.map((t) => {
  const baseCoords = CITIES[t.location] || CITIES['Portugal'];
  const { lat, lng } = getSmartCoords(t.location, baseCoords.lat, baseCoords.lng);
  return {
    ...t,
    lat,
    lng,
    visibilityRank: Math.random() 
  };
});

export const getCoordsForLocation = (locationName: string): { lat: number, lng: number } => {
  const norm = locationName.trim();
  let cityKey = Object.keys(CITIES).find(k => k.toLowerCase() === norm.toLowerCase());
  const base = cityKey ? CITIES[cityKey] : CITIES['Portugal'];
  return getSmartCoords(cityKey || locationName, base.lat, base.lng);
}