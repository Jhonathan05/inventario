const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de catálogos...');

    const catalogos = [
        // ADMINISTRACIÓN
        { dominio: 'EMPRESA_PROPIETARIA', valores: ['ALMACAFE', 'FEDERACION', 'BANCOLOMBIA', 'CAFECERT', 'FONDO NACIONAL'] },
        { dominio: 'FUENTE_RECURSO', valores: ['FON1', 'FON2', 'FEPC'] },
        { dominio: 'TIPO_RECURSO', valores: ['PAC', 'PROYECTO', 'RECURSO PROPIO'] },
        { dominio: 'TIPO_CONTROL', valores: ['CONTROLADO', 'ADMINISTRADO'] },
        { dominio: 'ESTADO_OPERATIVO', valores: ['ALMACENADO', 'TRÁNSITO', 'EN OPERACIÓN', 'BAJA', 'HURTO'] },
        {
            dominio: 'RAZON_ESTADO', valores: [
                'DISPONIBLE', 'CUSTODIA', 'ALISTAMIENTO / SOPORTE', 'RENOVACIÓN', 'PROCESAR BAJA',
                'DESPACHO', 'RETORNO', 'ASIGNACIÓN RESPONSABLE', 'PRÉSTAMO', 'HURTO / PERDIDA',
                'DEVUELTO A PROVEEDOR', 'DONACIÓN', 'BAJA'
            ]
        },

        // FUNCIONARIO
        { dominio: 'EMPRESA_FUNCIONARIO', valores: ['ALMACAFE', 'FEDERACION', 'TIVIT', 'SAMTEL', 'TECNOFILE'] },
        { dominio: 'TIPO_PERSONAL', valores: ['EMPLEADO', 'CONTRATISTA'] },
        {
            dominio: 'CARGO', valores: [
                'Analista', 'Analista Bienes y Servicios', 'Analista Compras', 'Analista Financiero',
                'Analista Gestión Humana', 'Analista Planeación Financiera y Presupuesto',
                'Analista Programa de Comunicaciones', 'Analista Proyectos', 'Analista TIC',
                'Aprendiz', 'Auxiliar Administrativo', 'Auxiliar Bienes y Servicios',
                'Auxiliar Gestión Humana', 'Auxiliar Servicios', 'Coordinador Administrativo',
                'Coordinador Contable', 'Coordinador Financiero', 'Coordinador Fortalecimiento Gremial',
                'Coordinador Grupo Beneficio Ecológico', 'Coordinador Programa',
                'Coordinador Seccional Extensión Rural', 'Director Ejecutivo', 'Extensionista',
                'Líder Departamental Extensión Rural', 'No Aplica', 'Pasante',
                'Profesional Desarrollo Social', 'Promotor Desarrollo Rural', 'Recepción',
                'Sica', 'Tesorero Auxiliar'
            ]
        },

        // EQUIPO
        {
            dominio: 'TIPO_EQUIPO', valores: [
                'EQUIPO ESCRITORIO', 'EQUIPO PORTATIL', 'EQUIPO TODO EN UNO', 'IMPRESORA',
                'TABLETA', 'ESCANER', 'MONITOR', 'VIDEO BEAM', 'TELEFONO IP', 'SWITCH',
                'ROUTER', 'PLANTA TELEFONIA IP', 'UPS', 'SERVIDOR', 'CAMARA IP', 'BOCINA',
                'MICROFONO', 'CONTROLADORA MICROFONO'
            ]
        },
        {
            dominio: 'PROCESADOR', valores: [
                '11TH GEN INTEL(R) CORE(TM) I3-1115G4 @ 3.00GHZ', '11TH GEN INTEL(R) CORE(TM) I5-1135G7 @ 2.40GHZ',
                '11TH GEN INTEL(R) CORE(TM) I5-11400 @ 2.60GHZ', '11TH GEN INTEL(R) CORE(TM) I5-11400T @ 1.30GHZ',
                '11TH GEN INTEL(R) CORE(TM) I5-1145G7 @ 2.60GHZ', '11TH GEN INTEL(R) CORE(TM) I5-1155G7 @ 2.50GHZ',
                '11TH GEN INTEL(R) CORE(TM) I7-11370H @ 3.30GHZ', '11TH GEN INTEL(R) CORE(TM) I7-1165G7 @ 2.80GHZ',
                '11TH GEN INTEL(R) CORE(TM) I7-11700 @ 2.50GHZ', '11TH GEN INTEL(R) CORE(TM) I7-11700T @ 1.40GHZ',
                '11TH GEN INTEL(R) CORE(TM) I7-11800H @ 2.30GHZ', '12TH GEN INTEL(R) CORE(TM) I5-1235U',
                '12TH GEN INTEL(R) CORE(TM) I5-1240P', '12TH GEN INTEL(R) CORE(TM) I5-12450H',
                '12TH GEN INTEL(R) CORE(TM) I5-12500', '12TH GEN INTEL(R) CORE(TM) I7-1250U',
                '12TH GEN INTEL(R) CORE(TM) I7-1255U', '12TH GEN INTEL(R) CORE(TM) I7-1260P',
                '12TH GEN INTEL(R) CORE(TM) I7-1260U', '12TH GEN INTEL(R) CORE(TM) I7-1265U',
                '12TH GEN INTEL(R) CORE(TM) I7-12700', '12TH GEN INTEL(R) CORE(TM) I7-12700H',
                '12TH GEN INTEL(R) CORE(TM) I7-12700T', '12TH GEN INTEL(R) CORE(TM) I7-1280P',
                '13TH GEN INTEL(R) CORE(TM) I5-1335U', '13TH GEN INTEL(R) CORE(TM) I5-13400T',
                '13TH GEN INTEL(R) CORE(TM) I5-13420H', '13TH GEN INTEL(R) CORE(TM) I5-13500',
                '13TH GEN INTEL(R) CORE(TM) I5-13500T', '13TH GEN INTEL(R) CORE(TM) I7-1355U',
                '13TH GEN INTEL(R) CORE(TM) I7-1360P', '13TH GEN INTEL(R) CORE(TM) I7-1365U',
                '13TH GEN INTEL(R) CORE(TM) I7-13700', 'AMD A10-8700P RADEON R6, 10 COMPUTE CORES 4C+6G',
                'AMD A6-9210 RADEON R4, 5 COMPUTE CORES 2C+3G', 'AMD A9-9425 RADEON R5, 5 COMPUTE CORES 2C+3G',
                'AMD ATHLON(TM) X2 DUAL CORE PROCESSOR 3250E', 'AMD E1-1500 APU WITH RADEON(TM) HD GRAPHICS',
                'AMD E2-7110 APU WITH AMD RADEON R2 GRAPHICS', 'AMD RYZEN 3 2200U WITH RADEON VEGA MOBILE GFX',
                'AMD RYZEN 3 3200U WITH RADEON VEGA MOBILE GFX', 'AMD RYZEN 3 5300U WITH RADEON GRAPHICS',
                'AMD RYZEN 5 3450U WITH RADEON VEGA MOBILE GFX', 'AMD RYZEN 5 3500U WITH RADEON VEGA MOBILE GFX',
                'AMD RYZEN 5 5500U WITH RADEON GRAPHICS', 'AMD RYZEN 5 5600H WITH RADEON GRAPHICS',
                'AMD RYZEN 5 7520U WITH RADEON GRAPHICS', 'AMD RYZEN 5 PRO 7530U WITH RADEON GRAPHICS',
                'AMD RYZEN 7 5700G WITH RADEON GRAPHICS', 'AMD RYZEN 7 5700U WITH RADEON GRAPHICS',
                'AMD RYZEN 7 7735U WITH RADEON GRAPHICS', 'AMD RYZEN 7 PRO 5750G WITH RADEON GRAPHICS',
                'AMD RYZEN 7 PRO 7730U WITH RADEON GRAPHICS', 'AMD RYZEN 7 PRO 7840HS W/ RADEON 780M GRAPHICS',
                'AMD RYZEN 7 PRO 8840U W/ RADEON 780M GRAPHICS', 'AMD RYZEN 9 5900HX WITH RADEON GRAPHICS',
                'AMD RYZEN THREADRIPPER PRO 3945WX 12-CORES', 'APPLE M1', 'APPLE M1 PRO', 'APPLE M2',
                'APPLE M3', 'INTEL(R) ATOM(TM) X5-Z8550 CPU @ 1.44GHZ', 'INTEL(R) CELERON(R) CPU G3900 @ 2.80GHZ',
                'INTEL(R) CELERON(R) CPU N3060 @ 1.60GHZ', 'INTEL(R) CELERON(R) J4005 CPU @ 2.00GHZ',
                'INTEL(R) CORE(TM) I3 CPU 540 @ 3.07GHZ', 'INTEL(R) CORE(TM) I3 CPU M 350 @ 2.27GHZ',
                'INTEL(R) CORE(TM) I3-1005G1 CPU @ 1.20GHZ', 'INTEL(R) CORE(TM) I3-10105 CPU @ 3.70GHZ',
                'INTEL(R) CORE(TM) I3-2100 CPU @ 3.10GHZ', 'INTEL(R) CORE(TM) I3-2120 CPU @ 3.30GHZ',
                'INTEL(R) CORE(TM) I3-2310M CPU @ 2.10GHZ', 'INTEL(R) CORE(TM) I3-2350M CPU @ 2.30GHZ',
                'INTEL(R) CORE(TM) I3-3110M CPU @ 2.40GHZ', 'INTEL(R) CORE(TM) I3-3217U CPU @ 1.80GHZ',
                'INTEL(R) CORE(TM) I3-3220 CPU @ 3.30GHZ', 'INTEL(R) CORE(TM) I3-3240T CPU @ 2.90GHZ',
                'INTEL(R) CORE(TM) I3-3245 CPU @ 3.40GHZ', 'INTEL(R) CORE(TM) I3-4005U CPU @ 1.70GHZ',
                'INTEL(R) CORE(TM) I3-4030U CPU @ 1.90GHZ', 'INTEL(R) CORE(TM) I3-4150T CPU @ 3.00GHZ',
                'INTEL(R) CORE(TM) I3-4160 CPU @ 3.60GHZ', 'INTEL(R) CORE(TM) I3-4170 CPU @ 3.70GHZ',
                'INTEL(R) CORE(TM) I3-5005U CPU @ 2.00GHZ', 'INTEL(R) CORE(TM) I3-6006U CPU @ 2.00GHZ',
                'INTEL(R) CORE(TM) I3-6100 CPU @ 3.70GHZ', 'INTEL(R) CORE(TM) I3-6100T CPU @ 3.20GHZ',
                'INTEL(R) CORE(TM) I3-6100U CPU @ 2.30GHZ', 'INTEL(R) CORE(TM) I3-7020U CPU @ 2.30GHZ',
                'INTEL(R) CORE(TM) I3-7100 CPU @ 3.90GHZ', 'INTEL(R) CORE(TM) I3-8100 CPU @ 3.60GHZ',
                'INTEL(R) CORE(TM) I3-8100T CPU @ 3.10GHZ', 'INTEL(R) CORE(TM) I5 CPU 650 @ 3.20GHZ',
                'INTEL(R) CORE(TM) I5 CPU M 460 @ 2.53GHZ', 'INTEL(R) CORE(TM) I5-10210U CPU @ 1.60GHZ',
                'INTEL(R) CORE(TM) I5-10310U CPU @ 1.70GHZ', 'INTEL(R) CORE(TM) I5-1035G1 CPU @ 1.00GHZ',
                'INTEL(R) CORE(TM) I5-10400 CPU @ 2.90GHZ', 'INTEL(R) CORE(TM) I5-10400T CPU @ 2.00GHZ',
                'INTEL(R) CORE(TM) I5-10500 CPU @ 3.10GHZ', 'INTEL(R) CORE(TM) I5-10500T CPU @ 2.30GHZ',
                'INTEL(R) CORE(TM) I5-10505 CPU @ 3.20GHZ', 'INTEL(R) CORE(TM) I5-10600 CPU @ 3.30GHZ',
                'INTEL(R) CORE(TM) I5-2400 CPU @ 3.10GHZ', 'INTEL(R) CORE(TM) I5-2400S CPU @ 2.50GHZ',
                'INTEL(R) CORE(TM) I5-2410M CPU @ 2.30GHZ', 'INTEL(R) CORE(TM) I5-2430M CPU @ 2.40GHZ',
                'INTEL(R) CORE(TM) I5-2450M CPU @ 2.50GHZ', 'INTEL(R) CORE(TM) I5-3210M CPU @ 2.50GHZ',
                'INTEL(R) CORE(TM) I5-3230M CPU @ 2.60GHZ', 'INTEL(R) CORE(TM) I5-3320M CPU @ 2.60GHZ',
                'INTEL(R) CORE(TM) I5-3337U CPU @ 1.80GHZ', 'INTEL(R) CORE(TM) I5-3340M CPU @ 2.70GHZ',
                'INTEL(R) CORE(TM) I5-3450S CPU @ 2.80GHZ', 'INTEL(R) CORE(TM) I5-3470 CPU @ 3.20GHZ',
                'INTEL(R) CORE(TM) I5-3470S CPU @ 2.90GHZ', 'INTEL(R) CORE(TM) I5-3470T CPU @ 2.90GHZ',
                'INTEL(R) CORE(TM) I5-3550 CPU @ 3.30GHZ', 'INTEL(R) CORE(TM) I5-3570 CPU @ 3.40GHZ',
                'INTEL(R) CORE(TM) I5-4200M CPU @ 2.50GHZ', 'INTEL(R) CORE(TM) I5-4200U CPU @ 1.60GHZ',
                'INTEL(R) CORE(TM) I5-4210U CPU @ 1.70GHZ', 'INTEL(R) CORE(TM) I5-4300U CPU @ 1.90GHZ',
                'INTEL(R) CORE(TM) I5-4310U CPU @ 2.00GHZ', 'INTEL(R) CORE(TM) I5-4430 CPU @ 3.00GHZ',
                'INTEL(R) CORE(TM) I5-4430S CPU @ 2.70GHZ', 'INTEL(R) CORE(TM) I5-4460S CPU @ 2.90GHZ',
                'INTEL(R) CORE(TM) I5-4460T CPU @ 1.90GHZ', 'INTEL(R) CORE(TM) I5-4570 CPU @ 3.20GHZ',
                'INTEL(R) CORE(TM) I5-4570S CPU @ 2.90GHZ', 'INTEL(R) CORE(TM) I5-4590 CPU @ 3.30GHZ',
                'INTEL(R) CORE(TM) I5-4590S CPU @ 3.00GHZ', 'INTEL(R) CORE(TM) I5-5200U CPU @ 2.20GHZ',
                'INTEL(R) CORE(TM) I5-5300U CPU @ 2.30GHZ', 'INTEL(R) CORE(TM) I5-6200U CPU @ 2.30GHZ',
                'INTEL(R) CORE(TM) I5-6300U CPU @ 2.40GHZ', 'INTEL(R) CORE(TM) I5-6400 CPU @ 2.70GHZ',
                'INTEL(R) CORE(TM) I5-6400T CPU @ 2.20GHZ', 'INTEL(R) CORE(TM) I5-6500 CPU @ 3.20GHZ',
                'INTEL(R) CORE(TM) I5-6500T CPU @ 2.50GHZ', 'INTEL(R) CORE(TM) I5-6600T CPU @ 2.70GHZ',
                'INTEL(R) CORE(TM) I5-7200U CPU @ 2.50GHZ', 'INTEL(R) CORE(TM) I5-7300U CPU @ 2.60GHZ',
                'INTEL(R) CORE(TM) I5-7400 CPU @ 3.00GHZ', 'INTEL(R) CORE(TM) I5-7400T CPU @ 2.40GHZ',
                'INTEL(R) CORE(TM) I5-7500 CPU @ 3.40GHZ', 'INTEL(R) CORE(TM) I5-7500T CPU @ 2.70GHZ',
                'INTEL(R) CORE(TM) I5-8250U CPU @ 1.60GHZ', 'INTEL(R) CORE(TM) I5-8257U CPU @ 1.40GHZ',
                'INTEL(R) CORE(TM) I5-8265U CPU @ 1.60GHZ', 'INTEL(R) CORE(TM) I5-8350U CPU @ 1.70GHZ',
                'INTEL(R) CORE(TM) I5-8365U CPU @ 1.60GHZ', 'INTEL(R) CORE(TM) I5-8400 CPU @ 2.80GHZ',
                'INTEL(R) CORE(TM) I5-8400T CPU @ 1.70GHZ', 'INTEL(R) CORE(TM) I5-8500 CPU @ 3.00GHZ',
                'INTEL(R) CORE(TM) I5-8500T CPU @ 2.10GHZ', 'INTEL(R) CORE(TM) I5-8600 CPU @ 3.10GHZ',
                'INTEL(R) CORE(TM) I5-9400 CPU @ 2.90GHZ', 'INTEL(R) CORE(TM) I5-9500 CPU @ 3.00GHZ',
                'INTEL(R) CORE(TM) I5-9500T CPU @ 2.20GHZ', 'INTEL(R) CORE(TM) I7 CPU Q 740 @ 1.73GHZ',
                'INTEL(R) CORE(TM) I7-10510U CPU @ 1.80GHZ', 'INTEL(R) CORE(TM) I7-10610U CPU @ 1.80GHZ',
                'INTEL(R) CORE(TM) I7-1065G7 CPU @ 1.30GHZ', 'INTEL(R) CORE(TM) I7-10700 CPU @ 2.90GHZ',
                'INTEL(R) CORE(TM) I7-10700K CPU @ 3.80GHZ', 'INTEL(R) CORE(TM) I7-10700T CPU @ 2.00GHZ',
                'INTEL(R) CORE(TM) I7-10750H CPU @ 2.60GHZ', 'INTEL(R) CORE(TM) I7-10810U CPU @ 1.10GHZ',
                'INTEL(R) CORE(TM) I7-14650HX', 'INTEL(R) CORE(TM) I7-14700T', 'INTEL(R) CORE(TM) I7-2600 CPU @ 3.40GHZ',
                'INTEL(R) CORE(TM) I7-3630QM CPU @ 2.40GHZ', 'INTEL(R) CORE(TM) I7-3667U CPU @ 2.00GHZ',
                'INTEL(R) CORE(TM) I7-3770 CPU @ 3.40GHZ', 'INTEL(R) CORE(TM) I7-4510U CPU @ 2.00GHZ',
                'INTEL(R) CORE(TM) I7-4550U CPU @ 1.50GHZ', 'INTEL(R) CORE(TM) I7-4600U CPU @ 2.10GHZ',
                'INTEL(R) CORE(TM) I7-4702MQ CPU @ 2.20GHZ', 'INTEL(R) CORE(TM) I7-4765T CPU @ 2.00GHZ',
                'INTEL(R) CORE(TM) I7-4770 CPU @ 3.40GHZ', 'INTEL(R) CORE(TM) I7-4770S CPU @ 3.10GHZ',
                'INTEL(R) CORE(TM) I7-4790 CPU @ 3.60GHZ', 'INTEL(R) CORE(TM) I7-4790S CPU @ 3.20GHZ',
                'INTEL(R) CORE(TM) I7-5500U CPU @ 2.40GHZ', 'INTEL(R) CORE(TM) I7-5600U CPU @ 2.60GHZ',
                'INTEL(R) CORE(TM) I7-6500U CPU @ 2.50GHZ', 'INTEL(R) CORE(TM) I7-6600U CPU @ 2.60GHZ',
                'INTEL(R) CORE(TM) I7-6700 CPU @ 3.40GHZ', 'INTEL(R) CORE(TM) I7-6700T CPU @ 2.80GHZ',
                'INTEL(R) CORE(TM) I7-7500U CPU @ 2.70GHZ', 'INTEL(R) CORE(TM) I7-7600U CPU @ 2.80GHZ',
                'INTEL(R) CORE(TM) I7-7700 CPU @ 3.60GHZ', 'INTEL(R) CORE(TM) I7-7700HQ CPU @ 2.80GHZ',
                'INTEL(R) CORE(TM) I7-7700T CPU @ 2.90GHZ', 'INTEL(R) CORE(TM) I7-8550U CPU @ 1.80GHZ',
                'INTEL(R) CORE(TM) I7-8565U CPU @ 1.80GHZ', 'INTEL(R) CORE(TM) I7-8650U CPU @ 1.90GHZ',
                'INTEL(R) CORE(TM) I7-8665U CPU @ 1.90GHZ', 'INTEL(R) CORE(TM) I7-8700 CPU @ 3.20GHZ',
                'INTEL(R) CORE(TM) I7-8700T CPU @ 2.40GHZ', 'INTEL(R) CORE(TM) I7-9700K CPU @ 3.60GHZ',
                'INTEL(R) CORE(TM) I7-9700T CPU @ 2.00GHZ', 'INTEL(R) CORE(TM) I7-9750H CPU @ 2.60GHZ',
                'INTEL(R) CORE(TM) I9-9880H CPU @ 2.30GHZ', 'INTEL(R) CORE(TM) ULTRA 5 125U', 'INTEL(R) CORE(TM) ULTRA 7 155H',
                'INTEL(R) CORE(TM) ULTRA 7 155U', 'INTEL(R) CORE(TM) ULTRA 7 165U', 'INTEL(R) CORE(TM) ULTRA 9 185H',
                'INTEL(R) CORE(TM)2 DUO CPU E7500 @ 2.93GHZ', 'INTEL(R) CORE(TM)2 DUO CPU E8400 @ 3.00GHZ',
                'INTEL(R) CORE(TM)2 DUO CPU E8600 @ 3.33GHZ', 'INTEL(R) CORE(TM)2 DUO CPU T6570 @ 2.10GHZ',
                'INTEL(R) CORE(TM)2 QUAD CPU Q8400 @ 2.66GHZ', 'INTEL(R) XEON(R) BRONZE 3106 CPU @ 1.70GHZ',
                'INTEL(R) XEON(R) CPU E3-1225 V5 @ 3.30GHZ', 'INTEL(R) XEON(R) CPU E3-1225 V6 @ 3.30GHZ',
                'INTEL(R) XEON(R) CPU E3-1226 V3 @ 3.30GHZ', 'INTEL(R) XEON(R) CPU E3-1240 V3 @ 3.40GHZ',
                'INTEL(R) XEON(R) CPU E3-1245 V2 @ 3.40GHZ', 'INTEL(R) XEON(R) CPU E3-1270 V5 @ 3.60GHZ',
                'INTEL(R) XEON(R) CPU E31220 @ 3.10GHZ', 'INTEL(R) XEON(R) CPU E31225 @ 3.10GHZ',
                'INTEL(R) XEON(R) CPU E5-1620 V3 @ 3.50GHZ', 'INTEL(R) XEON(R) CPU E5-1620 V4 @ 3.50GHZ',
                'INTEL(R) XEON(R) CPU E5-2407 0 @ 2.20GHZ', 'INTEL(R) XEON(R) CPU E5-2440 V2 @ 1.90GHZ',
                'INTEL(R) XEON(R) CPU E5-2603 V3 @ 1.60GHZ', 'INTEL(R) XEON(R) CPU E5-2609 V3 @ 1.90GHZ',
                'INTEL(R) XEON(R) CPU E5-2620 0 @ 2.00GHZ', 'INTEL(R) XEON(R) CPU E5-2620 V2 @ 2.10GHZ',
                'INTEL(R) XEON(R) CPU E5-2650 0 @ 2.00GHZ', 'INTEL(R) XEON(R) CPU E5-2650 V4 @ 2.20GHZ',
                'INTEL(R) XEON(R) CPU E5-2665 0 @ 2.40GHZ', 'INTEL(R) XEON(R) CPU E5-2667 V4 @ 3.20GHZ',
                'INTEL(R) XEON(R) CPU E5-2697 V3 @ 2.60GHZ', 'INTEL(R) XEON(R) CPU E5504 @ 2.00GHZ',
                'INTEL(R) XEON(R) E-2124G CPU @ 3.40GHZ', 'INTEL(R) XEON(R) E-2224 CPU @ 3.40GHZ',
                'INTEL(R) XEON(R) E-2224G CPU @ 3.50GHZ', 'INTEL(R) XEON(R) GOLD 5315Y CPU @ 3.20GHZ',
                'INTEL(R) XEON(R) GOLD 5317 CPU @ 3.00GHZ', 'INTEL(R) XEON(R) GOLD 6140 CPU @ 2.30GHZ',
                'INTEL(R) XEON(R) SILVER 4112 CPU @ 2.60GHZ', 'INTEL(R) XEON(R) SILVER 4114 CPU @ 2.20GHZ',
                'INTEL(R) XEON(R) SILVER 4208 CPU @ 2.10GHZ', 'INTEL(R) XEON(R) SILVER 4210R CPU @ 2.40GHZ',
                'INTEL(R) XEON(R) W-1270 CPU @ 3.40GHZ', 'PENTIUM(R) DUAL-CORE CPU E5400 @ 2.70GHZ',
                'PENTIUM(R) DUAL-CORE CPU E5500 @ 2.80GHZ', 'Exynos 9810 de ocho núcleos a 2 GHz + 1,7 GHz', 'No Aplica'
            ]
        },
        {
            dominio: 'MEMORIA_RAM', valores: [
                '512 MB', '1GB', '2GB', '4GB', '6GB', '8GB', '12GB', '16GB', '20GB', '24GB', '32GB', 'No Aplica'
            ]
        },
        {
            dominio: 'DISCO_DURO', valores: [
                '16GB', '64GB', '120GB', '128GB', '180GB', '240GB', '250GB', '256GB', '300GB', '320GB',
                '480GB', '500GB', '512GB', '600GB', '720GB', '750GB', '1TB', '1TB + 500GB', '4 TB', '5TB',
                'SSD 256GB', 'No Aplica'
            ]
        },
        {
            dominio: 'SISTEMA_OPERATIVO', valores: [
                'ANDROID', 'IOS', 'LINUX', 'MACOS BIG SUR', 'MACOS CATALINA', 'MACOS MONTEREY',
                'MACOS VENTURA', 'MACOS SONOMA', 'MACOS SEQUOIA', 'MACOS TAHOE', 'WINDOWS XP',
                'WINDOWS VISTA', 'WINDOWS 7', 'WINDOWS 8', 'WINDOWS 8.1', 'WINDOWS 10 HOME',
                'WINDOWS 10 PRO', 'WINDOWS 11 HOME', 'WINDOWS 11 PRO', 'No Aplica'
            ]
        },

        // MARCA Y MODELO
        {
            dominio: 'MARCA', valores: [
                'ACER', 'APPLE', 'ASUS', 'BROTHER', 'CANON', 'CISCO', 'DELL', 'EPSON', 'FUJITSU',
                'HP', 'HUAWEI', 'IBM', 'LENOVO', 'LG', 'MICROSOFT', 'MOTOROLA', 'PANASONIC',
                'RICOH', 'SAMSUNG', 'TOSHIBA', 'XEROX', 'ZEBRA', 'OTRO'
            ]
        },
        {
            dominio: 'MODELO', valores: [
                'ELITEBOOK', 'ENVY', 'INSPIRON', 'LATITUDE', 'LASERJET', 'MACBOOK AIR',
                'MACBOOK PRO', 'OPTIPLEX', 'PAVILION', 'PRECISION', 'PROBOOK', 'SPECTRE',
                'SURFACE', 'THINKPAD', 'THINKCENTRE', 'VOSTRO', 'XPERIA', 'ZBOOK', 'OTRO'
            ]
        },
    ];

    for (const cat of catalogos) {
        for (const valor of cat.valores) {
            await prisma.catalogo.upsert({
                where: { dominio_valor: { dominio: cat.dominio, valor: valor.toUpperCase() } },
                update: {},
                create: { dominio: cat.dominio, valor: valor.toUpperCase() }
            });
        }
    }

    console.log('✅ Catálogos sincronizados exitosamente');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed_catalogos:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
