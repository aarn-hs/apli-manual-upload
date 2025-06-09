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
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && searchInputRef.current) {
      // Focus the search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    if (!open) {
      setSearchTerm("");
    }
  };

  // Keep focus on search input when hovering over options
  const handleItemMouseEnter = () => {
    setTimeout(() => {
      if (searchInputRef.current && isOpen) {
        searchInputRef.current.focus();
      }
    }, 0);
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
  };

  // Prevent focus loss when mouse moves over items
  const handleItemMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

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
          <div className="p-2 border-b" onMouseDown={(e) => e.preventDefault()}>
            <CustomInput
              ref={searchInputRef}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onClick={handleSearchClick}
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
                  onFocus={handleItemMouseEnter}
                  onMouseDown={handleItemMouseDown}
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