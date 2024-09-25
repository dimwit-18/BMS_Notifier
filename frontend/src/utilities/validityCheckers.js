export const isHttpLink = (text) => {
    const pattern = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/i; // Regex pattern to match HTTP/HTTPS links
    return pattern.test(text);
};

export const isValidEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex pattern for email validation
    return pattern.test(email);
};