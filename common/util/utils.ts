export function nextValue<T>(array:T[], current:T):T {
    const nextIndex = (array.indexOf(current) + 1) % array.length;
    return array[nextIndex];
}
