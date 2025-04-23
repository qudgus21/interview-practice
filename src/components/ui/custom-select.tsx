import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "선택하세요",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <div
        className="flex items-center justify-between border border-[#DED0C3] rounded-lg px-4 py-2 bg-white text-[#2C3639] cursor-pointer hover:border-[#E8AA9B] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#5C6B73] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#DED0C3] rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-[#F5F5F5] text-sm ${
                value === option.value ? "bg-[#F5F5F5] text-[#E8AA9B]" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
