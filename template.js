/*When the server receives a request to the root URL, this HTML template will be
rendered in the browser, and the div element with ID "root" will contain our React
component.*/

export default ({markup, css}) => {
    return `<!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                <title>MERN Social</title>
            </head>
            <body>
                <div id="root">${markup}</div>
                <style id="jss-server-side">${css}</style>
                <script type="text/javascript" src="/dist/bundle.js"></script>
            </body>
        </html>`
    }