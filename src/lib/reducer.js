// App-wide state reducer.

export const initialState = {
  screen: 'home',
  ingredients: [],   // empty on first launch — hydrated from localStorage if present
  pantry: [],        // empty on first launch — user builds this up over time
  filters: { diet: 'any', highProtein: false, quick: false, cuisine: 'Mixed' },
  meals: [],
  generating: false,
  feedback: {},
  saved: [],         // empty on first launch — user saves their own meals
  prefs: {
    diet: 'any',           // 'any' | 'veg' | 'non-veg' — lowercase to match UI buttons
    cuisine: 'Mixed',
    household: 2,
    pantryMemory: true,
    avoidRepeats: true,
    quickDefault: false,
  },
  recentMeals: [],      // meal names suggested recently — used to avoid repeats
  pendingGenerate: false,
  toast: null,
  openMeal: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.value };

    case 'goto':
      return { ...state, screen: action.screen, pendingGenerate: action.trigger === 'generate' };

    case 'setIngredients':
      return { ...state, ingredients: action.items };

    case 'addToPantry': {
      const set = new Set(state.pantry);
      action.items.forEach((i) => set.add(i));
      return { ...state, pantry: [...set] };
    }

    case 'removePantry':
      return { ...state, pantry: state.pantry.filter((p) => p !== action.item) };

    case 'setFilters':
      return { ...state, filters: action.filters };

    case 'setFilter':
      return { ...state, filters: { ...state.filters, [action.key]: action.value } };

    case 'clearPantry':
      return { ...state, pantry: [] };

    case 'thumbDown':
      return {
        ...state,
        feedback: { ...state.feedback, [action.meal.name]: 'down' },
        toast: "Got it — won't suggest similar meals",
      };

    case 'generate':
      return { ...state, generating: true, pendingGenerate: false };

    case 'doneGenerate': {
      const newNames = (action.meals || []).map((m) => m.name);
      // Keep last 25 unique meal names to inform avoid-repeats
      const recentMeals = state.prefs.avoidRepeats
        ? [...new Set([...newNames, ...state.recentMeals])].slice(0, 25)
        : state.recentMeals;
      return { ...state, generating: false, meals: action.meals, recentMeals };
    }

    case 'clearRecentMeals':
      return { ...state, recentMeals: [] };

    case 'toggleSave': {
      const exists = state.saved.find((s) => s.name === action.meal.name);
      const saved = exists
        ? state.saved.filter((s) => s.name !== action.meal.name)
        : [action.meal, ...state.saved];
      return {
        ...state,
        saved,
        toast: exists ? 'Removed from saved' : 'Saved to your collection',
      };
    }

    case 'setFeedback':
      return {
        ...state,
        feedback: { ...state.feedback, [action.meal.name]: action.value },
      };

    case 'setPref':
      return { ...state, prefs: { ...state.prefs, [action.key]: action.value } };

    case 'openMeal':
      return { ...state, openMeal: action.meal };

    case 'closeMeal':
      return { ...state, openMeal: null };

    case 'toast':
      return { ...state, toast: action.text };

    case 'clearToast':
      return { ...state, toast: null };

    default:
      return state;
  }
}
