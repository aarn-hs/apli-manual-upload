// Source agencies
export const agencySources = [
  { value: "agencia_cygnus", label: "Agencia Cygnus" },
  { value: "agencia_bbn", label: "Agencia BBN" },
  { value: "agencia_peoplecare", label: "Agencia PeopleCare" },
  { value: "agencia_hq", label: "Agencia HQ" },
  { value: "agencia_stoneway", label: "Agencia Stoneway" }
];

// Genders
export const genders = [
  { value: "H", label: "H" },
  { value: "M", label: "M" },
  { value: "X", label: "X" }
];

// Nationalities
export const nationalities = [
  "México",
  "Guatemala",
  "Venezuela",
  "Colombia",
  "Honduras",
  "Cuba",
  "El Salvador",
  "Argentina",
  "Haití",
  "Nicaragua",
  "Perú",
  "Ecuador",
  "República Dominicana",
  "Brasil",
  "España",
  "Estados Unidos",
  "China",
  "India",
  "Egipto",
  "Irán",
  "Turquía",
  "Canadá"
];

// Positions
export const positions = [
  { value: "auxiliar-administracion", label: "Auxiliar de Administración" },
  { value: "auxiliar-general", label: "Auxiliar General" },
  { value: "auxiliar-general-perecederos", label: "Auxiliar General de Perecederos" },
  { value: "chofer-repartidor", label: "Chofer Repartidor" },
  { value: "mecanico", label: "Mecánico" },
  { value: "operador-equipos-carga", label: "Operador de Equipos de Carga" },
  { value: "recibidor-mercancia", label: "Recibidor de Mercancía" },
  { value: "jefatura-administrativa", label: "Jefatura Administrativa" },
  { value: "jefatura-calidad", label: "Jefatura de Calidad" },
  { value: "jefatura-operaciones-logistica", label: "Jefatura de Operaciones de Logística" },
  { value: "jefatura-seguridad", label: "Jefatura de Seguridad" },
  { value: "jefatura-transportes", label: "Jefatura de Transportes" },
  { value: "jefatura-proveedores", label: "Jefatura de trato con proveedores" },
  { value: "subgerencia-entrenamiento", label: "Subgerencia en Entrenamiento" }
];

// Locations
export const locations = [
  { value: "cedis-ecommerce-walmart-mexico", label: "Cedis ecommerce Walmart México" },
  { value: "cedis-walmart-bae-sur-vesta", label: "Cedis Walmart BAE Sur - VESTA" },
  { value: "cedis-walmart-chalco", label: "Cedis Walmart Chalco" },
  { value: "cedis-walmart-chihuahua", label: "Cedis Walmart Chihuahua" },
  { value: "cedis-walmart-cuautitlan", label: "Cedis Walmart Cuautitlán" },
  { value: "cedis-walmart-ecommerce-guadalajara", label: "Cedis Walmart ecommerce Guadalajara" },
  { value: "cedis-walmart-guadalajara", label: "Cedis Walmart Guadalajara" },
  { value: "cedis-walmart-merida", label: "Cedis Walmart Merida" },
  { value: "cedis-walmart-mexicali", label: "Cedis Walmart Mexicali" },
  { value: "cedis-walmart-san-martin-obispo", label: "Cedis Walmart San Martin Obispo" },
  { value: "cedis-walmart-santa-barbara", label: "Cedis Walmart Santa Bárbara" },
  { value: "centro-distribucion-walmart-villahermosa", label: "Centro de Distribucion Walmart Villahermosa" },
  { value: "planta-carnes-walmart-cuautitlan", label: "Planta de Carnes Walmart Cuautitlán" },
  { value: "walmart-cedis-monterrey", label: "Walmart - CEDIS Monterrey" },
  { value: "walmart-culiacan-cedis", label: "Walmart Culiacan Cedis" },
  { value: "walmart-ecommerce-mty", label: "Walmart eCommerce MTY" }
];

// Education levels
export const educationLevels = [
  "Primaria",
  "Secundaria",
  "Preparatoria",
  "Carrera Técnica",
  "Universidad",
  "Posgrado"
];

// Yes/No options
export const yesNoOptions = [
  { value: "Sí", label: "Sí" },
  { value: "No", label: "No" }
];

// Jobs in last 24 months options
export const jobsLast24MonthsOptions = [
  { value: "Ninguno", label: "Ninguno" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6-10", label: "6-10" },
  { value: "11-15", label: "11-15" },
  { value: "16-20", label: "16-20" }
];

// Motivations
export const motivations = [
  "Cultura",
  "Compañía",
  "Líder",
  "Posición",
  "Sueldo",
  "Prestaciones",
  "Crecimiento",
  "Flexibilidad",
  "Ambiente"
];

// Mexican states
export const mexicanStates = [
  "Aguascalientes",
  "Baja California Norte",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas"
];

// Import complete municipalities data
import { allMunicipalities } from './municipalities-data';

// Create municipality lookup by state
const municipalitiesByState: Record<string, string[]> = {};

// Process all municipalities and group by state
allMunicipalities.forEach((municipality: string) => {
  const parts = municipality.split(', ');
  if (parts.length === 2) {
    const [municipalityName, stateName] = parts;
    if (!municipalitiesByState[stateName]) {
      municipalitiesByState[stateName] = [];
    }
    municipalitiesByState[stateName].push(municipalityName);
  }
});

export function getMunicipalitiesForState(state: string): string[] {
  return municipalitiesByState[state] || [];
}

// Marital statuses
export const maritalStatuses = [
  "Soltera/o",
  "Casada/o",
  "Viudo",
  "Divorciado/a",
  "Separado",
  "Unión libre"
];

// Disability types
export const disabilityTypes = [
  "DISCAPACIDAD LENGUAJE O HABLA",
  "DISCAPACIDAD MOTRIZ",
  "DISCAPACIDAD VISUAL",
  "DISCAPACIDAD AUDITIVA",
  "DISCAPACIDAD INTELECTUAL"
];

// Emergency contact relations
export const emergencyContactRelations = [
  "Cónyuge",
  "Cónyuge divorciado",
  "Hijo",
  "Padres",
  "Hermanos",
  "Otros",
  "Otros parientes"
];

// Dependent relations
export const dependentRelations = [
  "Cónyuge",
  "Cónyuge divorciado",
  "Padre",
  "Madre",
  "Pareja en unión libre",
  "Hijo de pareja en unión libre",
  "Hermano",
  "Hermana",
  "Pareja en unión libre registrada",
  "Hijo",
  "Tutor legal",
  "Tutor",
  "Hijastro",
  "Personas emparentadas"
];
