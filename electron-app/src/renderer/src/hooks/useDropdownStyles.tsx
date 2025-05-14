import { useRef, useEffect } from "react";

export const useDropdownStyles = () => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (dropdownRef.current) {
            dropdownRef.current.style.position = 'relative';
            dropdownRef.current.style.zIndex = '1000';
        }
        if (buttonRef.current) {
            buttonRef.current.style.transition = 'all 0.2s ease';
        }
    }, []);

    return { dropdownRef, buttonRef };
}