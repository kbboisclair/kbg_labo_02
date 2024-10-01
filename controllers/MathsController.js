// import BookmarkModel from '../models/bookmark.js';
// import Repository from '../models/repository.js';
import Controller from './Controller.js';
import * as mathUtilities from "../utilities.js";

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    } 

    get(id) {
        const validOps = [" ", "-", "*", "/", "%", "!", "p", "np"];
        let expectedParams = ["op"];
        let params = this.HttpContext.path.params;
        let receivedParams = Object.keys(params);
        let data = params;
        
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

        } else if (["!", "p", "np"].includes(params.op)) {
            if (isNaN(params.n)) {
                data.error = `n parameter is not a number`;
                this.HttpContext.response.JSON(data);
                return;
            }
        }

        // Calcul
        switch (params.op) {
            case " ":
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
                if (parseFloat(params.y) === 0) {
                    data.value = `Infinity`;
                } else {
                    data.value = parseFloat(params.x) / parseFloat(params.y);
                }
                break;
            case "%":
                let result = parseFloat(params.x) % parseFloat(params.y);  
                if (!result || isNaN(result)){
                    data.value = `NaN`;
                } else {
                    data.value = result;
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