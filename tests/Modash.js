function assertEqual(description, actual, expected) {
    if(actual === expected) {
        console.log(`[pass] ${description}`);
    } else {
        console.log(`[fail] ${description}`);
        console.log(`actual ${actual}`);
        console.log(`expected ${expected}`);
    }
}
