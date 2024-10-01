export function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

export function isPrime(value) {
    if (value <= 1) return false;
    for (let i = 2; i <= Math.sqrt(value); i++) {
        if (value % i === 0) return false;
    }
    return true;
}
export function findPrime(n) {
    let primeNumber = 0;
    for (let i = 0; i < n; i++) {
        primeNumber++;
        while (!isPrime(primeNumber)) {
            primeNumber++;
        }
    }
    return primeNumber;
}