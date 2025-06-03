const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions?: string;
  strCategory?: string;
  strArea?: string;
  strYoutube?: string; 
  [key: string]: string | undefined | null; 
}

interface ApiResponse {
  meals: Meal[] | null; 
}

export const searchRecipesByName = async (query: string): Promise<Meal[]> => {
  if (!query.trim()) {
    return []; 
  }
  try {
    const response = await fetch(`${API_BASE_URL}search.php?s=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse = await response.json();
    return data.meals || []; 
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error; 
  }
};

export const getRecipeDetailsById = async (id: string): Promise<Meal | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    throw error;
  }
};

export const searchRecipesByIngredient = async (ingredient: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}filter.php?i=${encodeURIComponent(ingredient)}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
     }
    const data: ApiResponse = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error fetching recipes by ingredient:", error);
    throw error;
  }
};