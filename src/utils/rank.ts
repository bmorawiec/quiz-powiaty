interface Entry<T> {
    element: T;
    rank: number;
}

export function rankAndPickBest<T>(elements: T[], howMany: number, rank: (element: T) => number): T[] {
    if (elements.length === 0) {
        throw new Error("Cannot pick the best item from an empty array.");
    }

    const rankedElements: Entry<T>[] = elements.map((element) => ({
        element,
        rank: rank(element)
    }));

    const result: T[] = new Array(howMany);
    for (let index = 0; index < howMany; index++) {
        const entry = findEntryWithMaxRank(rankedElements);
        entry.rank = -Infinity;     // this is so that this entry doesn't get picked again
        result[index] = entry.element;
    }

    return result;
}

function findEntryWithMaxRank<T>(rankedElements: Entry<T>[]): Entry<T> {
    let bestEntry: Entry<T> | null = null;
    for (const entry of rankedElements) {
        if (!bestEntry || entry.rank > bestEntry.rank) {
            bestEntry = entry;
        }
    }
    return bestEntry!;  // assuming that input array isn't empty
}
