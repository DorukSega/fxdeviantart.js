"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Modules
const fastify_1 = __importDefault(require("fastify")); //the REST API library
const nunjucks_1 = require("nunjucks"); //renders the templates
const undici_1 = require("undici"); //http request library
const app = (0, fastify_1.default)(), //applet
ip = "0.0.0.0", //leave like this if it works
PORT = 8080; //change as you wish
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app.listen(PORT, '0.0.0.0', () => console.log('SERVER LISTENING AT PORT: ' + PORT)); //server is up!
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
});
start(); //starts the server
function getSubpath(reqPar) {
    return reqPar["*"];
}
function printc(text) { console.log("\x1b[35;1m" + text + "\x1b[0m"); }
; //cool print
app.get('/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subpath = getSubpath(req.params); //gets subpath parameter
    if (subpath != undefined) { //check if parameter is not given
        const origin = "https://deviantart.com/" + subpath;
        const { body } = yield (0, undici_1.request)("https://backend.deviantart.com/oembed?url=" + origin); //http request to retrieve json
        try { //this is basically for if body is not json OR http request returns nothing significant
            const data = yield body.json(); //jsonify
            printc(`Rendering "${origin}"`); //tell server manager that we are rendering something
            res.type('text/html');
            res.send((0, nunjucks_1.render)('templates/index.html', { img: data['url'], url: origin, desc: data['title'] })); //return the the template
        }
        catch (error) { //error can be used if wanted
            res.send("Error Failed to Retrive Image"); //these can be changed to error templates as well, if they don't work
        }
    }
    else {
        res.send("Error No Url Provided");
    }
}));
