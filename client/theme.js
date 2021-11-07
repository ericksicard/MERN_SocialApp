//Customizing the Material-UI theme
/*The Material-UI theme can be easily customized using the ThemeProvider component.
It can also be used to configure the custom values of theme variables in createTheme().
We will define a custom theme for the skeleton application using createMuiTheme,
and then export it so that it can be used in the App component.
For the skeleton, we only apply minimal customization by setting some color values
to be used in the UI. The theme variables that are generated here will be passed to,
and available in, all the components we build.
*/
import { createTheme } from '@material-ui/core/styles'
import { pink } from '@material-ui/core/colors'

const theme = createTheme ({
    typography: { useNextVariants: true },
    palette: {
        primary: {
            light: '#757de8',
            main: '#3f51b5',
            dark: '#002984',
            contrastText: '#ffffff'
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000000',
        },
        openTitle: '#3f4771',
        protectedTitle: pink['400'],
        type: 'light'
    }
})

export default theme
