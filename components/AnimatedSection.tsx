import React, { useState, useEffect, useRef } from 'react';

interface AnimatedSectionProps {
    children: React.ReactNode;
    animation?: string;
    className?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, animation = 'animate-slide-in-up', className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div ref={domRef} className={`${className} ${isVisible ? animation : 'opacity-0'}`}>
            {children}
        </div>
    );
};
