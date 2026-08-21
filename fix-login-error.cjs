const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf-8');

file = file.replace(
    /setErrorMsg\(err\.message \|\| 'Login failed\.'\);/g,
    \if (err.code === 'auth/operation-not-allowed') {
          setErrorMsg('Email/Password login is disabled. If you signed up with Google, please click the "Sign in with Google" button.');
        } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          setErrorMsg('Invalid email or password. Did you sign up with Google?');
        } else {
          setErrorMsg(err.message || 'Login failed.');
        }\
);

fs.writeFileSync('src/App.jsx', file, 'utf-8');
console.log('Error handling improved');
