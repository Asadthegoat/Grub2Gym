export const CANADIAN_DAILY_VALUES = {
  // Based on a 2,000 calorie diet for adults and children 4 years and older.
  // Source: https://www.canada.ca/en/health-canada/services/technical-documents-labelling-requirements/table-daily-values/nutrition-labelling.html
  calories: 2000, // kcal
  total_fat: 75, // g
  saturated_fat: 20, // g
  carbohydrates: 260, // g (Based on 52% of 2000 kcal diet, general recommendation)
  fibre: 28, // g
  sugars: 100, // g
  protein: 50, // g (Standard reference value)
  cholesterol: 300, // mg
  sodium: 2300, // mg
  potassium: 3400, // mg
  calcium: 1300, // mg
  iron: 18, // mg
};

// This maps the keys from the Nutritionix API to the keys in our CANADIAN_DAILY_VALUES object.
export const NUTRITION_MAP: { [key: string]: keyof typeof CANADIAN_DAILY_VALUES } = {
  nf_calories: 'calories',
  nf_total_fat: 'total_fat',
  nf_saturated_fat: 'saturated_fat',
  nf_total_carbohydrate: 'carbohydrates',
  nf_dietary_fiber: 'fibre',
  nf_sugars: 'sugars',
  nf_protein: 'protein',
  nf_cholesterol: 'cholesterol',
  nf_sodium: 'sodium',
  nf_potassium: 'potassium',
  // Note: Calcium and Iron might have different keys or require specific IDs.
  // We'll assume these for now and can adjust if the API returns different fields.
  nf_calcium: 'calcium', 
  nf_iron: 'iron'
};