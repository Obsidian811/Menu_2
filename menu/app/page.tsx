"use client";

import React, { useState, useEffect, useCallback } from "react";

// --- (TYPES AND CONFIGURATION) ---

const TARGET_LANG_MAP = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  gu: "Gujarati (Gujarati script)",
  mr: "Marathi (Devanagari script)",
};

type Dish = { name: string; price: string; description: string; };
type Category = { name: string; dishes: Dish[]; };
type Page = "home" | "starters" | "maincourse" | "drinks" | "desserts";
type LangCode = "en" | "hi" | "gu" | "mr";
type Stage = "restaurant" | "advertisement" | "loading" | "menu";

type TranslationSet = {
  RESTAURANT_NAME: string;
  WELCOME: string;
  AD_HEADING: string;
  AD_SUBTEXT: string;
  NAV_TITLE: string;
  SLOGAN: string;
  BACK: string;
  MENU_CATEGORIES: {
    STARTERS: string;
    MAIN_COURSE: string;
    DRINKS: string;
    DESSERTS: string;
  };
  menu: {
    starters: Category[];
    maincourse: Category[];
    drinks: Category[];
    desserts: Category[];
  };
};

// --- ( ENGLISH SOURCE DATA ) ---
const ENGLISH_SOURCE_DATA: TranslationSet = {
  RESTAURANT_NAME: "The Golden Spoon",
  WELCOME: "Welcome",
  AD_HEADING: "Try Our New Winter Menu!",
  AD_SUBTEXT: "Half-price appetizers every weekday from 4-6 PM.",
  NAV_TITLE: "Language",
  SLOGAN: "Tap a category to explore our menu.",
  BACK: "Back",
  MENU_CATEGORIES: {
    STARTERS: "Starters",
    MAIN_COURSE: "Main Course",
    DRINKS: "Drinks",
    DESSERTS: "Desserts",
  },
  menu: {
    starters: [
      {
        name: "Indian",
        dishes: [
          { name: "Paneer Tikka", price: "₹280", description: "Marinated cottage cheese grilled to perfection." },
          { name: "Samosa Chaat", price: "₹150", description: "Crushed samosa with chickpeas, yogurt, and chutneys." },
        ],
      },
      {
        name: "Chinese",
        dishes: [
          { name: "Veg Spring Rolls", price: "₹220", description: "Crispy fried rolls stuffed with vegetables." },
          { name: "Chilli Chicken Dry", price: "₹320", description: "Spicy chicken tossed with peppers and onions." },
        ],
      },
    ],
    maincourse: [
      {
        name: "Indian",
        dishes: [
          { name: "Butter Chicken", price: "₹450", description: "Classic chicken in a creamy tomato gravy." },
          { name: "Dal Makhani", price: "₹350", description: "Slow-cooked black lentils with butter and cream." },
        ],
      },
      {
        name: "Italian",
        dishes: [
          { name: "Margherita Pizza", price: "₹380", description: "Classic pizza with tomatoes, mozzarella, and basil." },
          { name: "Alfredo Pasta", price: "₹400", description: "Pasta in a creamy white sauce with mushrooms." },
        ],
      },
    ],
    drinks: [
      {
        name: "Beer",
        dishes: [
          { name: "Kingfisher (Pint)", price: "₹180", description: "Domestic Lager" },
          { name: "Budweiser (Pint)", price: "₹220", description: "American Lager" },
        ],
      },
      {
        name: "Soft Drinks",
        dishes: [
          { name: "Coke / Sprite / Fanta", price: "₹80", description: "300ml Can" },
          { name: "Fresh Lime Soda", price: "₹120", description: "Sweet, salted, or mixed." },
        ],
      },
    ],
    desserts: [
      {
        name: "Classics",
        dishes: [
          { name: "Chocolate Lava Cake", price: "₹250", description: "Warm cake with a molten chocolate center." },
          { name: "Sizzling Brownie", price: "₹300", description: "Brownie with ice cream on a hot sizzler plate." },
        ],
      },
    ],
  },
};

// --- (TRANSLATION SERVICE - NOW PURELY IN-FILE) ---

