
// command k command g

// mui theme settings

export const tokensDark = {
    grey: {
        // 0: "#f4f2f5",       //background colour for every page 
        0: "#ffffff",       //background colour for every page 
        10: "#f6f6f6",      // manually adjusted
        50: "#4385EA",      //logo blue
        100: "#e0e0e0",     //darker grey
        200: "#636161",     
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",     //very dark grey
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414",
        1000: "#000000",    // manually adjusted
    },
    primary: {
        100: "#6200EE",     
        200: "#f8a5a7",
        300: "#f5777b",
        400: "#3697E5",     //sky blue, the active sidebar title font colour when hover 
        500: "#747474",     //normal grey
        600: "#be171c",
        700: "#8f1115",     //gold yellow
        800: "#5f0c0e",
        900: "#300607"
    },
    secondary: {
        50: "#f0f0f0",      // manually adjusted
        100: "#fff6e0",
        200: "#ffedc2",
        300: "#ffe3a3",
        400: "#ffda85",
        500: "#ffd166",
        600: "#ffffff",     //active sidebar background colour  //secondary600
        700: "#997d3d",     //secondary700
        800: "#665429",
        900: "#332a14",
    },
}

// function that reverses the color palette
function reverseTokens(tokensDark) {
    const reversedTokens = {};

    Object.entries(tokensDark).forEach(([key, val]) => {

        const keys = Object.keys(val);
        const values = Object.values(val);
        const length = keys.length;
        const reversedObj = {};

        for (let i = 0; i < length; i++) {
            reversedObj[keys[i]] = values[length - i - 1];
        }

        reversedTokens[key] = reversedObj;
    });

    return reversedTokens;
}

export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {

    return {
        palette: {
            mode: mode,
            ...(mode === "dark"
                ? {
                    // palette values for dark mode
                    primary: {
                        ...tokensDark.primary,
                        main: tokensDark.primary[400],
                        light: tokensDark.primary[400],
                    },
                    secondary: {
                        ...tokensDark.secondary,
                        main: tokensDark.secondary[300],
                    },
                    neutral: {
                        ...tokensDark.grey,
                        main: tokensDark.grey[500],
                    },
                    background: {
                        default: tokensDark.primary[600],
                        alt: tokensDark.primary[500],
                    },
                }
                : {
                    // palette values for light mode
                    primary: {
                        ...tokensLight.primary,
                        main: tokensDark.grey[50],          //lighter grey
                        light: tokensDark.grey[100],        //darker grey
                    },
                    secondary: {
                        ...tokensLight.secondary,
                        main: tokensDark.secondary[600],    //white
                        light: tokensDark.secondary[700],   //gold yellow
                    },
                    neutral: {
                        ...tokensLight.grey,
                        main: tokensDark.grey[500],         //very dark grey
                    },
                    background: {
                        default: tokensDark.grey[0],        //background colour for every page
                        alt: tokensDark.grey[50],           //lighter grey
                    },
                }),
        },

        typography: {
            fontFamily: ['Lato', 'sans-serif'].join(","),
            fontSize: 13,
            h1: {
                fontFamily: ['Lato', 'sans-serif'].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ['Lato', 'sans-serif'].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ['Lato', 'sans-serif'].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ['Lato', 'sans-serif'].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ['Lato', 'sans-serif'].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ['Lato', 'sans-serif'].join(","),
                fontSize: 13,
            },
            h7: {
                fontFamily: ['Lato', 'sans-serif'].join(","),
                fontSize: 12,
            },
            h8: {
                fontFamily: ['Lato', 'sans-serif'].join(","),
                fontSize: 9,
            },
        },
    };
};

