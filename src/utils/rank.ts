interface Entry<T> {
    element: T;
    rank: number | null;
}

export function rankAndPickBest<T>(elements: T[], howMany: number, rank: (element: T) => number): T[] {
    const rankedElements: Entry<T>[] = elements.map((element) => ({
        element,
        rank: rank(element)
    }));

    const result: T[] = new Array(howMany);
    for (let index = 0; index < howMany; index++) {
        const entry = findEntryWithMaxRank(rankedElements);
        entry.rank = null;     // this is so that this entry doesn't get picked again
        result[index] = entry.element;
    }

    return result;
}

function findEntryWithMaxRank<T>(rankedElements: Entry<T>[]): Entry<T> {
    let bestEntry: Entry<T> | null = null;
    for (const entry of rankedElements) {
        if (entry.rank != null) {
            if (!bestEntry || entry.rank > bestEntry.rank!) {
                bestEntry = entry;
            }
        }
    }
    if (!bestEntry) {
        throw new Error("Not enough entries to pick from.");
    }
    return bestEntry;
}
