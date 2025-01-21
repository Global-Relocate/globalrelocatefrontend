import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import favoriteIcon from "../assets/svg/favorite.svg";
import filledFavoriteIcon from "../assets/svg/filledfavorite.svg";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (country) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.location === country.location);
      
      if (exists) {
        toast(`${country.location} unsaved from favorites`, {
          action: {
            label: 'View',
            onClick: () => window.location.href = '/user/favourites'
          },
          icon: <img src={favoriteIcon} alt="favorite icon" className="w-5 h-5" />
        });
        return prev.filter(f => f.location !== country.location);
      } else {
        toast(`${country.location} saved to favorites`, {
          action: {
            label: 'View',
            onClick: () => window.location.href = '/user/favourites'
          },
          icon: <img src={filledFavoriteIcon} alt="filled favorite icon" className="w-5 h-5" />
        });
        return [...prev, country];
      }
    });
  };

  const isFavorite = (location) => {
    return favorites.some(f => f.location === location);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
