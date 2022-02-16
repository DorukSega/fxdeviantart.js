import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { render } from "nunjucks";
import { request } from "undici";


const app = fastify(),
    ip: string = "0.0.0.0", //leave like this if it works
    PORT: string = process.env.port || "8080"; //change at your disposal 

const start: Function = async () => {
    try {
        await app.listen(PORT, '0.0.0.0', (): void => console.log('SERVER LISTENING AT PORT : ' + PORT)) //server is up!
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start(); //starts the server

function getSubpath(reqPar: any): string {
    return reqPar["*"];
}
function printc(text: string): void { console.log("\x1b[35;1m" + text + "\x1b[0m") };

app.get('/*', async (req: FastifyRequest, res: FastifyReply) => {
    const subpath = getSubpath(req.params);
    if (subpath != undefined) {
        const origin = "https://deviantart.com/" + subpath;
        const { body } = await request("https://backend.deviantart.com/oembed?url=" + origin);
        try {
            const data = await body.json();
            printc(`Rendering "${origin}"`);
            res.send(render('templates/index.html', { img: data['url'], url: origin, desc: data['title'] }))
        } catch (error) {
            res.send("Error Failed to Retrive Image");
        }

    } else {
        res.send("Error No Url Provided");
    }
});