// Local meal library + fallback scorer.
// Used when Gemini API is unavailable or unconfigured.

export const MEAL_LIBRARY = [
  // ── North Indian ──────────────────────────────────────────────────────────
  {
    name: 'Paneer Bhurji', cook: '18 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Quick', 'High Protein'],
    matches: ['paneer', 'onion', 'tomato'], missing: ['coriander'], glyph: '◐',
    reason: 'Uses your paneer, onion and tomato — ready in under 20 minutes.',
    steps: ['Crumble paneer, set aside.', 'Sauté onion till translucent. Add tomato, green chilli, turmeric, garam masala.', 'Fold in paneer. Cook 3 min on medium.', 'Finish with fresh coriander. Serve with roti.'],
    ingredients: ['200g paneer', '1 large onion, finely chopped', '2 tomatoes, chopped', '1 green chilli', '½ tsp turmeric', '1 tsp garam masala', 'Salt, oil', 'Coriander to finish'],
    yt: 'Paneer Bhurji quick recipe', ytUrl: 'https://www.youtube.com/results?search_query=Paneer+Bhurji+quick+recipe',
  },
  {
    name: 'Chana Masala', cook: '35 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['High Protein'],
    matches: ['tomato', 'onion'], missing: ['chickpeas', 'chana masala powder'], glyph: '◎',
    reason: 'A protein-rich classic — your onion-tomato base is already the hardest part.',
    steps: ['If using dried chickpeas, pressure cook 4–5 whistles. If canned, drain and rinse.', 'Sauté onions till golden. Add ginger-garlic paste, tomatoes, chana masala, amchur.', 'Simmer 5 min till oil separates. Add chickpeas + ½ cup water.', 'Cook 10 min on low. Mash a few chickpeas to thicken. Finish with fresh coriander.'],
    ingredients: ['400g chickpeas (or 1 can)', '2 onions, finely chopped', '2 tomatoes', '1 tbsp ginger-garlic paste', '2 tsp chana masala', '½ tsp amchur', 'Salt, oil, cumin seeds'],
    yt: 'Punjabi Chana Masala authentic recipe', ytUrl: 'https://www.youtube.com/results?search_query=Punjabi+Chana+Masala+authentic+recipe',
  },
  {
    name: 'Palak Khichdi', cook: '22 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Quick', 'High Protein', 'One-pot'],
    matches: ['rice', 'spinach'], missing: ['moong dal'], glyph: '◑',
    reason: 'Wholesome one-pot using your spinach and rice — ready in 22 minutes.',
    steps: ['Wash rice and moong dal. Roughly chop spinach.', 'Pressure cook rice, dal, spinach with turmeric, salt and 2.5 cups water — 3 whistles.', 'In a small pan, heat ghee. Add cumin, hing, ginger. Pour tadka over khichdi.', 'Mix well. Serve with a dollop of ghee and pickle.'],
    ingredients: ['½ cup rice', '½ cup moong dal', '2 cups spinach, chopped', '1 tbsp ghee', '1 tsp cumin seeds', '½ tsp hing', '1 tsp ginger, grated', 'Salt, turmeric'],
    yt: 'Palak Khichdi healthy one pot recipe', ytUrl: 'https://www.youtube.com/results?search_query=Palak+Khichdi+healthy+one+pot+recipe',
  },
  {
    name: 'Aloo Gobi', cook: '30 min', protein: 'Low', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Comfort'],
    matches: ['potato'], missing: ['cauliflower', 'kasuri methi'], glyph: '✺',
    reason: 'A dry sabzi using your potato — pairs beautifully with roti or paratha.',
    steps: ['Cube potato and cauliflower into similar-sized pieces.', 'Heat oil, add cumin, let it splutter. Add ginger and fry 30 sec.', 'Add potato, cook 5 min. Add cauliflower, turmeric, coriander powder, salt.', 'Cover and cook on low 15 min, stirring twice. Finish with kasuri methi and garam masala.'],
    ingredients: ['2 potatoes, cubed', '1 small cauliflower', '1 tsp ginger, grated', '1 tsp cumin seeds', '1 tsp turmeric', '1 tbsp coriander powder', '1 tsp garam masala', 'Kasuri methi, salt, oil'],
    yt: 'Dhaba style Aloo Gobi dry sabzi recipe', ytUrl: 'https://www.youtube.com/results?search_query=Dhaba+style+Aloo+Gobi+dry+sabzi+recipe',
  },
  {
    name: 'Veg Pulao', cook: '28 min', protein: 'Med', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Quick', 'One-pot'],
    matches: ['rice', 'onion'], missing: ['carrot', 'peas'], glyph: '❋',
    reason: 'One-pot meal using your rice and onion — fragrant and filling.',
    steps: ['Soak basmati rice 15 min. Drain.', 'In a heavy pot, heat ghee. Add whole spices (bay leaf, cardamom, cloves, cinnamon). Add onions, fry till golden.', 'Add mixed veg, sauté 2 min. Add rice and stir gently.', 'Add 1.75 cups water, salt, mint. Bring to boil, cover, cook 12 min on low. Rest 5 min.'],
    ingredients: ['1 cup basmati rice', '1 onion, thinly sliced', 'Mixed veg (carrot, peas, beans)', 'Whole garam masala', '2 tbsp ghee or oil', 'Fresh mint', 'Salt'],
    yt: 'Restaurant style Veg Pulao recipe', ytUrl: 'https://www.youtube.com/results?search_query=Restaurant+style+Veg+Pulao+recipe',
  },
  {
    name: 'Dal Tadka', cook: '30 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['High Protein', 'Comfort'],
    matches: ['tomato', 'onion'], missing: ['toor dal'], glyph: '◉',
    reason: 'A comforting classic using your onion and tomato — pairs with rice or roti.',
    steps: ['Pressure cook toor dal with turmeric and salt — 3 whistles.', 'Heat ghee in a pan. Add cumin, let it pop. Add onion, cook till golden.', 'Add tomato, ginger-garlic paste, red chilli powder. Cook till oil separates.', 'Add this tadka to dal. Simmer 5 min. Add lemon juice and coriander. Serve hot.'],
    ingredients: ['¾ cup toor dal', '1 onion, finely chopped', '2 tomatoes', '1 tsp cumin seeds', '1 tbsp ghee + 1 tsp oil', '1 tsp ginger-garlic paste', '½ tsp red chilli powder', 'Lemon, coriander, salt, turmeric'],
    yt: 'Dal Tadka dhaba style authentic recipe', ytUrl: 'https://www.youtube.com/results?search_query=Dal+Tadka+dhaba+style+authentic+recipe',
  },
  {
    name: 'Aloo Paratha', cook: '25 min', protein: 'Med', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Comfort'],
    matches: ['potato', 'atta'], missing: ['butter', 'green chilli'], glyph: '◓',
    reason: 'Your potato and atta are all you need — a perfect stuffed paratha.',
    steps: ['Boil and mash potatoes. Mix with finely chopped green chilli, ginger, coriander, cumin, salt.', 'Make a soft dough with atta, water and a pinch of salt. Divide into balls.', 'Roll a ball flat, place filling in centre, seal edges and roll again gently.', 'Cook on hot tawa with ghee or butter till golden brown on both sides. Serve with curd.'],
    ingredients: ['2 large potatoes, boiled', '2 cups atta (whole wheat)', '1 green chilli, finely chopped', '½ tsp cumin seeds', 'Fresh coriander', 'Ghee or butter for cooking', 'Salt, chaat masala'],
    yt: 'Aloo Paratha perfect stuffed recipe', ytUrl: 'https://www.youtube.com/results?search_query=Aloo+Paratha+perfect+stuffed+recipe',
  },
  {
    name: 'Matar Paneer', cook: '30 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['High Protein'],
    matches: ['paneer', 'tomato', 'onion'], missing: ['peas'], glyph: '◐',
    reason: 'Your paneer, onion and tomato make the base — just grab some peas.',
    steps: ['Lightly fry paneer cubes till golden. Set aside.', 'Blend tomatoes, onion, cashews (optional) into a smooth paste.', 'Cook paste in oil with ginger-garlic, spices. Cook till oil separates.', 'Add peas and ¼ cup water. Simmer 8 min. Add paneer. Cook 3 min more. Finish with cream if available.'],
    ingredients: ['200g paneer, cubed', '1 cup peas (fresh or frozen)', '2 tomatoes', '1 onion', '1 tsp ginger-garlic paste', '1 tsp kashmiri red chilli', 'Garam masala, cream (optional), salt, oil'],
    yt: 'Matar Paneer restaurant style recipe', ytUrl: 'https://www.youtube.com/results?search_query=Matar+Paneer+restaurant+style+recipe',
  },
  {
    name: 'Rajma', cook: '45 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['High Protein', 'Comfort'],
    matches: ['tomato', 'onion'], missing: ['rajma', 'rajma masala'], glyph: '◎',
    reason: 'Your onion-tomato base is the soul of this dish — rich and protein-packed.',
    steps: ['Soak rajma overnight. Pressure cook 6–8 whistles till very soft.', 'Sauté onion till golden. Add ginger-garlic paste, tomatoes, rajma masala, coriander powder.', 'Cook masala 8 min till oil separates. Add cooked rajma with liquid.', 'Simmer 15 min till gravy thickens. Mash a few beans. Serve with rice.'],
    ingredients: ['1 cup rajma, soaked overnight', '2 onions, finely chopped', '2 tomatoes', '1 tbsp ginger-garlic paste', '1.5 tsp rajma masala', '1 tsp cumin', 'Butter, salt, coriander'],
    yt: 'Rajma Chawal authentic Punjabi recipe', ytUrl: 'https://www.youtube.com/results?search_query=Rajma+Chawal+authentic+Punjabi+recipe',
  },
  {
    name: 'Baingan Bharta', cook: '35 min', protein: 'Low', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Comfort', 'Light'],
    matches: ['tomato', 'onion'], missing: ['eggplant (baingan)'], glyph: '◑',
    reason: 'Smoky and comforting — your onion and tomato do all the work once the baingan is roasted.',
    steps: ['Roast whole baingan over direct flame or in oven at 220°C till skin chars and flesh is soft. Cool, peel, mash.', 'Sauté onion till golden. Add ginger-garlic, tomatoes, green chilli, turmeric, coriander powder.', 'Add mashed baingan. Cook 8 min, stirring. Season with salt, garam masala.', 'Finish with fresh coriander and a drizzle of mustard oil. Serve with roti.'],
    ingredients: ['1 large baingan (eggplant)', '1 onion, finely chopped', '2 tomatoes, chopped', '1 tsp ginger-garlic paste', '1 green chilli', 'Mustard oil, turmeric, garam masala, coriander'],
    yt: 'Baingan Bharta smoky authentic recipe', ytUrl: 'https://www.youtube.com/results?search_query=Baingan+Bharta+smoky+authentic+recipe',
  },
  {
    name: 'Methi Thepla', cook: '25 min', protein: 'Med', cuisine: 'North Indian',
    diet: 'Veg', tags: [],
    matches: ['atta'], missing: ['methi leaves', 'yogurt'], glyph: '◓',
    reason: 'Your atta is all you need to start — these travel-friendly flatbreads are hard to resist.',
    steps: ['Mix atta with finely chopped methi, turmeric, chilli powder, cumin, ajwain, salt and yogurt.', 'Knead into a soft dough, adding water as needed. Rest 10 min.', 'Divide into balls. Roll each thin (thinner than roti).', 'Cook on medium tawa with a little oil till golden spots appear on both sides. Stack and keep warm.'],
    ingredients: ['2 cups atta', '1 cup methi leaves, finely chopped', '¼ cup yogurt', 'Turmeric, red chilli, ajwain, cumin', 'Salt, oil'],
    yt: 'Soft Methi Thepla Gujarati recipe', ytUrl: 'https://www.youtube.com/results?search_query=Soft+Methi+Thepla+Gujarati+recipe',
  },

  // ── Egg / Non-Veg ────────────────────────────────────────────────────────
  {
    name: 'Egg Bhurji', cook: '12 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Egg', tags: ['Quick', 'High Protein'],
    matches: ['onion', 'tomato'], missing: ['eggs'], glyph: '◐',
    reason: 'Fastest protein hit using your onion-tomato — done in 12 minutes flat.',
    steps: ['Sauté onion in oil till translucent. Add tomato, green chilli, turmeric, cumin.', 'Cook till tomatoes soften, about 3 min.', 'Beat eggs. Pour into pan and scramble gently on medium-low heat.', 'Finish with fresh coriander and a squeeze of lemon. Serve with bread or roti.'],
    ingredients: ['4 eggs', '1 onion, finely chopped', '1 tomato, chopped', '1 green chilli', '½ tsp cumin', 'Turmeric, salt, oil, coriander'],
    yt: 'Mumbai Egg Bhurji street style recipe', ytUrl: 'https://www.youtube.com/results?search_query=Mumbai+Egg+Bhurji+street+style+recipe',
  },
  {
    name: 'Chicken Curry', cook: '40 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Non-Veg', tags: ['High Protein', 'Comfort'],
    matches: ['onion', 'tomato'], missing: ['chicken', 'yogurt'], glyph: '◎',
    reason: 'Your onion-tomato base is the heart of this — just grab chicken and it comes together perfectly.',
    steps: ['Marinate chicken with yogurt, turmeric, chilli powder, ginger-garlic paste. Rest 15 min.', 'Cook onions till deep golden. Add ginger-garlic, spices, tomatoes. Cook till oil separates.', 'Add chicken. Sear 5 min on high. Add water, cover and simmer 20 min.', 'Check chicken is cooked through. Finish with garam masala and coriander.'],
    ingredients: ['500g chicken (bone-in pieces)', '2 onions', '2 tomatoes', '½ cup yogurt', '1 tbsp ginger-garlic paste', 'Turmeric, red chilli, garam masala, coriander powder', 'Salt, oil, fresh coriander'],
    yt: 'Chicken Curry simple home style Indian recipe', ytUrl: 'https://www.youtube.com/results?search_query=Chicken+Curry+simple+home+style+Indian+recipe',
  },
  {
    name: 'Egg Curry', cook: '25 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Egg', tags: ['High Protein', 'Quick'],
    matches: ['onion', 'tomato'], missing: ['eggs'], glyph: '◑',
    reason: 'Your onion-tomato masala becomes a rich egg curry in under 30 minutes.',
    steps: ['Boil eggs 8 min. Peel, make shallow cuts all over.', 'Sauté onions golden. Add ginger-garlic, tomatoes, chilli powder, coriander, turmeric. Cook till thick.', 'Add ½ cup water. Lightly fry boiled eggs in oil first (optional) then add to gravy.', 'Simmer 8 min. Finish with garam masala and coriander. Serve with rice or roti.'],
    ingredients: ['4 eggs', '1 large onion', '2 tomatoes', '1 tsp ginger-garlic paste', 'Red chilli powder, coriander powder, turmeric, garam masala', 'Salt, oil, coriander'],
    yt: 'Egg Curry simple Indian home recipe', ytUrl: 'https://www.youtube.com/results?search_query=Egg+Curry+simple+Indian+home+recipe',
  },

  // ── South Indian ──────────────────────────────────────────────────────────
  {
    name: 'Tomato Rasam', cook: '20 min', protein: 'Low', cuisine: 'South Indian',
    diet: 'Veg', tags: ['Quick', 'Light'],
    matches: ['tomato'], missing: ['rasam powder', 'tamarind'], glyph: '◉',
    reason: 'A warming, light companion for your rice — uses just your tomatoes and pantry spices.',
    steps: ['Crush tomatoes by hand in a bowl with tamarind water (or lemon juice).', 'Bring to a simmer with rasam powder, turmeric, pepper, salt and 2 cups water.', 'In another pan, heat oil. Splutter mustard seeds, add cumin, curry leaves, dry red chilli, hing.', 'Pour tadka over rasam. Simmer 5 min. Serve over hot rice or as a soup.'],
    ingredients: ['3 ripe tomatoes', 'Lemon-size tamarind (soaked) or 2 tbsp lemon juice', '1.5 tsp rasam powder', 'Mustard seeds, cumin, curry leaves, dry red chilli', 'Hing, turmeric, salt, oil'],
    yt: 'Authentic South Indian Tomato Rasam recipe', ytUrl: 'https://www.youtube.com/results?search_query=Authentic+South+Indian+Tomato+Rasam+recipe',
  },
  {
    name: 'Masala Dosa', cook: '40 min', protein: 'Med', cuisine: 'South Indian',
    diet: 'Veg', tags: [],
    matches: ['potato'], missing: ['dosa batter', 'mustard seeds'], glyph: '◌',
    reason: 'Your potatoes are perfect for the aloo masala filling inside a crispy dosa.',
    steps: ['Boil potatoes. Peel and roughly mash (keep some texture).', 'Heat oil, splutter mustard seeds. Add onion, curry leaves, green chilli, turmeric.', 'Mix in potatoes. Add salt, lemon juice. The filling is ready.', 'Spread thin dosa batter on a very hot, lightly oiled tawa. Cook till crisp. Place filling in centre, fold and serve with chutney.'],
    ingredients: ['3 boiled potatoes', 'Dosa batter (store-bought or made ahead)', '1 onion, sliced', 'Mustard seeds, curry leaves, green chilli', 'Turmeric, lemon juice, salt, oil'],
    yt: 'Crispy Masala Dosa with aloo filling recipe', ytUrl: 'https://www.youtube.com/results?search_query=Crispy+Masala+Dosa+with+aloo+filling+recipe',
  },
  {
    name: 'Sambar', cook: '35 min', protein: 'High', cuisine: 'South Indian',
    diet: 'Veg', tags: ['High Protein', 'Comfort'],
    matches: ['tomato'], missing: ['toor dal', 'sambar powder', 'tamarind'], glyph: '◉',
    reason: 'A nourishing South Indian staple — your tomatoes give it the perfect tang.',
    steps: ['Pressure cook toor dal with turmeric till soft (3 whistles). Mash.', 'In a pot, boil tamarind water with sambar powder, tomatoes and vegetables 10 min.', 'Add mashed dal. Simmer 10 min till flavours blend.', 'Temper with mustard, curry leaves, dry chilli, hing. Pour over sambar. Serve with rice or idli.'],
    ingredients: ['½ cup toor dal', '2 tomatoes', 'Tamarind (lemon-size)', '2 tsp sambar powder', 'Drumstick, onion, or any veg', 'Mustard seeds, curry leaves, hing, salt, oil'],
    yt: 'Easy Sambar for rice authentic South Indian recipe', ytUrl: 'https://www.youtube.com/results?search_query=Easy+Sambar+for+rice+authentic+South+Indian+recipe',
  },
  {
    name: 'Curd Rice', cook: '15 min', protein: 'Med', cuisine: 'South Indian',
    diet: 'Veg', tags: ['Quick', 'Light', 'Comfort'],
    matches: ['rice'], missing: ['yogurt', 'pomegranate seeds'], glyph: '◌',
    reason: 'Your rice turns into this cooling, calming South Indian classic in 15 minutes.',
    steps: ['Cook rice till slightly overcooked and sticky. Cool for 5 min.', 'Mix in yogurt, salt, a little milk if needed for creaminess.', 'Temper mustard seeds, green chilli, ginger, curry leaves, hing in oil.', 'Mix tadka into rice. Top with pomegranate seeds or grapes. Serve chilled or at room temp.'],
    ingredients: ['1 cup cooked rice', '¾ cup thick yogurt', 'Mustard seeds, green chilli, ginger, curry leaves', 'Hing, salt, oil', 'Pomegranate seeds or grapes to garnish'],
    yt: 'Curd Rice Thayir Sadam South Indian recipe', ytUrl: 'https://www.youtube.com/results?search_query=Curd+Rice+Thayir+Sadam+South+Indian+recipe',
  },

  // ── Breakfast / Snack ─────────────────────────────────────────────────────
  {
    name: 'Poha', cook: '15 min', protein: 'Med', cuisine: 'Breakfast',
    diet: 'Veg', tags: ['Quick', 'Light'],
    matches: ['onion'], missing: ['poha (flattened rice)', 'peanuts'], glyph: '◑',
    reason: 'Your onion is the main flavour here — a light, quick breakfast or snack.',
    steps: ['Rinse poha under water for 30 sec till it softens. Do not soak.', 'Heat oil, splutter mustard seeds. Add peanuts, fry 1 min.', 'Add onion, green chilli, curry leaves. Sauté 3 min.', 'Add poha, turmeric, salt. Toss gently on low heat 2 min. Squeeze lemon over. Top with sev and coriander.'],
    ingredients: ['2 cups poha (flattened rice)', '1 onion, finely chopped', '2 tbsp roasted peanuts', 'Mustard seeds, curry leaves, green chilli', 'Turmeric, lemon, sev, salt, oil'],
    yt: 'Poha perfect breakfast recipe Indore style', ytUrl: 'https://www.youtube.com/results?search_query=Poha+perfect+breakfast+recipe+Indore+style',
  },
  {
    name: 'Upma', cook: '20 min', protein: 'Med', cuisine: 'Breakfast',
    diet: 'Veg', tags: ['Quick', 'Light'],
    matches: ['onion'], missing: ['sooji (semolina)', 'cashews'], glyph: '◓',
    reason: 'Your onion is the key — this South Indian breakfast staple is ready in 20 minutes.',
    steps: ['Dry roast sooji on medium till fragrant (3 min). Set aside.', 'Heat oil, add mustard, cumin, urad dal, cashews. Add onion, green chilli, ginger. Sauté 3 min.', 'Add 2 cups boiling water and salt. Bring to a rolling boil.', 'Add sooji slowly, stirring constantly to prevent lumps. Cover, cook 3 min on low. Fluff with fork. Serve with chutney.'],
    ingredients: ['1 cup sooji (semolina)', '1 onion, finely chopped', 'Mustard seeds, cumin, urad dal, cashews', 'Green chilli, ginger', '2 cups water, salt, oil, coriander'],
    yt: 'Upma perfect no-lumps recipe easy breakfast', ytUrl: 'https://www.youtube.com/results?search_query=Upma+perfect+no-lumps+recipe+easy+breakfast',
  },
  {
    name: 'Moong Dal Chilla', cook: '20 min', protein: 'High', cuisine: 'Breakfast',
    diet: 'Veg', tags: ['Quick', 'High Protein', 'Light'],
    matches: ['onion', 'tomato'], missing: ['moong dal', 'green chilli'], glyph: '◑',
    reason: 'A protein-packed savoury pancake using your onion and tomato — great as a snack or light meal.',
    steps: ['Soak moong dal 4 hours (or overnight). Drain. Blend with ginger, green chilli and a little water into thick batter.', 'Add finely chopped onion, tomato, coriander, salt to batter.', 'Heat a non-stick tawa, pour a ladle of batter, spread thin like a dosa.', 'Drizzle oil around edges. Cook till bottom is golden. Flip and cook 1 min. Serve with mint chutney.'],
    ingredients: ['1 cup moong dal, soaked 4h', '1 onion, finely chopped', '1 tomato, finely chopped', '1 green chilli, 1 tsp ginger', 'Fresh coriander, salt, oil'],
    yt: 'Moong Dal Chilla high protein breakfast recipe', ytUrl: 'https://www.youtube.com/results?search_query=Moong+Dal+Chilla+high+protein+breakfast+recipe',
  },
  {
    name: 'Bread Pakora', cook: '20 min', protein: 'Med', cuisine: 'Street Food',
    diet: 'Veg', tags: ['Quick'],
    matches: ['potato'], missing: ['bread', 'besan'], glyph: '◌',
    reason: 'Your potato makes the perfect stuffing for this street-food favourite — crispy and satisfying.',
    steps: ['Boil and mash potato with green chilli, chaat masala, salt and coriander.', 'Make besan batter: mix besan, ajwain, salt, turmeric with water till smooth (like dosa batter).', 'Spread potato filling between two bread slices. Cut diagonally.', 'Dip sandwich in batter, deep fry till golden and crisp. Serve with mint and tamarind chutney.'],
    ingredients: ['2 potatoes, boiled', '4 bread slices', '1 cup besan', 'Ajwain, turmeric, chaat masala, green chilli', 'Salt, oil for frying, coriander'],
    yt: 'Bread Pakora stuffed street style recipe', ytUrl: 'https://www.youtube.com/results?search_query=Bread+Pakora+stuffed+street+style+recipe',
  },
  {
    name: 'Spinach Dal', cook: '30 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['High Protein', 'Light'],
    matches: ['spinach', 'tomato'], missing: ['masoor dal'], glyph: '◑',
    reason: 'Your spinach and tomato come together in this iron-rich, protein-packed dal.',
    steps: ['Pressure cook masoor dal with turmeric and salt (2 whistles).', 'Sauté onion, add ginger-garlic, tomato. Cook till thick. Add spinach and wilt 2 min.', 'Add cooked dal to the pan. Mix well, simmer 8 min.', 'Temper cumin and dry chilli in ghee. Pour over dal. Serve with rice or roti.'],
    ingredients: ['¾ cup masoor dal', '2 cups spinach, chopped', '1 tomato', '1 small onion', 'Ghee, cumin, ginger-garlic', 'Turmeric, red chilli, salt, lemon'],
    yt: 'Spinach Dal palak masoor healthy recipe', ytUrl: 'https://www.youtube.com/results?search_query=Spinach+Dal+palak+masoor+healthy+recipe',
  },
];

