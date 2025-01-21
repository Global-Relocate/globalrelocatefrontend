import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import favoriteIcon from "../assets/svg/favorite.svg";
import heartIcon from "../assets/svg/heart.svg"

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
          icon: <img src={favoriteIcon} alt="favorite icon" className="w-5 h-5" />,
          closeButton: true,
          dismissible: true
        });
        return prev.filter(f => f.location !== country.location);
      } else {
        toast(`${country.location} saved to favorites`, {
          action: {
            label: (
              <div className="flex items-center gap-2">
                <span>View</span>
              </div>
            ),
            onClick: () => window.location.href = '/user/favourites'
          },
          icon: <img src={heartIcon} alt="heart icon" className="w-5 h-5" />,
          closeButton: true,
          dismissible: true
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
