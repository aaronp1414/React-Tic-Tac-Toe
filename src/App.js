import React from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import './App.css';
import Game from "./components/Game";

const theme = createMuiTheme({
    typography: {
        fontFamily: 'roboto',
        fontSize: 16,
        button: {
            textTransform: 'none'
        }
    }
});

class App extends React.Component{
    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <Game />
                </div>
            </ThemeProvider>
        );
    }
}

export default App;