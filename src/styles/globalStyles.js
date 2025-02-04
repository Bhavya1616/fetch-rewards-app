// globalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
  }

  .login-form-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  input {
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background-color: #45a049;
  }

  .dog-search {
    padding: 20px;
    text-align: center;
  }

  .navbar {
    background-color: #333;
    padding: 10px;
  }

  .navbar ul {
    list-style-type: none;
    padding: 0;
  }

  .navbar li {
    display: inline;
    margin-right: 10px;
  }

  .navbar a {
    color: white;
    text-decoration: none;
  }

  .navbar a:hover {
    text-decoration: underline;
  }
`;

export default GlobalStyles;
