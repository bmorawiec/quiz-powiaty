const map: Partial<Record<string, string>> = {
    "Ą": "A",   "Ć": "C",   "Ę": "E",   "Ł": "L",   "Ń": "N",   "Ó": "O",   "Ś": "S",   "Ź": "Z",   "Ż": "Z",
    "ą": "a",   "ć": "c",   "ę": "e",   "ł": "l",   "ń": "n",   "ó": "o",   "ś": "s",   "ź": "z",   "ż": "z",
};

export function swapDiacritics(str: string): string {
    let newStr = "";
    for (const char of str) {
        newStr += map[char] || char;
    }
    return newStr;
}