const translateMenu = async (sourceData: TranslationSet, targetLang: LangCode): Promise<TranslationSet> => {
  // FIX: Explicitly adding the apiKey query parameter allows the runtime 
  // environment to correctly inject the authentication token, resolving 401 errors.
  const apiKey = ""; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      RESTAURANT_NAME: { type: "STRING" },
      WELCOME: { type: "STRING" },
      AD_HEADING: { type: "STRING" },
      AD_SUBTEXT: { type: "STRING" },
      NAV_TITLE: { type: "STRING" },
      SLOGAN: { type: "STRING" },
      BACK: { type: "STRING" },
      MENU_CATEGORIES: {
        type: "OBJECT",
        properties: {
          STARTERS: { type: "STRING" },
          MAIN_COURSE: { type: "STRING" },
          DRINKS: { type: "STRING" },
          DESSERTS: { type: "STRING" },
        },
      },
      menu: {
        type: "OBJECT",
        properties: {
          starters: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                dishes: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      price: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                  },
                },
              },
            },
          },
          maincourse: { type: "ARRAY", items: { type: "OBJECT" } },
          drinks: { type: "ARRAY", items: { type: "OBJECT" } },
          desserts: { type: "ARRAY", items: { type: "OBJECT" } },
        },
      },
    },
    required: ["RESTAURANT_NAME", "menu"],
  };

  const systemPrompt = `You are a professional restaurant menu translator. Translate the entire provided JSON object, which represents a restaurant menu, into the target language: ${TARGET_LANG_MAP[targetLang]}. You must preserve the JSON structure exactly as provided. Only translate the text values (strings). Do not translate the price values (e.g., '₹280') and ensure they remain strings.`;
  const userQuery = JSON.stringify(sourceData);

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  };

  // Exponential backoff for 3 retries
  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        // The API key is now in the URL, so we keep the headers clean
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Log the failed attempt number and the status
        console.error(`Attempt ${i + 1} failed with status: ${response.status}`);
        
        // Throw specific error based on status for graceful handling in the caller
        if (response.status === 401) {
             throw new Error("HTTP 401: Unauthorized. Check API key configuration.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) throw new Error("No content received from API.");

      const translatedData = JSON.parse(jsonText) as TranslationSet;
      return translatedData;
    } catch (error) {
      if (i === 2) {
        console.error("Final API translation attempt failed:", error);
        throw new Error("Failed to get valid translation after multiple retries.");
      }
      // Re-throw 401 immediately to prevent unnecessary retries on permanent auth failure
      if (error.message.includes("401")) {
          throw error;
      }
      // Wait before retrying (exponential backoff: 1s, 2s delays)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error("Translation failed.");
};


// --------------------
// Reusable UI components
// --------------------
const DishItem: React.FC<{ dish: Dish }> = ({ dish }) => (
  <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-gray-100/10 shadow-sm mb-3">
    <h3 className="text-xl font-semibold text-gray-800">{dish.name}</h3>
    <p className="text-lg font-extrabold text-indigo-600 mt-1">{dish.price}</p>
    <p className="text-gray-500 mt-2 text-sm">{dish.description}</p>
  </div>
);

const AccordionCategory: React.FC<{ category: Category }> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 px-2 text-left focus:outline-none transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100"
      >
        <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[5000px]" : "max-h-0"}`}>
        <div className="pb-4 pt-2 px-2">
          {category.dishes.map((dish: Dish, index: number) => (
            <DishItem key={index} dish={dish} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PageHeader: React.FC<{ title: string; onGoBack: () => void; backText: string }> = ({ title, onGoBack, backText }) => (
  <header className="max-w-4xl mx-auto mb-6 flex items-center relative py-2">
    <button onClick={onGoBack} className="flex items-center p-2 rounded-xl text-gray-700 hover:bg-gray-200 active:scale-95 transform transition z-10">
      <svg className="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="font-medium text-lg">{backText}</span>
    </button>
    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 text-center w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {title}
    </h1>
  </header>
);

const MenuIcon: React.FC<{ type: "starters" | "main" | "drinks" | "dessert" }> = ({ type }) => {
  const iconSize = "w-7 h-7";
  const iconBaseClass = "text-white";
  switch (type) {
    case "starters":
      return (
        <svg className={`${iconSize} ${iconBaseClass}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l1.503 4.545h4.789l-3.87 2.809 1.503 4.545L12 14.09l-3.925 2.76 1.503-4.545-3.87-2.809h4.789z" />
        </svg>
      );
    case "main":
      return (
        <svg className={`${iconSize} ${iconBaseClass}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13H5v-2h14v2zm-4 4H9v-2h6v2zm4-8H5V7h14v2z" />
          <path d="M21 4H3v16h18V4zM5 18V6h14v12H5z" />
        </svg>
      );
    case "drinks":
      return (
        <svg className={`${iconSize} ${iconBaseClass}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 11v11h2V11H7zm14-5v2c-2.76 0-5 2.24-5 5h2c0-1.66 1.34-3 3-3V6h-4V4h4zm-5 7c-2.76 0-5 2.24-5 5H9c0-2.76 2.24-5 5-5v-2h-2V7h4v4zm-7 0v2h2v-2H7z" />
        </svg>
      );
    case "dessert":
      return (
        <svg className={`${iconSize} ${iconBaseClass}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.04.2-2.03.57-2.94L12 11.2V20zm8-8c0 4.41-3.59 8-8 8V11.2l7.43-2.14c.54-.7.84-1.55.84-2.46z" />
        </svg>
      );
    default:
      return null;
  }
};

// --- (LANGUAGE SELECTOR COMPONENT) ---
const LanguageSelector: React.FC<{ currentLang: LangCode; onSelectLang: (lang: LangCode) => void; navTitle: string }> = ({
  currentLang,
  onSelectLang,
  navTitle,
}) => {
  const languages: { code: LangCode; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "gu", label: "ગુજરાતી" },
    { code: "mr", label: "મરાઠી" },
  ];

  return (
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between sm:justify-center">
        <span className="text-gray-500 font-medium hidden sm:block mr-4">{navTitle}:</span>
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-1">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => onSelectLang(code)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 shadow-md ${
                currentLang === code ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// --- (SPLASH SCREEN COMPONENTS) ---
const LoadingSplash: React.FC<{ loadingText: string }> = ({ loadingText }) => (
  <div key="loading" className="fixed inset-0 flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 animate-fade-in transition-opacity duration-1000">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    <p className="mt-6 text-xl font-light">{loadingText}</p>
  </div>
);

const RestaurantSplash: React.FC<{ t: TranslationSet }> = ({ t }) => (
  <div key="restaurant" className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white animate-fade-in transition-opacity duration-1000">
    <h1 className="text-7xl sm:text-8xl font-extrabold tracking-tighter text-yellow-400 font-serif shadow-lg [text-shadow:4px_4px_10px_rgba(0,0,0,0.5)]">
      {t.RESTAURANT_NAME}
    </h1>
    <p className="mt-4 text-2xl font-light text-gray-300 animate-pulse">{t.WELCOME}</p>
  </div>
);

const AdvertisementSplash: React.FC<{ t: TranslationSet }> = ({ t }) => {
  const AD_IMAGE_URL = "https://placehold.co/600x800/1D2B53/EAEAEA?text=Special+Offer!&font=raleway";

  return (
    <div key="advertisement" className="fixed inset-0 flex flex-col justify-end bg-cover bg-center text-white animate-fade-in transition-opacity duration-1000" style={{ backgroundImage: `url(${AD_IMAGE_URL})` }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 p-8 sm:p-12">
        <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight shadow-black [text-shadow:2px_2px_8px_var(--tw-shadow-color)] text-yellow-300">
          {t.AD_HEADING}
        </h2>
        <p className="mt-4 text-lg sm:text-xl max-w-lg shadow-black [text-shadow:1px_1px_4px_var(--tw-shadow-color)] text-gray-100">
          {t.AD_SUBTEXT}
        </p>
      </div>
    </div>
  );
};

// --- (MAIN MENU PAGES) ---
const MainMenu: React.FC<{ onNavigate: (page: Page) => void; t: TranslationSet }> = ({ onNavigate, t }) => {
  const categories = [
    { name: t.MENU_CATEGORIES.STARTERS, icon: <MenuIcon type="starters" />, color: "bg-yellow-500", page: "starters" as Page },
    { name: t.MENU_CATEGORIES.MAIN_COURSE, icon: <MenuIcon type="main" />, color: "bg-red-500", page: "maincourse" as Page },
    { name: t.MENU_CATEGORIES.DRINKS, icon: <MenuIcon type="drinks" />, color: "bg-blue-500", page: "drinks" as Page },
    { name: t.MENU_CATEGORIES.DESSERTS, icon: <MenuIcon type="dessert" />, color: "bg-pink-500", page: "desserts" as Page },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">{t.RESTAURANT_NAME}</h1>
        <p className="mt-2 text-xl text-gray-600">{t.SLOGAN}</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onNavigate(category.page)}
            className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-xl transform transition-all duration-200 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/50 border border-gray-100"
          >
            <div className="flex items-center">
              <div className={`p-4 rounded-full ${category.color} shadow-lg`}>{category.icon}</div>
              <h2 className="ml-5 text-2xl font-bold text-gray-800 text-left">{category.name}</h2>
            </div>
            <svg className="w-6 h-6 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </main>
    </div>
  );
};

const StartersPage: React.FC<{ onGoBack: () => void; t: TranslationSet }> = ({ onGoBack, t }) => (
  <div className="max-w-4xl mx-auto">
    <PageHeader title={t.MENU_CATEGORIES.STARTERS} onGoBack={onGoBack} backText={t.BACK} />
    <main className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
      {t.menu.starters.map((cat, index) => (
        <AccordionCategory key={index} category={cat} />
      ))}
    </main>
  </div>
);

const MainCoursePage: React.FC<{ onGoBack: () => void; t: TranslationSet }> = ({ onGoBack, t }) => (
  <div className="max-w-4xl mx-auto">
    <PageHeader title={t.MENU_CATEGORIES.MAIN_COURSE} onGoBack={onGoBack} backText={t.BACK} />
    <main className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
      {t.menu.maincourse.map((cat, index) => (
        <AccordionCategory key={index} category={cat} />
      ))}
    </main>
  </div>
);

const DrinksPage: React.FC<{ onGoBack: () => void; t: TranslationSet }> = ({ onGoBack, t }) => (
  <div className="max-w-4xl mx-auto">
    <PageHeader title={t.MENU_CATEGORIES.DRINKS} onGoBack={onGoBack} backText={t.BACK} />
    <main className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
      {t.menu.drinks.map((cat, index) => (
        <AccordionCategory key={index} category={cat} />
      ))}
    </main>
  </div>
);

const DessertsPage: React.FC<{ onGoBack: () => void; t: TranslationSet }> = ({ onGoBack, t }) => (
  <div className="max-w-4xl mx-auto">
    <PageHeader title={t.MENU_CATEGORIES.DESSERTS} onGoBack={onGoBack} backText={t.BACK} />
    <main className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
      {t.menu.desserts.map((cat, index) => (
        <AccordionCategory key={index} category={cat} />
      ))}
    </main>
  </div>
);


// --- (MAIN APP COMPONENT) ---
function App() {
  // State for language and UI flow
  const [lang, setLang] = useState<LangCode>("en");
  const [stage, setStage] = useState<Stage>("restaurant");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentTranslation, setCurrentTranslation] = useState<TranslationSet>(ENGLISH_SOURCE_DATA);
  
  // NEW STATE: To gracefully handle persistent 401 errors
  const [hasApiError, setHasApiError] = useState(false); 
  
  // Simplified in-memory cache (No Firebase needed)
  const [languageCache, setLanguageCache] = useState<Partial<Record<LangCode, TranslationSet>>>({ en: ENGLISH_SOURCE_DATA });

  const t = currentTranslation;

  // Handler for language change
  const handleLanguageChange = (newLang: LangCode) => {
    // Only allow changing language if there is no persistent API error OR if switching back to English
    if (!hasApiError || newLang === 'en') {
      setLang(newLang);
    }
  };

  // 1. Splash/Ad Timing Logic
  useEffect(() => {
    // Stage 1: Restaurant Name (2s) -> Advertisement
    if (stage === "restaurant") {
      const timer = setTimeout(() => setStage("advertisement"), 2000);
      return () => clearTimeout(timer);
    }
    // Stage 2: Advertisement (2s) -> Menu
    else if (stage === "advertisement") {
      const timer = setTimeout(() => {
        // Only transition to menu if we are not actively loading a translation
        if (lang === "en" || languageCache[lang] || hasApiError) {
            setStage("menu");
        } else {
            // If we are waiting for a non-English translation, let the translation effect handle the "loading" stage.
            setStage("loading");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, lang, languageCache, hasApiError]);


  // 2. Translation Flow: run whenever lang changes
  useEffect(() => {
    let cancelled = false;
    const fetchTranslation = async () => {
      
      // GUARD CLAUSE: If we already failed due to 401, skip all future attempts for non-English languages
      if (hasApiError && lang !== 'en') {
          console.warn("Skipping translation attempt due to previous API authorization failure (401).");
          setCurrentTranslation(ENGLISH_SOURCE_DATA);
          setStage("menu");
          return;
      }
      
      // 1. If English, use default and ensure menu visibility
      if (lang === "en") {
        setCurrentTranslation(ENGLISH_SOURCE_DATA);
        if (stage !== "restaurant" && stage !== "advertisement") {
            setStage("menu");
        }
        return;
      }

      // 2. If cached - use it
      if (languageCache[lang]) {
        setCurrentTranslation(languageCache[lang] as TranslationSet);
        setStage("menu");
        return;
      }

      // 3. Not cached - fetch translation
      setStage("loading");
      try {
        const translated = await translateMenu(ENGLISH_SOURCE_DATA, lang);
        if (cancelled) return;

        setCurrentTranslation(translated);
        
        // Update cache locally (in-memory)
        setLanguageCache(prev => ({ ...prev, [lang]: translated }));

      } catch (err) {
        // on failure, fallback to English
        console.error("Translation error:", err);
        
        // If the error indicates a 401, flag the API as permanently broken
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
            console.error("Critical: Persistent API Authorization Failure detected (401). Disabling further translation attempts.");
            setHasApiError(true);
        }
        
        setCurrentTranslation(ENGLISH_SOURCE_DATA);
        setLang("en"); // Force selection back to English
      } finally {
        if (!cancelled) setStage("menu");
      }
    };

    fetchTranslation();

    return () => {
      cancelled = true;
    };
  }, [lang, hasApiError]); // Depend on hasApiError to prevent re-runs after failure


  // Navigation handlers
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const goBackToHome = () => {
    setCurrentPage("home");
    window.scrollTo(0, 0);
  };

  const renderAppContent = () => {
    // Render based on splash/loading stage
    if (stage === "restaurant") return <RestaurantSplash t={t} />;
    if (stage === "advertisement") return <AdvertisementSplash t={t} />;
    if (stage === "loading") {
      const loadingText = lang === "en" ? "Loading Menu..." : `Translating to ${TARGET_LANG_MAP[lang]}...`;
      return <LoadingSplash loadingText={loadingText} />;
    }

    // Main Menu View (stage === "menu")
    return (
      <div key="menu-app" className="min-h-screen bg-gray-50 animate-fade-in pb-12">
        <LanguageSelector currentLang={lang} onSelectLang={handleLanguageChange} navTitle={t.NAV_TITLE} />

        {/* API Error Banner */}
        {hasApiError && (
          <div className="bg-red-100 text-red-700 p-3 text-center text-sm font-medium sticky top-[45px] sm:top-[50px] z-40 shadow-md">
            ⚠️ **Translation Service Unavailable:** An API authorization error (401) prevents language switching. Displaying the default English menu.
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-4 sm:p-8 pt-0">
          {{
            home: <MainMenu onNavigate={handleNavigation} t={t} />,
            starters: <StartersPage onGoBack={goBackToHome} t={t} />,
            maincourse: <MainCoursePage onGoBack={goBackToHome} t={t} />,
            drinks: <DrinksPage onGoBack={goBackToHome} t={t} />,
            desserts: <DessertsPage onGoBack={goBackToHome} t={t} />,
          }[currentPage]}
        </div>
      </div>
    );
  };

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        
        /* Custom font for restaurant name/serif elements */
        .font-serif {
            font-family: 'Playfair Display', serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
      {renderAppContent()}
    </>
  );
}

export default App;