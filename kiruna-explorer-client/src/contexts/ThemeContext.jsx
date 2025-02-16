// src/contexts/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Initialize the state based on the saved theme in localStorage, if available
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("isDarkMode");
        return savedTheme ? JSON.parse(savedTheme) : false; // Default to light mode if no saved preference
    });

    const [isSatelliteMap, setIsSatelliteMap] = useState(() => {
        const savedTheme = localStorage.getItem("isSatelliteMap");
        return savedTheme ? JSON.parse(savedTheme) : true; // Default to satellite mode if no saved preference
    });

    // Update localStorage whenever the theme changes
    useEffect(() => {
        localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
        localStorage.setItem("isSatelliteMap", JSON.stringify(isSatelliteMap));
    }, [isDarkMode, isSatelliteMap]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode); // Toggle the theme
    };

    const toggleMap = () =>{
        setIsSatelliteMap((prevMode) => !prevMode)
    }

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isSatelliteMap, toggleMap }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);
