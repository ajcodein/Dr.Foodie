import React, { useState, useEffect, useCallback } from 'react';
import type { FoodInfo, ComparisonFoodInfo } from './types';
import { getFoodInfo, generateImage } from './services/geminiService';
import { SunIcon, MoonIcon, SearchIcon, LeafIcon } from './components/icons';
import { FoodCard } from './components/FoodCard';
import { ComparisonView } from './components/ComparisonView';
import { AnimatedSection } from './components/AnimatedSection';
import { HeroImage } from './components/HeroImage';

const Header: React.FC<{ theme: string; onThemeToggle: () => void }> = ({ theme, onThemeToggle }) => (
    <header className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg fixed top-0 left-0 right-0 z-10 border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <LeafIcon className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Dr Foodie</h1>
            </div>
            <button
                onClick={onThemeToggle}
                className="p-2 rounded-full text-light-text dark:text-dark-text bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
        </div>
    </header>
);

const Hero: React.FC<{ onSearch: (query: string) => void; isLoading: boolean }> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <section className="pt-28 pb-12 text-center bg-gradient-to-b from-primary/20 to-transparent">
            <div className="container mx-auto px-4">
                <HeroImage />
                <h2 className="text-4xl md:text-5xl font-extrabold text-light-text dark:text-dark-text mb-2 animate-fade-in-down" style={{ animationDelay: '200ms' }}>Eat Smart. Live Smart.</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-down" style={{ animationDelay: '400ms' }}>Ask Anything About Food. Get the Truth from Dr Foodie.</p>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative animate-fade-in-down" style={{ animationDelay: '600ms' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'avocado' or 'Is salmon healthy?'"
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary focus:ring-primary transition shadow-md"
                        disabled={isLoading}
                    />
                    <SearchIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <button type="submit" disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white font-bold px-6 py-2 rounded-full hover:bg-primary-dark transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100">
                        {isLoading ? '...' : 'Ask'}
                    </button>
                </form>
            </div>
        </section>
    );
};

const Testimonials: React.FC = () => {
    const testimonials = [
        { name: 'Sarah L.', quote: "Dr Foodie is my go-to for quick, reliable nutrition facts. The AI explanations are a game-changer!" },
        { name: 'Mike R.', quote: "Finally, a nutrition site that's easy to use and beautiful to look at. The food comparison feature is brilliant." },
        { name: 'Jessica P.', quote: "I love the health warnings. It helps me make more conscious decisions about my diet. Highly recommended!" },
    ];
    return (
        <section className="py-16 bg-primary/10 dark:bg-slate-800/20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-light-text dark:text-dark-text">What Users Are Saying</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2" style={{ animationDelay: `${i * 100}ms` }}>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">"{t.quote}"</p>
                            <p className="font-bold text-right text-primary">- {t.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer: React.FC = () => (
    <footer className="bg-light-bg dark:bg-dark-bg border-t border-gray-200 dark:border-slate-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
            <p className="font-semibold text-sm">Powered by AI + Real Nutrition Data</p>
            <p className="text-xs mt-2">&copy; {new Date().getFullYear()} Dr Foodie. All Rights Reserved. For informational purposes only.</p>
        </div>
    </footer>
);

const App: React.FC = () => {
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foodData, setFoodData] = useState<FoodInfo | null>(null);
    const [comparisonList, setComparisonList] = useState<ComparisonFoodInfo[]>([]);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleSearch = useCallback(async (query: string) => {
        setIsLoading(true);
        setError(null);
        setFoodData(null);
        try {
            const data = await getFoodInfo(query);
            const imageBase64 = await generateImage(data.imageQuery);
            setFoodData({ ...data, imageBase64 });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAddToCompare = useCallback((food: FoodInfo) => {
        if (comparisonList.some(item => item.foodName.toLowerCase() === food.foodName.toLowerCase())) {
            return; // Already in list
        }
        
        const newItem: ComparisonFoodInfo = {
            foodName: food.foodName,
            imageQuery: food.imageQuery,
            imageBase64: food.imageBase64,
            nutritionFacts: {
                calories: food.nutritionFacts.calories,
                protein: food.nutritionFacts.protein,
                carbohydrates: food.nutritionFacts.carbohydrates,
                fat: food.nutritionFacts.fat,
            }
        };
        
        setComparisonList(prevList => [...prevList, newItem]);
    }, [comparisonList]);

    const handleRemoveFromCompare = useCallback((foodName: string) => {
        setComparisonList(prevList => prevList.filter(item => item.foodName !== foodName));
    }, []);
    
    const handleClearCompare = () => setComparisonList([]);

    return (
        <div className="min-h-screen text-light-text dark:text-dark-text transition-colors duration-300">
            <Header theme={theme} onThemeToggle={handleThemeToggle} />
            <main>
                <Hero onSearch={handleSearch} isLoading={isLoading} />
                <div className="container mx-auto px-4 py-8">
                    {isLoading && !foodData && !error && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 animate-subtle-pulse">Dr Foodie is thinking...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg max-w-lg mx-auto animate-fade-in">
                            <strong className="font-bold">Oops! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {foodData && <FoodCard data={foodData} onAddToCompare={handleAddToCompare} />}

                    <ComparisonView items={comparisonList} onRemove={handleRemoveFromCompare} onClear={handleClearCompare} />
                </div>
                <AnimatedSection>
                    <Testimonials />
                </AnimatedSection>
            </main>
            <AnimatedSection>
                <Footer />
            </AnimatedSection>
        </div>
    );
};

export default App;