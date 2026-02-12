// debug-test.js

// --- SIMULATE DATA TYPES HERE ---
// Try changing this to: "test@email.com:password123" 
// Or try: { email: "object@email.com" }
const user = { email: "object@email.com" }; 

console.log('--- DEBUG START ---');
console.log('Type of user:', typeof user);
console.log('Value of user:', user);

try {
    let emailDB;

    if (typeof user === 'string') {
        console.log('Result: Detected a STRING. Splitting...');
        [emailDB] = user.split(':');
    } else if (user && typeof user === 'object' && user.email) {
        console.log('Result: Detected an OBJECT. Accessing .email property...');
        emailDB = user.email;
    } else {
        console.log('Result: Variable is neither a splitable string nor a user object.');
    }

    console.log('Final emailDB value:', emailDB);
} catch (err) {
    console.error('An error occurred during logic:', err.message);
}
console.log('--- DEBUG END ---');
