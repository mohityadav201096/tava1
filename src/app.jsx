import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './lib/reducer.js';
import { storage } from './lib/storage.js';
import { suggestMeals } from './lib/gemini.js';

import { BottomNav }      from './components/BottomNav.jsx';
import { Toast }          from './components/Toast.jsx';

import { HomeScreen }     from './screens/HomeScreen.jsx';
import { SavedScreen }    from './screens/SavedScreen.jsx';
import { SettingsScreen } from './screens/SettingsScreen.jsx';
import { RecipeSheet }    from './screens/RecipeSheet.jsx';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Hydrate from localStorage on mount ─────────────────────────────────
  useEffect(() => {
    const persisted = {
      pantry:      storage.get('pantry',      null),
      saved:       storage.get('saved',       null),
      prefs:       storage.get('prefs',       null),
      feedback:    storage.get('feedback',    null),
      ingredients: storage.get('ingredients', null),
      recentMeals: storage.get('recentMeals', null),
    };
    const patch = {};
    if (persisted.pantry)      patch.pantry      = persisted.pantry;
    if (persisted.saved)       patch.saved        = persisted.saved;
    if (persisted.prefs)       patch.prefs        = persisted.prefs;
    if (persisted.feedback)    patch.feedback     = persisted.feedback;
    if (persisted.ingredients) patch.ingredients  = persisted.ingredients;
    if (persisted.recentMeals) patch.recentMeals  = persisted.recentMeals;
    if (Object.keys(patch).length) dispatch({ type: 'hydrate', value: patch });
  }, []);

  // ── Persist slices on change ────────────────────────────────────────────
  useEffect(() => {
    if (state.prefs.pantryMemory) storage.set('pantry', state.pantry);
    else storage.remove('pantry');
  }, [state.pantry, state.prefs.pantryMemory]);

  useEffect(() => { storage.set('saved',       state.saved);       }, [state.saved]);
  useEffect(() => { storage.set('prefs',        state.prefs);       }, [state.prefs]);
  useEffect(() => { storage.set('feedback',     state.feedback);    }, [state.feedback]);
  useEffect(() => { storage.set('ingredients',  state.ingredients); }, [state.ingredients]);
  useEffect(() => { storage.set('recentMeals',  state.recentMeals); }, [state.recentMeals]);

  // ── Run AI suggestion when generating flips on ──────────────────────────
  useEffect(() => {
    if (!state.generating) return;
    let cancelled = false;
    const start = Date.now();

    (async () => {
      const meals = await suggestMeals({
        ingredients: state.ingredients,
        pantry:      state.pantry,
        filters:     state.filters,
        prefs:       state.prefs,
        feedback:    state.feedback,
        recentMeals: state.prefs.avoidRepeats ? state.recentMeals : [],
      });

      const delay = Math.max(0, 1000 - (Date.now() - start));
      setTimeout(() => {
        if (!cancelled) dispatch({ type: 'doneGenerate', meals });
      }, delay);
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.generating]);

  // ── Auto-dismiss toasts ─────────────────────────────────────────────────
  useEffect(() => {
    if (!state.toast) return;
    const id = setTimeout(() => dispatch({ type: 'clearToast' }), 1800);
    return () => clearTimeout(id);
  }, [state.toast]);

  const goTo       = (screen) => dispatch({ type: 'goto', screen });
  const openRecipe = (meal)   => dispatch({ type: 'openMeal', meal });

  const screenProps = { state, dispatch, goTo, openRecipe };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Desktop nav is rendered inside BottomNav component */}
      <BottomNav active={state.screen} onChange={goTo} />

      {state.screen === 'home'     && <HomeScreen     {...screenProps} />}
      {state.screen === 'saved'    && <SavedScreen    {...screenProps} />}
      {state.screen === 'settings' && <SettingsScreen {...screenProps} />}

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
  );
}
