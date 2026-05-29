export function flipObject<Key extends string>(map: Record<Key, string>): Record<string, Key | undefined> {
    return Object.fromEntries(Object.entries<string>(map).map(([key, value]) => [value, key as Key]));
}
