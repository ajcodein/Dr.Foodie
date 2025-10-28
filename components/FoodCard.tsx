import React from 'react';
import type { FoodInfo, VitaminMineral } from '../types';
import { LeafIcon, WarningIcon, CheckCircleIcon, LightBulbIcon } from './icons';

interface FoodCardProps {
    data: FoodInfo;
    onAddToCompare: (food: FoodInfo) => void;
}

const NutritionFact: React.FC<{ label: string; value: string | number; unit: string; }> = ({ label, value, unit }) => (
    <div className="flex justify-between items-center py-2 px-3 bg-white/5 dark:bg-black/10 rounded-lg">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
        <span className="text-sm font-bold text-light-text dark:text-dark-text">{value} <span className="text-xs text-gray-500">{unit}</span></span>
    </div>
);

const VitaminChip: React.FC<{ item: VitaminMineral }> = ({ item }) => (
    <div className="bg-primary/10 text-primary-dark dark:text-primary-light text-xs font-semibold px-3 py-1 rounded-full">
        {item.name}: {item.amount} ({item.percentDV})
    </div>
);

const InfoListItem: React.FC<{ icon: React.ReactNode; text: string; }> = ({ icon, text }) => (
    <li className="flex items-start space-x-3">
        <div className="flex-shrink-0">{icon}</div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
    </li>
);

export const FoodCard: React.FC<FoodCardProps> = ({ data, onAddToCompare }) => {
    const { foodName, description, imageQuery, imageBase64, nutritionFacts, vitaminsAndMinerals, healthBenefits, overuseWarnings, healthierAlternatives } = data;
    
    return (
        <div className="animate-slide-in-up bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-3xl font-bold text-primary-dark dark:text-primary-light mb-2 text-center">{foodName}</h2>
                    <img 
                        src={imageBase64 ? `data:image/png;base64,${imageBase64}` : `https://via.placeholder.com/400x300.png?text=No+Image`} 
                        alt={foodName} 
                        className="w-full h-48 object-cover rounded-xl shadow-md mb-4 bg-gray-200 dark:bg-slate-700" 
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">{description}</p>
                    <button 
                        onClick={() => onAddToCompare(data)}
                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Add to Compare
                    </button>
                </div>
                <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <h3 className="text-xl font-semibold mb-3 text-light-text dark:text-dark-text border-b-2 border-primary pb-1">Nutrition Facts (per 100g)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mb-4">
                        <NutritionFact label="Calories" value={nutritionFacts.calories} unit="kcal" />
                        <NutritionFact label="Protein" value={nutritionFacts.protein} unit="g" />
                        <NutritionFact label="Carbs" value={nutritionFacts.carbohydrates} unit="g" />
                        <NutritionFact label="Fat" value={nutritionFacts.fat} unit="g" />
                        <NutritionFact label="Fiber" value={nutritionFacts.fiber} unit="g" />
                        <NutritionFact label="Sugar" value={nutritionFacts.sugar} unit="g" />
                        <NutritionFact label="Sodium" value={nutritionFacts.sodium} unit="mg" />
                        <NutritionFact label="Cholesterol" value={nutritionFacts.cholesterol} unit="mg" />
                    </div>
                     <h4 className="text-md font-semibold mb-2 text-light-text dark:text-dark-text">Vitamins & Minerals</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {vitaminsAndMinerals.slice(0, 6).map(item => <VitaminChip key={item.name} item={item} />)}
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <div className="bg-green-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h3 className="flex items-center text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                        <CheckCircleIcon className="w-6 h-6 mr-2" /> Health Benefits
                    </h3>
                    <ul className="space-y-2">
                        {healthBenefits.map((benefit, i) => <InfoListItem key={i} icon={<LeafIcon className="w-4 h-4 text-green-500" />} text={benefit} />)}
                    </ul>
                </div>
                {overuseWarnings.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-slate-800 p-4 rounded-lg">
                        <h3 className="flex items-center text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                            <WarningIcon className="w-6 h-6 mr-2" /> Overuse Warnings
                        </h3>
                        <ul className="space-y-2">
                            {overuseWarnings.map((warning, i) => <InfoListItem key={i} icon={<WarningIcon className="w-4 h-4 text-yellow-500" />} text={warning} />)}
                        </ul>
                    </div>
                )}
                {healthierAlternatives.length > 0 && (
                     <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg md:col-span-2">
                        <h3 className="flex items-center text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">
                            <LightBulbIcon className="w-6 h-6 mr-2" /> Healthier Alternatives
                        </h3>
                        <ul className="space-y-2">
                            {healthierAlternatives.map((alt, i) => <InfoListItem key={i} icon={<LightBulbIcon className="w-4 h-4 text-blue-500" />} text={`${alt.name}: ${alt.reason}`} />)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};