import React from 'react';
import type { ComparisonFoodInfo } from '../types';
import { XCircleIcon } from './icons';

interface ComparisonViewProps {
    items: ComparisonFoodInfo[];
    onRemove: (foodName: string) => void;
    onClear: () => void;
}

const StatHighlight: React.FC<{ value: number; isMax: boolean }> = ({ value, isMax }) => (
    <span className={`font-bold ${isMax ? 'text-primary' : 'text-light-text dark:text-dark-text'}`}>
        {value}
    </span>
);

export const ComparisonView: React.FC<ComparisonViewProps> = ({ items, onRemove, onClear }) => {
    if (items.length === 0) return null;

    const findMax = (key: keyof ComparisonFoodInfo['nutritionFacts']) => {
        if (items.length === 0) return 0;
        return Math.max(...items.map(item => item.nutritionFacts[key]));
    };

    const maxValues = {
        calories: findMax('calories'),
        protein: findMax('protein'),
        carbohydrates: findMax('carbohydrates'),
        fat: findMax('fat'),
    };
    
    return (
        <section className="animate-slide-in-up w-full max-w-6xl mx-auto mt-8 p-4 sm:p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Food Comparison</h2>
                <button 
                    onClick={onClear} 
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-lg transition"
                >
                    Clear All
                </button>
            </div>
            <div className="overflow-x-auto">
                <div className="inline-grid gap-4" style={{ gridTemplateColumns: `auto repeat(${items.length}, minmax(150px, 1fr))` }}>
                    {/* Header Row */}
                    <div className="font-semibold text-sm text-gray-500 dark:text-gray-400 p-2 text-right"></div>
                    {items.map((item, index) => (
                        <div key={item.foodName} className="flex flex-col items-center text-center p-2 relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <button onClick={() => onRemove(item.foodName)} className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 z-10">
                                <XCircleIcon className="w-6 h-6 bg-white dark:bg-slate-800 rounded-full" />
                            </button>
                            <div className="transition-transform transform hover:scale-105">
                                <img 
                                    src={item.imageBase64 ? `data:image/png;base64,${item.imageBase64}` : `https://via.placeholder.com/150x100.png?text=No+Image`} 
                                    alt={item.foodName} 
                                    className="w-24 h-16 object-cover rounded-md mb-2 shadow-sm bg-gray-200 dark:bg-slate-700" 
                                />
                                <h3 className="font-bold text-light-text dark:text-dark-text">{item.foodName}</h3>
                            </div>
                        </div>
                    ))}

                    {/* Nutrient Rows */}
                    {(['calories', 'protein', 'carbohydrates', 'fat'] as const).map(nutrient => (
                        <React.Fragment key={nutrient}>
                            <div className="font-semibold text-sm text-gray-500 dark:text-gray-400 p-2 text-right capitalize self-center">{nutrient}</div>
                            {items.map(item => (
                                <div key={`${item.foodName}-${nutrient}`} className="p-2 text-center text-sm self-center">
                                    <StatHighlight value={item.nutritionFacts[nutrient]} isMax={item.nutritionFacts[nutrient] === maxValues[nutrient]} />
                                    {nutrient !== 'calories' && ' g'}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
             <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">All values per 100g serving. <span className="text-primary font-bold">Highlighted</span> values are the highest in each category.</p>
        </section>
    );
};