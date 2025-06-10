import React, { useState, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomInput } from "@/components/ui/custom-input";

// Función para normalizar texto removiendo acentos
function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder: string;
  searchPlaceholder: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  tabIndex?: number;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  placeholder,
  searchPlaceholder,
  value,
  onValueChange,
  className,
  tabIndex,
  disabled = false
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    normalizeText(option.label).includes(normalizeText(searchTerm))
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelectChange = (newValue: string) => {
    onValueChange(newValue);
    setSearchTerm("");
    setIsOpen(false);
    
    // Keep focus on the current field after selection
    setTimeout(() => {
      const currentTrigger = containerRef.current?.querySelector('[role="combobox"]') as HTMLElement;
      if (currentTrigger) {
        currentTrigger.focus();
      }
    }, 100);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Keep dropdown open
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the Select component from closing when typing
    e.stopPropagation();
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Prevent closing the dropdown when clicking on search input
    e.stopPropagation();
    // Ensure the input gets focus when clicked
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle search input focus when explicitly clicked
  const handleSearchFocus = () => {
    // Only focus if explicitly clicked, no automatic focusing
  };

  // Handle mouse enter on select items to allow focus change
  const handleItemMouseEnter = (e: React.MouseEvent) => {
    // Allow focus to change when hovering over items
    const target = e.currentTarget as HTMLElement;
    target.focus();
  };

  // Capture keystrokes when dropdown is open and redirect to search if needed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && searchInputRef.current) {
        // If typing characters and search input is not focused, focus it and continue typing
        if ((e.key.length === 1 || e.key === 'Backspace') && document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          e.stopPropagation();
          
          // Focus the search input
          searchInputRef.current.focus();
          
          // Simulate the keystroke
          if (e.key === 'Backspace') {
            const newValue = searchTerm.slice(0, -1);
            setSearchTerm(newValue);
          } else if (e.key.length === 1) {
            const newValue = searchTerm + e.key;
            setSearchTerm(newValue);
          }
        } else if (document.activeElement === searchInputRef.current) {
          // Let the input handle keystrokes naturally when focused
          e.stopPropagation();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown, true);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, searchTerm]);

  return (
    <div ref={containerRef} className="relative">
      <Select 
        value={value} 
        onValueChange={handleSelectChange}
        onOpenChange={handleOpenChange}
        open={isOpen}
        disabled={disabled}
      >
        <SelectTrigger className={className} tabIndex={tabIndex}>
          <SelectValue placeholder={placeholder}>
            {selectedOption?.label || placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <div className="p-2 border-b">
            <div className="relative">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <CustomInput
                ref={searchInputRef}
                placeholder="Buscar"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onClick={handleSearchClick}
                onFocus={handleSearchFocus}
                className="h-8 text-sm pl-8 pr-8"
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm("");
                    if (searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-2 px-4 text-sm text-gray-500">
                No se encontraron resultados
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  onMouseEnter={handleItemMouseEnter}
                >
                  {option.label}
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}