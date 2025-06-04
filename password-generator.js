// Password Generator Functionality
const passwordText = document.getElementById('passwordText');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthRange = document.getElementById('lengthRange');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercaseCheck');
const lowercaseCheck = document.getElementById('lowercaseCheck');
const numbersCheck = document.getElementById('numbersCheck');
const symbolsCheck = document.getElementById('symbolsCheck');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Update length display when slider changes
lengthRange.addEventListener('input', () => {
    lengthValue.textContent = lengthRange.value;
});

function generatePassword() {
    let chars = '';
    const length = parseInt(lengthRange.value);
    
    if (uppercaseCheck.checked) chars += characters.uppercase;
    if (lowercaseCheck.checked) chars += characters.lowercase;
    if (numbersCheck.checked) chars += characters.numbers;
    if (symbolsCheck.checked) chars += characters.symbols;
    
    if (chars.length === 0) {
        passwordText.textContent = 'Select at least one option';
        strengthBar.style.width = '0%';
        strengthText.textContent = 'weak';
        return;
    }
    
    let password = '';
    const charsArray = chars.split('');
    
    // Shuffle array for more randomness
    for (let i = charsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [charsArray[i], charsArray[j]] = [charsArray[j], charsArray[i]];
    }
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsArray.length);
        password += charsArray[randomIndex];
    }
    
    passwordText.textContent = password;
    updateStrengthMeter(password);
}

function updateStrengthMeter(password) {
    let strength = 0;
    const length = password.length;
    
    // Length score
    strength += Math.min(length * 4, 40);
    
    // Character diversity
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    const charTypes = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
    strength += (charTypes - 1) * 15;
    
    // Complexity bonus
    if (hasSymbols && hasUppercase && hasLowercase && hasNumbers) {
        strength += 15;
    }
    
    // Normalize to 100
    strength = Math.min(strength, 100);
    
    // Update strength display
    strengthBar.style.width = `${strength}%`;
    
    let strengthLevel, strengthColor;
    if (strength < 40) {
        strengthLevel = 'Weak';
        strengthColor = '#ff4444';
    } else if (strength < 70) {
        strengthLevel = 'Medium';
        strengthColor = '#ffbb33';
    } else if (strength < 90) {
        strengthLevel = 'Strong';
        strengthColor = '#00C851';
    } else {
        strengthLevel = 'Very strong';
        strengthColor = '#34eb8f';
    }
    
    strengthBar.style.backgroundColor = strengthColor;
    strengthText.textContent = strengthLevel;
    strengthText.style.color = strengthColor;
}

// Copy password to clipboard
copyBtn.addEventListener('click', () => {
    const password = passwordText.textContent;
    if (password && password !== 'Your password will appear here' && password !== 'Select at least one option') {
        navigator.clipboard.writeText(password).then(() => {
            copyBtn.textContent = 'copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy password';
            }, 2000);
        });
    }
});

// Generate password on button click
generateBtn.addEventListener('click', generatePassword);

// Generate initial password on load
generatePassword();