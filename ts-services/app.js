"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const environment_prod_1 = require("./environments/environment.prod");
const UserService = __importStar(require("./routes/user_service"));
const SERVICE_PORT = environment_prod_1.environment.service_port;
class Services {
    constructor() {
        this.credentials = {
            key: fs_1.default.readFileSync(environment_prod_1.environment.tls_key_file, 'utf8'),
            cert: fs_1.default.readFileSync(environment_prod_1.environment.tls_cert_file, 'utf8')
        };
        this.app = (0, express_1.default)();
        this.app.use(body_parser_1.default.json());
        var corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200
        };
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.use(`/`, UserService.router);
        //this.server = http.createServer(this.app);
        // uncomment to use https:
        this.server = https_1.default.createServer(this.credentials, this.app);
    }
    startServer(port) {
        this.server.listen(port, () => {
            console.log(`Server listening for requests on port ${SERVICE_PORT}`);
        });
    }
}
let services = new Services();
services.startServer(SERVICE_PORT);