export const SAMPLE_SAVED = [
  MEAL_LIBRARY[0], MEAL_LIBRARY[4], MEAL_LIBRARY[11], MEAL_LIBRARY[14],
];

export const SUGGESTED_CHIPS = [
  'Onion', 'Tomato', 'Potato', 'Paneer', 'Rice', 'Atta', 'Spinach',
  'Eggs', 'Chicken', 'Ginger', 'Garlic', 'Dal', 'Yogurt', 'Peas',
];

export function parseIngredients(text) {
  return text
    .split(/[,\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function toText(arr) {
  return arr.join(', ');
}

/**
 * Local-only scorer — used as fallback when Gemini is unavailable.
 * Ranks by ingredient overlap, applies filters, avoids repeats.
 */
export function pickMealsLocal(ingredients, filters, feedback = {}, recentMeals = []) {
  const items = (ingredients || []).map((s) => s.toLowerCase().trim());
  const { diet = [], goals = [], cuisine = 'Any' } = filters || {};

  // Disliked meal names
  const disliked = new Set(
    Object.entries(feedback || {}).filter(([, v]) => v === 'down').map(([n]) => n)
  );
  const recent = new Set(recentMeals || []);

  let pool = MEAL_LIBRARY.slice();

  // Apply filters
  if (diet.length) pool = pool.filter((m) => diet.includes(m.diet));
  if (cuisine && cuisine !== 'Any') pool = pool.filter((m) => m.cuisine === cuisine);
  if (goals.includes('High Protein')) pool = pool.filter((m) => m.protein === 'High');
  if (goals.includes('Quick (<30 min)')) pool = pool.filter((m) => m.tags.includes('Quick'));

  // Score each meal — ONLY suggest meals where at least 1 available ingredient is a core match
  pool = pool.map((m) => {
    const coreMatches = m.matches.filter((mm) =>
      items.some((it) => it.includes(mm.toLowerCase()) || mm.toLowerCase().includes(it))
    );
    const matchCount = coreMatches.length;

    // Penalise disliked and recently seen meals
    const penalty = disliked.has(m.name) ? -5 : recent.has(m.name) ? -2 : 0;

    return { ...m, _score: matchCount + Math.random() * 0.3 + penalty, _coreMatches: matchCount };
  });

  pool.sort((a, b) => b._score - a._score);

  // Prefer meals with at least 1 core match; only fall back to zero-match meals if pool is tiny
  const withMatch = pool.filter((m) => m._coreMatches > 0);
  const withoutMatch = pool.filter((m) => m._coreMatches === 0);
  const ranked = [...withMatch, ...withoutMatch];

  let result = ranked.slice(0, 5);
  if (result.length < 5) {
    const fill = MEAL_LIBRARY
      .filter((m) => !result.find((r) => r.name === m.name))
      .slice(0, 5 - result.length);
    result = [...result, ...fill];
  }
  return result;
}

// Deterministic warm hue from a name — used by MealArt.
export function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
