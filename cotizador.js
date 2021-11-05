class Cotizador{
    constructor(pagoPromedio, recurso_solar, tarifa){
        this.pagoPromedio = pagoPromedio;
        this.recurso_solar = recurso_solar;
        this.tarifa = tarifa;
    }

    factibilidad() {
        if (this.tarifa === "1") {
            return (this.pagoPromedio < 650)? false: true
        }
        else if (this.tarifa === "1B") {
            return (this.pagoPromedio < 770)? false: true
        }
        else if (this.tarifa === "PDBT") {
            return (this.pagoPromedio < 250)? false: true
        }
        return null;
    }

    conEnergeticoPromBim(){
        var divisor = 0;
        const determinarDivisor = (rangos, divisores)=>{
            rangos.forEach((delimitador, i) => {
                if (this.pagoPromedio > delimitador) {
                    divisor = divisores[i];
                }
            });
        };
        if (this.factibilidad() != false && this.factibilidad() != null) {
            if (this.tarifa === "1") {
                const rangosT1 = [649,850,990,1250];
                const divisoresT1 = [1.964,2.192,2.414,1.251];
                determinarDivisor(rangosT1, divisoresT1);
            }
            else if (this.tarifa === "1B") {
                const rangosT1B = [769,1080,1400,1700,1840];
                const divisoresT1B = [1.851,2.106,2.296,2.371,6.561];
                determinarDivisor(rangosT1B, divisoresT1B);
            }
            else if (this.tarifa === "PDBT") {
                const rangosPDBT = [249,550,900,1250,1600,2000,2370,2730,3100,3460,
                                    3830,4550,5270,5990,6720,7450,8890,10330,11780,13230,
                                    15400,16850,18300,20470,23730,29150,32780,36400,43640,49651,
                                    54500];
                const divisoresPDBT = [6.761,5.528,5.123,4.92,4.785,4.703,4.648,4.605,4.572,4.545,
                                       4.515,4.485,4.462,4.445,4.431,4.415,4.399,4.387,4.378,4.372,
                                       4.363,4.359,4.354,4.349,4.342,4.338,4.334,4.331,4.328,4.326,
                                       null];
                determinarDivisor(rangosPDBT, divisoresPDBT);
            }
            return (divisor != null)? parseFloat((this.pagoPromedio/divisor).toFixed(2)) : null;
        }
    }

    tamanoSistema(){
        if (this.conEnergeticoPromBim() != null) {
            return parseFloat(((this.conEnergeticoPromBim()/60)/(this.recurso_solar*0.77)).toFixed(2));
        }
        return null;
    }
    numeroModulos(){
        const potenciasComerciales = [410, 440, 450, 470];
        return (this.tamanoSistema() != null)? Math.ceil((this.tamanoSistema()*1000)/potenciasComerciales[1]): null;
    }
    areaInstalacion(){
        return (this.numeroModulos()*2.7).toFixed(2);
    }
    potenciaFvInversor(){}
    costoSFV(){
        if (this.tamanoSistema() != null) {
            const tamanoSis = this.tamanoSistema() 
            var precioWatt = 0;
            if (tamanoSis > 0.8 && tamanoSis <= 6) precioWatt = 1.52
            else if (tamanoSis > 6 && tamanoSis <= 12) precioWatt = 1.4;
            else if (tamanoSis > 12 && tamanoSis <= 20) precioWatt = 1.25;
            return parseFloat(((this.tamanoSistema() * 1000 * precioWatt) * 20.1).toFixed(2));
        }
    }
    generacionEnergeticaBim(){
        return parseFloat((this.tamanoSistema() * 60 *  this.recurso_solar * 0.768).toFixed(2));
    }
    pagoCFEbim(){
        return (this.tarifa == "PDBT")? 200: 70;
    }
    ahorroAnual(){
        return 6*(this.pagoPromedio - this.pagoCFEbim());
    }

}
module.exports = Cotizador;