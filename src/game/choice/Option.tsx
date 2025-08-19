import { guess, type QuestionOption } from "./state";

export interface OptionProps {
    option: QuestionOption;
}

export function Option({ option }: OptionProps) {
    const handleClick = () => {
        guess(option.id);
    };

    return (
        <button
            className="h-[80px] px-[20px] flex items-center justify-center rounded-[10px] font-[450]
                cursor-pointer transition-colors duration-20 focus-ring
                bg-white border border-gray-20 hover:border-gray-30"
            onClick={handleClick}
        >
            {option.value}
        </button>
    )
}
