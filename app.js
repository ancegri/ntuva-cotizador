const express = require('express');
const path = require('path');
const pool = require('./db');
const Cotizador = require('./cotizador');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({extended: true}));

app.set('port', process.env.port || 1337);
app.set('view engine', 'ejs');

app.get('/', async (req, res)=>{
    const municipios = await pool.query('SELECT * FROM municipio');
    const implementaciones = await pool.query('SELECT * FROM implementacion');
    res.render('index', {municipios: municipios, implementaciones: implementaciones});
});

app.post('/cotizacion', async (req, res)=>{
    const { montoAlto, montoBajo, municipio, tipoTarifa, recibo, nombreCompleto, telefono, correo } = req.body;
    const pagoPromedio = (parseFloat(montoAlto) + parseFloat(montoBajo)) / 2;
    const municipiodb = await pool.query(`SELECT * FROM municipio WHERE id_municipio = ${municipio}`);
    const recursoSolar = parseFloat(municipiodb[0].recurso_solar);
    const tarifa = (tipoTarifa==='Residencial') ? municipiodb[0].tarifa : 'PDBT';
    const cotizacion = new Cotizador(pagoPromedio, recursoSolar, tarifa);
    const datosCotizacion = {
        'nombre': nombreCompleto,
        'telefono': telefono,
        'correo': correo,
        'pago_promedio': pagoPromedio,
        'consumo_energetico_bimestral': cotizacion.conEnergeticoPromBim(),
        'tamano_sistema': cotizacion.tamanoSistema(),
        'numero_paneles': cotizacion.numeroModulos(),
        'area_instalacion': cotizacion.areaInstalacion(),
        'generacion_energetica_bimestral': cotizacion.generacionEnergeticaBim(),
        'ahorro_anual': cotizacion.ahorroAnual(),
        'costo_sistema': cotizacion.costoSFV()

    };
    if (cotizacion.factibilidad()) res.render('cotizacion', datos_cotizacion = datosCotizacion);
    else res.end('No es factible la implementación');
});

app.listen(app.get('port'), ()=>{console.log('Corriendo en el puerto', app.get('port'));});