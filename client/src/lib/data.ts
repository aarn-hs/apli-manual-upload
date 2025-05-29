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
  "Auxiliar de Administración",
  "Auxiliar General",
  "Auxiliar General de Perecederos",
  "Chofer Repartidor",
  "Mecánico",
  "Operador de Equipos de Carga",
  "Recibidor de Mercancía",
  "Jefatura Administrativa",
  "Jefatura de Calidad",
  "Jefatura de Operaciones de Logística",
  "Jefatura de Seguridad",
  "Jefatura de Transportes",
  "Jefatura de trato con proveedores",
  "Subgerencia en Entrenamiento"
];

// Locations
export const locations = [
  "Cedis ecommerce Walmart México",
  "Cedis Walmart BAE Sur - VESTA",
  "Cedis Walmart Chalco",
  "Cedis Walmart Chihuahua",
  "Cedis Walmart Cuautitlán",
  "Cedis Walmart ecommerce Guadalajara",
  "Cedis Walmart Guadalajara",
  "Cedis Walmart Merida",
  "Cedis Walmart Mexicali",
  "Cedis Walmart San Martin Obispo",
  "Cedis Walmart Santa Bárbara",
  "Centro de Distribucion Walmart Villahermosa",
  "Planta de Carnes Walmart Cuautitlán",
  "Walmart - CEDIS Monterrey",
  "Walmart Culiacan Cedis",
  "Walmart eCommerce MTY"
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
  "Baja California",
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
