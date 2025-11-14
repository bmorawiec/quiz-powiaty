/** Seeded random number generator.
 *  Thanks to github user bryc for the original implementation:
 *  https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 *  Code is in the public domain and can be licensed under MIT. */
export function alea(seed: string) {
    function mash() {
        let n = 4022871197;
        return function(r: string) {
            let t: number, s: number, f: number;
            const e = 0.02519603282416938;
            for(let u = 0; u < r.length; u++) {
                s = r.charCodeAt(u);
                f = (e * (n += s) - (n * e | 0));
                n = 4294967296 * ((t = f * (e * n | 0)) - (t | 0)) + (t | 0);
            }
            return (n | 0) * 2.3283064365386963e-10;
        }
    }

    const m = mash();
    let a = m(" ");
    let b = m(" ");
    let c = m(" ");
    let x = 1;
    a -= m(seed);
    b -= m(seed);
    c -= m(seed);
    if (a < 0) a++;
    if (b < 0) b++;
    if (c < 0) c++;

    return function() {
        const y = x * 2.3283064365386963e-10 + a * 2091639;
        a = b;
        b = c;
        return c = y - (x = y | 0);
    };
}

/** Returns the provided array shuffled with the specified rng function.
 *  Doesn't alter the provided array.
 *  Uses Math.random by default. */
export function toShuffled<T>(array: T[], rng: () => number = Math.random): T[] {
    const shuffled = [...array];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const random = Math.floor(rng() * (index + 1));
        [shuffled[index], shuffled[random]] = [shuffled[random], shuffled[index]];
    }
    return shuffled;
}
