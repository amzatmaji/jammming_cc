const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5174/callback';


// Generates a random string containing numbers and letters
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = window.crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};


// Generates a code challenge from a code verifier
const generateCodeChallenge = async (verifier) => {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const getAccessToken = () => {
  // Check if we have a stored token
  const storedToken = window.localStorage.getItem('spotifyAccessToken');
  const tokenExpiry = window.localStorage.getItem('spotifyAccessTokenExpiry');
  
  if (storedToken && tokenExpiry) {
    const now = Date.now();
    const expiryTime = Number(tokenExpiry);
    const timeUntilExpiry = expiryTime - now;
    
    if (now < expiryTime) {
      console.log(`Token valid for ${Math.round(timeUntilExpiry / 1000)} more seconds`);
      return storedToken;
    } else {
      console.log('Token expired, clearing...');
      window.localStorage.removeItem('spotifyAccessToken');
      window.localStorage.removeItem('spotifyAccessTokenExpiry');
    }
  }
  
  return null;
};

//function that initiates the Spotify authorization flow
// It checks for an existing access token, and if not found, it redirects the user to Spotify's authorization page.
// The function generates a code verifier and code challenge for PKCE, stores them, and constructs the authorization URL with the necessary parameters.

export const accessSpotify = async () => {
  const accessToken = getAccessToken();
  
  if (accessToken) {
    return accessToken;
  }

  // Generate PKCE parameters
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store code verifier and redirect_uri for later (must match exactly)
  window.sessionStorage.setItem('code_verifier', codeVerifier);
  window.sessionStorage.setItem('redirect_uri', redirectUri);

  const scopes = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
    'user-read-email'
  ].join(' ');

  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `code_challenge_method=S256&` +
    `code_challenge=${codeChallenge}`;

  window.location = authUrl;
};

// Function to exchange authorization code for access token
const retrieveAccessToken = async (code, codeVerifier, redirectUriToUse) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUriToUse || redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token exchange failed:', response.status, errorText);
    const error = new Error(`Failed to exchange code for token: ${response.status}`);
    error.response = response;
    throw error;
  }

  const data = await response.json();
  console.log('Token exchange response:', data);
  return data;
};

// Function to handle the callback from Spotify after authorization
export const handleAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  if (error) {
    console.error('Authorization error:', error);
    window.history.replaceState({}, document.title, '/');
    return null;
  }

  if (!code) {
    return null;
  }

  // Check if we've already processed this code (prevent double processing)
  const processedCode = window.sessionStorage.getItem('processed_code');
  if (processedCode === code) {
    console.log('Code already processed, skipping');
    window.history.replaceState({}, document.title, '/');
    return null;
  }

  const codeVerifier = window.sessionStorage.getItem('code_verifier');
  const storedRedirectUri = window.sessionStorage.getItem('redirect_uri');
  
  if (!codeVerifier) {
    console.error('Code verifier not found in sessionStorage');
    window.history.replaceState({}, document.title, '/');
    return null;
  }

  // Use the stored redirect_uri if available, otherwise use the default
  const uriToUse = storedRedirectUri || redirectUri;

  try {
    console.log('Exchanging code for token...');
    console.log('Using redirect_uri:', uriToUse);
    
    // Mark code as being processed
    window.sessionStorage.setItem('processed_code', code);
    
    const tokenData = await retrieveAccessToken(code, codeVerifier, uriToUse);
    // console.log(tokenData);
    const accessToken = tokenData.access_token;
    // console.log(accessToken);
    const expiresIn = tokenData.expires_in;

    if (!accessToken) {
      console.error('No access token in response');
      window.sessionStorage.removeItem('processed_code');
      window.history.replaceState({}, document.title, '/');
      return null;
    }

      // Store token and expiry
      // For testing: use 30 seconds instead of actual expiry time
      // Change this back to: expiresIn * 1000 for production
      const testExpirySeconds = 30; // Set this to however many seconds you want for testing
      const expiryTime = Date.now() + testExpirySeconds * 1000;
      window.localStorage.setItem('spotifyAccessToken', accessToken);
      window.localStorage.setItem('spotifyAccessTokenExpiry', String(expiryTime));
      console.log(`Token stored, will expire in ${expiresIn} seconds at ${new Date(expiryTime).toLocaleTimeString()}`);
    
    // Clean up
    window.sessionStorage.removeItem('code_verifier');
    window.sessionStorage.removeItem('redirect_uri');
    window.sessionStorage.removeItem('processed_code');
    // Remove code from URL
    window.history.replaceState({}, document.title, '/');
    
    console.log('Token exchange successful');
    return accessToken;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    window.sessionStorage.removeItem('processed_code');
    
    if (error.response) {
      try {
        const errorText = await error.response.text();
        console.error('Error response:', errorText);
      } catch (e) {
        // Response already consumed or not readable
      }
    }
    window.history.replaceState({}, document.title, '/');
    return null;
  }
};
