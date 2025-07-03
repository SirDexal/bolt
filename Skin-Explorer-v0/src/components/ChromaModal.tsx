import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { ChromaModalProps } from '../types';
import { getChromaThumbnailUrl, getSkinSplashUrl, getSkinNumFromId } from '../services/api';

const ChromaModal: React.FC<ChromaModalProps> = ({
  isOpen,
  onClose,
  skin,
  champion,
  chromas
}) => {
  const [selectedChromaId, setSelectedChromaId] = useState<string>('');
  const [selectedChromaName, setSelectedChromaName] = useState<string>('');
  const [mainImageSrc, setMainImageSrc] = useState<string>('');

  useEffect(() => {
    if (isOpen && skin && champion) {
      // Create base skin entry
      const baseSkinId = skin.id;
      const baseSkinName = "Base Skin";
      
      // Set initial selection to base skin
      setSelectedChromaId(baseSkinId);
      setSelectedChromaName(baseSkinName);
      
      // For base skin, use chroma thumbnail URL to maintain consistency
      const baseThumbnailUrl = getChromaThumbnailUrl(champion.key, baseSkinId);
      setMainImageSrc(baseThumbnailUrl);
    }
  }, [isOpen, skin, champion]);

  if (!isOpen || !skin || !champion) return null;

  // Create all displayable chromas including base skin
  const baseChromaEntry = {
    id: skin.id,
    name: "Base Skin",
    isBase: true
  };
  
  const allDisplayableChromas = [baseChromaEntry, ...chromas];

  const handleChromaSelect = (chromaId: string, chromaName: string) => {
    setSelectedChromaId(chromaId);
    setSelectedChromaName(chromaName);
    
    // Always use chroma thumbnail URL for consistency
    const chromaThumbnailUrl = getChromaThumbnailUrl(champion.key, chromaId);
    setMainImageSrc(chromaThumbnailUrl);
  };

  const handleMainImageError = () => {
    // Fallback to DDragon splash
    const ddragonFallback = getSkinSplashUrl(champion.id, skin.num);
    if (mainImageSrc !== ddragonFallback) {
      setMainImageSrc(ddragonFallback);
    } else {
      // Final fallback to placeholder
      setMainImageSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNwbGFzaCBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(15px)'
    }}>
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div 
        className="relative rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
        style={{
          background: 'var(--modal-content-bg)',
          border: '1px solid var(--primary-color-border)',
          boxShadow: '0 25px 50px var(--primary-color-active-bg)'
        }}
      >
        {/* Modern Header */}
        <div 
          className="relative p-6 border-b"
          style={{ 
            borderColor: 'var(--primary-color-border)',
            background: `linear-gradient(135deg, var(--primary-color-gradient-start), var(--primary-color-gradient-end))`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'var(--primary-color-hover-bg)',
                  border: '1px solid var(--primary-color-border)'
                }}
              >
                <Sparkles className="h-6 w-6" style={{ color: 'var(--primary-color)' }} />
              </div>
              <div>
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: 'var(--text-color-inverted)' }}
                >
                  {skin.name}
                </h2>
                <p 
                  className="text-sm opacity-80"
                  style={{ color: 'var(--text-color-inverted)' }}
                >
                  {allDisplayableChromas.length} variants available
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-3 rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-color-inverted)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(95vh-120px)]">
          {/* Left Side - Large Preview */}
          <div className="flex-[3] p-8 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <img
                src={mainImageSrc}
                alt={`${skin.name} - ${selectedChromaName}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
                style={{ 
                  border: '2px solid var(--primary-color-border)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                }}
                onError={handleMainImageError}
              />
              
              {/* Image Info Overlay */}
              <div 
                className="absolute bottom-6 left-6 right-6 rounded-2xl p-4"
                style={{ 
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--primary-color-border)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg" style={{ color: 'var(--text-color-inverted)' }}>
                      {selectedChromaName}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-color-secondary)' }}>
                      Skin ID: {getSkinNumFromId(selectedChromaId, champion.key)}
                    </p>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: 'var(--primary-color-hover-bg)',
                      color: 'var(--primary-color)',
                      border: '1px solid var(--primary-color-border)'
                    }}
                  >
                    {champion.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Modern Chroma Grid */}
          <div 
            className="flex-[2] border-l flex flex-col"
            style={{ borderColor: 'var(--primary-color-border)' }}
          >
            <div 
              className="p-6 border-b"
              style={{ borderColor: 'var(--primary-color-border)' }}
            >
              <h3 
                className="font-bold text-lg"
                style={{ color: 'var(--text-color-headings)' }}
              >
                Choose Variant
              </h3>
              <p 
                className="text-sm mt-1"
                style={{ color: 'var(--text-color-secondary)' }}
              >
                Click any variant to preview
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                {allDisplayableChromas.map((chroma, index) => {
                  const isBase = chroma.isBase || false;
                  const displayName = isBase ? "Base" : (chroma.name.replace(skin.name, '').trim() || `Chroma ${index}`);
                  const thumbnailUrl = getChromaThumbnailUrl(champion.key, chroma.id);
                  const isSelected = selectedChromaId === chroma.id;

                  return (
                    <button
                      key={chroma.id}
                      onClick={() => handleChromaSelect(chroma.id, displayName)}
                      className="group relative overflow-hidden rounded-2xl transition-all duration-300"
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, var(--primary-color-gradient-start), var(--primary-color-gradient-end))`
                          : 'var(--item-bg)',
                        border: isSelected 
                          ? '2px solid var(--primary-color)' 
                          : '2px solid var(--primary-color-border)',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isSelected 
                          ? '0 8px 25px var(--primary-color-active-bg)'
                          : '0 4px 15px rgba(0,0,0,0.3)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.borderColor = 'var(--primary-color)';
                          e.currentTarget.style.boxShadow = '0 8px 25px var(--primary-color-active-bg)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.borderColor = 'var(--primary-color-border)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                        }
                      }}
                    >
                      {/* Image Container */}
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={thumbnailUrl}
                          alt={displayName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                      </div>
                      
                      {/* Text Overlay */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 p-3"
                        style={{
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                        }}
                      >
                        <p 
                          className="font-semibold text-sm truncate"
                          style={{ 
                            color: 'var(--text-color-inverted)',
                            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                          }}
                        >
                          {displayName}
                        </p>
                        <p 
                          className="text-xs opacity-80"
                          style={{ 
                            color: 'var(--text-color-inverted)',
                            fontFamily: "'Courier New', Courier, monospace"
                          }}
                        >
                          ID: {getSkinNumFromId(chroma.id, champion.key)}
                        </p>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div 
                          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: 'var(--checkmark-bg)',
                            color: 'var(--checkmark-color)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChromaModal;