
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X } from 'lucide-react';

interface Address {
  postcode: string;
  street: string;
  city: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: Address) => void;
}

// Mock UK address data for demonstration
const UK_ADDRESSES = [
  { postcode: "E1 6AN", street: "5 Commercial St", city: "London" },
  { postcode: "SW1A 1AA", street: "Buckingham Palace", city: "London" },
  { postcode: "M1 1AE", street: "1 Piccadilly", city: "Manchester" },
  { postcode: "B1 1HQ", street: "Bullring Shopping Centre", city: "Birmingham" },
  { postcode: "EH1 1YZ", street: "1 Royal Mile", city: "Edinburgh" },
  { postcode: "CF10 1DD", street: "Cardiff Castle", city: "Cardiff" },
  { postcode: "BT1 5GS", street: "1 Donegall Square", city: "Belfast" },
  { postcode: "G1 1XW", street: "George Square", city: "Glasgow" },
  { postcode: "L1 8JQ", street: "Liverpool ONE", city: "Liverpool" },
  { postcode: "BS1 5TY", street: "1 Harbourside", city: "Bristol" },
];

export function AddressAutocomplete({ value, onChange, onAddressSelect }: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    if (newValue.length >= 2) {
      setLoading(true);
      // Simulate API call with timeout
      setTimeout(() => {
        // Filter UK addresses based on postcode input
        const filtered = UK_ADDRESSES.filter(
          addr => addr.postcode.toLowerCase().includes(newValue.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setLoading(false);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setInputValue(address.postcode);
    onChange(address.postcode);
    onAddressSelect(address);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative flex">
        <div className="relative flex-grow">
          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            className="pl-8 pr-8"
            placeholder="Enter UK postcode"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue.length >= 2 && setSuggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {inputValue && (
            <button 
              type="button"
              className="absolute right-2.5 top-2.5"
              onClick={handleClear}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-2 text-center text-sm text-gray-500">Searching addresses...</div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((address, index) => (
                <li 
                  key={index}
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="font-medium">{address.postcode}</div>
                  <div className="text-gray-600">{address.street}, {address.city}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-center text-sm text-gray-500">No addresses found</div>
          )}
        </div>
      )}
    </div>
  );
}
