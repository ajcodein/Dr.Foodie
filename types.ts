export interface NutritionFacts {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
}

export interface VitaminMineral {
  name: string;
  amount: string;
  percentDV: string;
}

export interface HealthierAlternative {
  name: string;
  reason: string;
}

export interface FoodInfo {
  foodName: string;
  description: string;
  imageQuery: string;
  imageBase64?: string;
  nutritionFacts: NutritionFacts;
  vitaminsAndMinerals: VitaminMineral[];
  healthBenefits: string[];
  overuseWarnings: string[];
  healthierAlternatives: HealthierAlternative[];
}

export interface ComparisonFoodInfo {
    foodName: string;
    imageQuery: string;
    imageBase64?: string;
    nutritionFacts: Pick<NutritionFacts, 'calories' | 'protein' | 'carbohydrates' | 'fat'>;
}