//Modules
import fastify, { FastifyReply, FastifyRequest } from 'fastify'; //the REST API library
import { render } from "nunjucks"; //renders the templates
import { request } from "undici"; //http request library

const app = fastify(), //applet
    ip: string = "0.0.0.0", //leave like this if it works
    PORT: number = 8080; //change as you wish

const start: Function = async () => { //function that will start the server
    try {
        await app.listen(PORT, '0.0.0.0', (): void => console.log('SERVER LISTENING AT PORT: ' + PORT)) //server is up!
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start(); //starts the server

function getSubpath(reqPar: any): string { //retrieves parameters
    return reqPar["*"];
}

function printc(text: string): void { console.log("\x1b[35;1m" + text + "\x1b[0m") }; //cool print

app.get('/*', async (req: FastifyRequest, res: FastifyReply) => {
    const subpath = getSubpath(req.params); //gets subpath parameter
    if (subpath != undefined) { //check if parameter is not given
        const origin = "https://deviantart.com/" + subpath;
        const { body } = await request("https://backend.deviantart.com/oembed?url=" + origin); //http request to retrieve json
        try { //this is basically for if body is not json OR http request returns nothing significant
            const data = await body.json(); //jsonify
            printc(`Rendering "${origin}"`); //tell server manager that we are rendering something
            res.type('text/html');
            res.send(render('templates/index.html', { img: data['url'], url: origin, desc: data['title'] })); //return the the template
        } catch (error) { //error can be used if wanted
            res.send("Error Failed to Retrive Image"); //these can be changed to error templates as well, if they don't work
        }
    } else {
        res.send("Error No Url Provided");
    }
});