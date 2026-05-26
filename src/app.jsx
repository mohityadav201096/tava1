import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './lib/reducer.js';
import { storage } from './lib/storage.js';
import { suggestMeals } from './lib/gemini.js';

import { BottomNav } from './components/BottomNav.jsx';
import { Toast } from './components/Toast.jsx';

import { HomeScreen } from './screens/HomeScreen.jsx';
import { SuggestionsScreen } from './screens/SuggestionsScreen.jsx';
import { SavedScreen } from './screens/SavedScreen.jsx';
import { SettingsScreen } from './screens/SettingsScreen.jsx';
import { RecipeSheet } from './screens/RecipeSheet.jsx';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Hydrate from localStorage on mount ─────────────────────────────────
  useEffect(() => {
    const persisted = {
      pantry:      storage.get('pantry', null),
      saved:       storage.get('saved', null),
      prefs:       storage.get('prefs', null),
      feedback:    storage.get('feedback', null),
      ingredients: storage.get('ingredients', null),   // remember last used ingredients
      recentMeals: storage.get('recentMeals', null),   // for avoid-repeats
    };
    const patch = {};
    if (persisted.pantry)      patch.pantry = persisted.pantry;
    if (persisted.saved)       patch.saved = persisted.saved;
    if (persisted.prefs)       patch.prefs = persisted.prefs;
    if (persisted.feedback)    patch.feedback = persisted.feedback;
    if (persisted.ingredients) patch.ingredients = persisted.ingredients;
    if (persisted.recentMeals) patch.recentMeals = persisted.recentMeals;
    if (Object.keys(patch).length) dispatch({ type: 'hydrate', value: patch });
  }, []);

  // ── Persist slices on change ────────────────────────────────────────────
  useEffect(() => {
    if (state.prefs.pantryMemory) storage.set('pantry', state.pantry);
    else storage.remove('pantry');
  }, [state.pantry, state.prefs.pantryMemory]);

  useEffect(() => { storage.set('saved', state.saved); }, [state.saved]);
  useEffect(() => { storage.set('prefs', state.prefs); }, [state.prefs]);
  useEffect(() => { storage.set('feedback', state.feedback); }, [state.feedback]);
  useEffect(() => { storage.set('ingredients', state.ingredients); }, [state.ingredients]);
  useEffect(() => { storage.set('recentMeals', state.recentMeals); }, [state.recentMeals]);

  // ── Run AI suggestion when generating flips on ──────────────────────────
  useEffect(() => {
    if (!state.generating) return;
    let cancelled = false;
    const start = Date.now();

    (async () => {
      const meals = await suggestMeals({
        ingredients: state.ingredients,
        pantry: state.pantry,
        filters: state.filters,
        prefs: state.prefs,
        feedback: state.feedback,
        recentMeals: state.prefs.avoidRepeats ? state.recentMeals : [],
      });

      // Hold "thinking" state at least 1s so the animation feels natural
      const delay = Math.max(0, 1000 - (Date.now() - start));
      setTimeout(() => {
        if (!cancelled) dispatch({ type: 'doneGenerate', meals });
      }, delay);
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.generating]);

  // ── Auto-generate when arriving at Suggestions screen empty ────────────
  useEffect(() => {
    if (state.screen === 'suggestions' && state.meals.length === 0 && !state.generating) {
      dispatch({ type: 'generate' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen]);

  // ── Auto-dismiss toasts ─────────────────────────────────────────────────
  useEffect(() => {
    if (!state.toast) return;
    const id = setTimeout(() => dispatch({ type: 'clearToast' }), 1800);
    return () => clearTimeout(id);
  }, [state.toast]);

  const goTo = (screen, opts = {}) => dispatch({ type: 'goto', screen, ...opts });
  const openRecipe = (meal) => dispatch({ type: 'openMeal', meal });

  const screenProps = { state, dispatch, goTo, openRecipe };

  return (
    <div className="app-shell">
      <div className="relative h-full" style={{ minHeight: 'inherit' }}>
        {state.screen === 'home'        && <HomeScreen        {...screenProps} />}
        {state.screen === 'suggestions' && <SuggestionsScreen {...screenProps} />}
        {state.screen === 'saved'       && <SavedScreen       {...screenProps} />}
        {state.screen === 'settings'    && <SettingsScreen    {...screenProps} />}

        <BottomNav active={state.screen} onChange={(id) => goTo(id)} />

        {state.openMeal && (
          <RecipeSheet
            meal={state.openMeal}
            onClose={() => dispatch({ type: 'closeMeal' })}
            saved={!!state.saved.find((s) => s.name === state.openMeal.name)}
            onSave={(m) => dispatch({ type: 'toggleSave', meal: m })}
          />
        )}

        {state.toast && <Toast text={state.toast} />}
      </div>
    </div>
  );
}
