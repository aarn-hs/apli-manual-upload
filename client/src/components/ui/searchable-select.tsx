import React, { useState, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomInput } from "@/components/ui/custom-input";

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

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelectChange = (newValue: string) => {
    onValueChange(newValue);
    setSearchTerm("");
    setIsOpen(false);
    
    // Move focus to next field after selection
    setTimeout(() => {
      const currentElement = document.activeElement;
      if (currentElement) {
        // Find the next focusable element
        const focusableElements = document.querySelectorAll(
          'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
        );
        const currentIndex = Array.from(focusableElements).indexOf(currentElement as Element);
        const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
        if (nextElement) {
          nextElement.focus();
        }
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
    <div className="relative">
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
            <CustomInput
              ref={searchInputRef}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onClick={handleSearchClick}
              onFocus={handleSearchFocus}
              className="h-8 text-sm"
              autoComplete="off"
            />
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