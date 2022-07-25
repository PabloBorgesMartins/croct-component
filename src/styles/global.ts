import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    :root{
        --white: #ffffff;
        --green: #04D361;
        --red: #C64D32;
        --blue: #3F80FF;
        --gray-100: #F2F5F8;
        --gray-300: #C7CDD3;
        --gray-500: #677489;
        --gray-700: #3D485F;
        --gray-900: #121214;
    }
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html{
        @media(max-width: 1080px){
            font-size: 93.75%;
        }
        @media(max-width: 720px){
            font-size: 87.5%;
        }
    }

    body{
        background: var(--white);
        -webkit-font-smoothing: antialised;
    }

    body, input, textarea, button{
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
    }

    h1, h2, h3, h4, h5, h6, strong{
        font-weight: 600;
    }

    button{
        cursor: pointer;
    }

    [disabled]{
        opacity: 0.6;
        cursor: not-allowed;
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    ::-webkit-scrollbar-track {
        background-color: var(--gray-900);
    }
    ::-webkit-scrollbar-thumb {
        background-color: var(--gray-100);
        border-radius: 16px;
    }
`
