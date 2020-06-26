module.exports = {
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 120,
    proseWrap: 'never',
    tabWidth: 4,
    overrides: [
        {
            files: '.prettierrc',
            options: {
                parser: 'json',
            },
        },
        {
            files: 'document.ejs',
            options: {
                parser: 'html',
            },
        },
    ],
};
