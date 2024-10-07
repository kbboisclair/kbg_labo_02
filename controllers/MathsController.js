// import BookmarkModel from '../models/bookmark.js';
// import Repository from '../models/repository.js';
import Controller from './Controller.js';
import * as mathUtilities from "../mathUtilities.js";
import path from 'path';
import fs from 'fs';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
        
    } 

    get(id) {

        let query = this.HttpContext.path.queryString;
        if(query == '?'){
            let resourcePath = path.join(process.cwd(), wwwroot, "API-Help/maths-help.html");
            this.HttpContext.response.HTML(fs.readFileSync(resourcePath));
            return;
        }

        let params = this.HttpContext.path.params;
        const validOps = [" ", "-", "*", "/", "%", "!", "p", "np"];
        let expectedParams = ["op"];
        let receivedParams = Object.keys(params);
        let data = params;
        let x = null;
        let y = null;
        let n = null;
        
        // Valider si l'opérateur est défini !!!!!!!!! A FAIRE
        

        // Validation de l'opérateur     
        if (!receivedParams.includes("op")) {   // Si l'opérateur n'est pas spécifié
            data.error = `'op' parameter is missing`;
            this.HttpContext.response.JSON(data);
            return;
        } else if (!validOps.includes(params.op)) { // Si l'opérateur n'est pas valide
            data.error = `${params.op} operator is not autorized`;
            this.HttpContext.response.JSON(data);
            return;
        }

        // Ajout des parametres attendus
        if ([" ", "-", "*", "/", "%"].includes(params.op)) {
            expectedParams.push("x", "y");
        } else if (["!", "p", "np"].includes(params.op)) {
            expectedParams.push("n");
        }

        // Validation des parametres manquants
        for (let expectedParam of expectedParams) {
            if (!receivedParams.includes(expectedParam)) {
                data.error = `${expectedParam} parameter is missing`;
                this.HttpContext.response.JSON(data);
                return;
            }
        }

        // Validation des parametres extra
        for (let param of receivedParams) {            
            if (!expectedParams.includes(param)) {
                data.error = `too many parameters`;
                this.HttpContext.response.JSON(data);
                return;
            }
        }

        // Validation des nombres
        if ([" ", "-", "*", "/", "%"].includes(params.op)) {
            if(params.op === " "){
                data.op = "+";
            }

            if(!params.x || params.x === null){
                data.error = `x parameter is missing`;
                this.HttpContext.response.JSON(data);
                return;
            }
            
            if(!params.y || params.y === null){
                data.error = `y parameter is missing`;
                this.HttpContext.response.JSON(data);
                return;
            }
            
            if (isNaN(params.x)) {
                data.error = `x parameter is not a number`;
                this.HttpContext.response.JSON(data);
                return;
            } 
            
            if (isNaN(params.y)) {
                data.error = `y parameter is not a number`;
                this.HttpContext.response.JSON(data);
                return;
            } 
            
            x = parseFloat(params.x);
            y = parseFloat(params.y);
            data.x = parseFloat(params.x);
            data.y = parseFloat(params.y);
            

        } else if (["!", "p", "np"].includes(params.op)) {
            if (isNaN(params.n)) {
                data.error = `n parameter is not a number`;
                this.HttpContext.response.JSON(data);
                return;
            } 
            
            n = parseFloat(params.n);
            data.n = n;

            if (!Number.isInteger(n) || n <= 0) {
                data.error = "n parameter must be an integer > 0";
                this.HttpContext.response.JSON(data);
                return;
            }
        }

        // Calcul
        switch (params.op) {
            case "+":
                data.op = "+";
                data.value = parseFloat(params.x) + parseFloat(params.y);
                break;
            case "-":
                data.value = parseFloat(params.x) - parseFloat(params.y);
                break;
            case "*":
                data.value = parseFloat(params.x) * parseFloat(params.y);

                break;
            case "/":
                if (y === 0 && x === 0) {  // Division de 0 par 0
                    data.value = "NaN";
                } else if (y === 0) {      // Division par 0
                    data.value = "Infinity";
                } else {
                    data.value = x / y;    // Division normale
                }
                break;
            case "%":               
                if (y === 0) {  // Vérifier la division par 0
                    data.value = "NaN";
                } else {
                    data.value = x % y;  // Effectuer l'opération modulo
                }
                break;
            case "!":
                data.value = mathUtilities.factorial(parseInt(params.n));
                break;
            case "p":
                data.value = mathUtilities.isPrime(parseInt(params.n));
                break;
            case "np":
                data.value = mathUtilities.findPrime(parseInt(params.n));
                break;
        }

        // Retourner le resultat
        this.HttpContext.response.JSON(data);
    }
}