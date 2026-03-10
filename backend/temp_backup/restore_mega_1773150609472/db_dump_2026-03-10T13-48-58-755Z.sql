--
-- PostgreSQL database dump
--

\restrict qEffkiuNUobsCc63aBI8a1TKhJwgmhxb6E6OgcNhVFLglhcra4dFHzPhPiaIOuF

-- Dumped from database version 15.15
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: EstadoActivo; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoActivo" AS ENUM (
    'DISPONIBLE',
    'ASIGNADO',
    'EN_MANTENIMIENTO',
    'DADO_DE_BAJA'
);


--
-- Name: EstadoMantenimiento; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoMantenimiento" AS ENUM (
    'CREADO',
    'EN_PROCESO',
    'SUSPENDIDO',
    'FINALIZADO',
    'CERRADO',
    'ESPERA_SUMINISTRO',
    'PROCESO_GARANTIA'
);


--
-- Name: EstadoTicket; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoTicket" AS ENUM (
    'CREADO',
    'EN_CURSO',
    'SIN_RESPUESTA',
    'COMPLETADO'
);


--
-- Name: PrioridadTicket; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PrioridadTicket" AS ENUM (
    'BAJA',
    'MEDIA',
    'ALTA',
    'CRITICA'
);


--
-- Name: Rol; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Rol" AS ENUM (
    'ADMIN',
    'TECNICO',
    'CONSULTA'
);


--
-- Name: TipoMovimiento; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoMovimiento" AS ENUM (
    'ASIGNACION',
    'TRASLADO',
    'DEVOLUCION'
);


--
-- Name: TipoServicio; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoServicio" AS ENUM (
    'MANTENIMIENTO',
    'REPARACION',
    'SUMINISTRO',
    'INSPECCION',
    'ACTUALIZACION',
    'GARANTIA'
);


--
-- Name: TipoTicket; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoTicket" AS ENUM (
    'INCIDENTE',
    'REQUERIMIENTO'
);


--
-- Name: TipoTrazaTicket; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoTrazaTicket" AS ENUM (
    'CREACION',
    'COMENTARIO',
    'CAMBIO_ESTADO',
    'ASIGNACION'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.actas (
    id integer NOT NULL,
    tipo text NOT NULL,
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "archivoUrl" text,
    observaciones text,
    "creadoPorId" integer NOT NULL,
    "funcionarioId" integer,
    detalles jsonb NOT NULL
);


--
-- Name: actas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.actas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: actas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.actas_id_seq OWNED BY public.actas.id;


--
-- Name: activos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activos (
    id integer NOT NULL,
    placa text NOT NULL,
    serial text,
    marca text NOT NULL,
    modelo text NOT NULL,
    descripcion text,
    estado public."EstadoActivo" DEFAULT 'DISPONIBLE'::public."EstadoActivo" NOT NULL,
    "categoriaId" integer,
    color text,
    ubicacion text,
    "fechaCompra" timestamp(3) without time zone,
    "valorCompra" numeric(65,30),
    "garantiaHasta" timestamp(3) without time zone,
    observaciones text,
    imagen text,
    "empresaPropietaria" text DEFAULT 'FEDERACION'::text,
    dependencia text DEFAULT 'SUCURSAL IBAGUE'::text,
    "fuenteRecurso" text,
    "tipoRecurso" text,
    "tipoControl" text DEFAULT 'CONTROLADO'::text,
    "estadoOperativo" text DEFAULT 'EN OPERACIÓN'::text,
    "razonEstado" text DEFAULT 'DISPONIBLE'::text,
    "empresaFuncionario" text DEFAULT 'FEDERACION'::text,
    "tipoPersonal" text,
    "cedulaFuncionario" text,
    shortname text,
    "nombreFuncionario" text,
    departamento text DEFAULT 'TOLIMA'::text,
    ciudad text DEFAULT 'IBAGUE'::text,
    cargo text,
    area text,
    tipo text,
    "nombreEquipo" text,
    procesador text,
    "memoriaRam" text,
    "discoDuro" text,
    "sistemaOperativo" text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "tiempoUso" text,
    "tipoPropietario" text,
    checklist text,
    "ordenRemision" text
);


--
-- Name: activos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activos_id_seq OWNED BY public.activos.id;


--
-- Name: asignaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asignaciones (
    id integer NOT NULL,
    "activoId" integer NOT NULL,
    "funcionarioId" integer NOT NULL,
    "fechaInicio" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fechaFin" timestamp(3) without time zone,
    tipo public."TipoMovimiento" NOT NULL,
    observaciones text,
    "realizadoPor" text
);


--
-- Name: asignaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asignaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asignaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.asignaciones_id_seq OWNED BY public.asignaciones.id;


--
-- Name: catalogos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogos (
    id integer NOT NULL,
    dominio text NOT NULL,
    valor text NOT NULL,
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: catalogos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.catalogos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: catalogos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.catalogos_id_seq OWNED BY public.catalogos.id;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre text NOT NULL,
    icono text
);


--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: documentos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documentos (
    id integer NOT NULL,
    nombre text NOT NULL,
    "nombreArchivo" text NOT NULL,
    ruta text NOT NULL,
    tipo text NOT NULL,
    tamano integer,
    "activoId" integer,
    "asignacionId" integer,
    "hojaVidaId" integer,
    "ticketId" integer,
    "trazaTicketId" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: documentos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: documentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documentos_id_seq OWNED BY public.documentos.id;


--
-- Name: funcionarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.funcionarios (
    id integer NOT NULL,
    nombre text NOT NULL,
    cedula text NOT NULL,
    "codigoPersonal" text,
    cargo text,
    area text,
    email text,
    telefono text,
    activo boolean DEFAULT true NOT NULL,
    shortname text,
    vinculacion text,
    "empresaFuncionario" text,
    proyecto text,
    departamento text,
    ciudad text,
    seccional text,
    municipio text,
    ubicacion text,
    piso text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: funcionarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.funcionarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: funcionarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.funcionarios_id_seq OWNED BY public.funcionarios.id;


--
-- Name: hoja_vida; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hoja_vida (
    id integer NOT NULL,
    "activoId" integer NOT NULL,
    tipo public."TipoServicio" NOT NULL,
    descripcion text NOT NULL,
    tecnico text,
    costo numeric(65,30),
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "proximoMantenimiento" timestamp(3) without time zone,
    "registradoPor" text,
    "casoAranda" text,
    estado public."EstadoMantenimiento" DEFAULT 'EN_PROCESO'::public."EstadoMantenimiento" NOT NULL,
    diagnostico text,
    "responsableId" integer
);


--
-- Name: hoja_vida_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hoja_vida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hoja_vida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hoja_vida_id_seq OWNED BY public.hoja_vida.id;


--
-- Name: perfiles_reporte; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.perfiles_reporte (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    "tipoReporte" text NOT NULL,
    columnas jsonb NOT NULL,
    "esPredefinido" boolean DEFAULT false NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: perfiles_reporte_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.perfiles_reporte_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: perfiles_reporte_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.perfiles_reporte_id_seq OWNED BY public.perfiles_reporte.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    titulo text NOT NULL,
    descripcion text NOT NULL,
    estado public."EstadoTicket" DEFAULT 'CREADO'::public."EstadoTicket" NOT NULL,
    prioridad public."PrioridadTicket" DEFAULT 'MEDIA'::public."PrioridadTicket" NOT NULL,
    tipo public."TipoTicket" DEFAULT 'REQUERIMIENTO'::public."TipoTicket" NOT NULL,
    "funcionarioId" integer NOT NULL,
    "activoId" integer,
    "asignadoAId" integer,
    "creadoPorId" integer NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL,
    "cerradoEn" timestamp(3) without time zone
);


--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: trazas_hoja_vida; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trazas_hoja_vida (
    id integer NOT NULL,
    "hojaVidaId" integer NOT NULL,
    "estadoAnterior" public."EstadoMantenimiento",
    "estadoNuevo" public."EstadoMantenimiento" NOT NULL,
    observacion text NOT NULL,
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "usuarioId" integer
);


--
-- Name: trazas_hoja_vida_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trazas_hoja_vida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trazas_hoja_vida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trazas_hoja_vida_id_seq OWNED BY public.trazas_hoja_vida.id;


--
-- Name: trazas_ticket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trazas_ticket (
    id integer NOT NULL,
    "ticketId" integer NOT NULL,
    "tipoTraza" public."TipoTrazaTicket" DEFAULT 'COMENTARIO'::public."TipoTrazaTicket" NOT NULL,
    comentario text NOT NULL,
    "estadoAnterior" public."EstadoTicket",
    "estadoNuevo" public."EstadoTicket",
    "creadoPorId" integer NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: trazas_ticket_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trazas_ticket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trazas_ticket_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trazas_ticket_id_seq OWNED BY public.trazas_ticket.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    rol public."Rol" DEFAULT 'TECNICO'::public."Rol" NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: actas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actas ALTER COLUMN id SET DEFAULT nextval('public.actas_id_seq'::regclass);


--
-- Name: activos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activos ALTER COLUMN id SET DEFAULT nextval('public.activos_id_seq'::regclass);


--
-- Name: asignaciones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaciones ALTER COLUMN id SET DEFAULT nextval('public.asignaciones_id_seq'::regclass);


--
-- Name: catalogos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogos ALTER COLUMN id SET DEFAULT nextval('public.catalogos_id_seq'::regclass);


--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: documentos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos ALTER COLUMN id SET DEFAULT nextval('public.documentos_id_seq'::regclass);


--
-- Name: funcionarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionarios ALTER COLUMN id SET DEFAULT nextval('public.funcionarios_id_seq'::regclass);


--
-- Name: hoja_vida id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoja_vida ALTER COLUMN id SET DEFAULT nextval('public.hoja_vida_id_seq'::regclass);


--
-- Name: perfiles_reporte id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_reporte ALTER COLUMN id SET DEFAULT nextval('public.perfiles_reporte_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Name: trazas_hoja_vida id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trazas_hoja_vida ALTER COLUMN id SET DEFAULT nextval('public.trazas_hoja_vida_id_seq'::regclass);


--
-- Name: trazas_ticket id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trazas_ticket ALTER COLUMN id SET DEFAULT nextval('public.trazas_ticket_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: actas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.actas (id, tipo, fecha, "archivoUrl", observaciones, "creadoPorId", "funcionarioId", detalles) FROM stdin;
1	ASIGNACION	2026-02-27 16:48:28.328	/uploads/actas/Acta_ASIGNACION_1772210908102.xlsx		3	1	"[{\\"id\\":1,\\"placa\\":\\"TEST-IPLACA-01\\",\\"serial\\":null}]"
2	DEVOLUCION	2026-02-27 16:49:53.999	/uploads/actas/Acta_DEVOLUCION_1772210993941.xlsx		3	1	"[{\\"id\\":1,\\"placa\\":\\"TEST-IPLACA-01\\",\\"serial\\":null}]"
3	ASIGNACION	2026-02-27 20:02:24.049	\N		1	1	"{\\"activos\\":[{\\"id\\":1,\\"placa\\":\\"TEST-IPLACA-01\\",\\"serial\\":null,\\"tipo\\":\\"BOCINA\\",\\"marca\\":\\"ACER\\",\\"modelo\\":\\"ELITEBOOK\\"}],\\"funcionarioOrigen\\":{\\"id\\":1,\\"nombre\\":\\"ASDF\\",\\"cargo\\":\\"AUXILIAR GESTIÓN HUMANA\\",\\"area\\":\\"TESORERÍA\\",\\"codigoPersonal\\":\\"\\"},\\"funcionarioDestino\\":null,\\"usuarioTI\\":{\\"id\\":1,\\"nombre\\":\\"Administrador\\",\\"cargo\\":\\"COORDINADOR TIC\\",\\"dependencia\\":\\"TIC\\"},\\"observaciones\\":\\"\\",\\"fecha\\":\\"2026-02-27T20:02:24.045Z\\"}"
\.


--
-- Data for Name: activos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activos (id, placa, serial, marca, modelo, descripcion, estado, "categoriaId", color, ubicacion, "fechaCompra", "valorCompra", "garantiaHasta", observaciones, imagen, "empresaPropietaria", dependencia, "fuenteRecurso", "tipoRecurso", "tipoControl", "estadoOperativo", "razonEstado", "empresaFuncionario", "tipoPersonal", "cedulaFuncionario", shortname, "nombreFuncionario", departamento, ciudad, cargo, area, tipo, "nombreEquipo", procesador, "memoriaRam", "discoDuro", "sistemaOperativo", "creadoEn", "actualizadoEn", "tiempoUso", "tipoPropietario", checklist, "ordenRemision") FROM stdin;
1	TEST-IPLACA-01	\N	ACER	ELITEBOOK	\N	ASIGNADO	\N	\N	\N	\N	\N	\N	\N	\N	FEDERACION	SUCURSAL IBAGUE	\N	\N	CONTROLADO	EN OPERACIÓN	DISPONIBLE		EMPLEADO	123123	ASDF	ASDF			AUXILIAR GESTIÓN HUMANA	TESORERÍA	BOCINA	\N	\N	\N	\N	\N	2026-02-26 20:25:33.995	2026-02-27 20:02:24.054	\N	\N	\N	\N
\.


--
-- Data for Name: asignaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asignaciones (id, "activoId", "funcionarioId", "fechaInicio", "fechaFin", tipo, observaciones, "realizadoPor") FROM stdin;
1	1	1	2026-02-27 16:48:28.339	2026-02-27 16:49:54	ASIGNACION	Asignación por Acta	JHONATHAN ARMANDO CAMARGO IZQUIERDO
2	1	1	2026-02-27 20:02:24.056	\N	ASIGNACION	Asignación por Acta	Administrador
\.


--
-- Data for Name: catalogos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalogos (id, dominio, valor, descripcion, activo, "creadoEn") FROM stdin;
1	AREA	EXTENSIÓN RURAL	\N	t	2026-02-25 22:46:46.115
2	AREA	TIC	\N	t	2026-02-25 22:46:46.119
3	AREA	COMUNICACIONES	\N	t	2026-02-25 22:46:46.124
4	AREA	CEDULACIÓN	\N	t	2026-02-25 22:46:46.128
5	AREA	BENEFICIO ECOLÓGICO	\N	t	2026-02-25 22:46:46.133
6	AREA	SICA	\N	t	2026-02-25 22:46:46.137
7	AREA	TESORERÍA	\N	t	2026-02-25 22:46:46.14
8	AREA	PROYECTOS	\N	t	2026-02-25 22:46:46.145
9	AREA	SECCIONAL IBAGUÉ	\N	t	2026-02-25 22:46:46.152
10	AREA	DESARROLLO SOCIAL	\N	t	2026-02-25 22:46:46.154
11	AREA	JURÍDICA	\N	t	2026-02-25 22:46:46.159
12	AREA	CONTABILIDAD	\N	t	2026-02-25 22:46:46.162
13	AREA	FINANCIERA	\N	t	2026-02-25 22:46:46.165
14	AREA	RECURSOS HUMANOS	\N	t	2026-02-25 22:46:46.169
15	AREA	BIENES Y SERVICIOS	\N	t	2026-02-25 22:46:46.172
16	AREA	DIRECCIÓN	\N	t	2026-02-25 22:46:46.175
17	CARGO	ANALISTA	\N	t	2026-02-25 22:46:46.179
18	CARGO	APRENDIZ	\N	t	2026-02-25 22:46:46.188
19	CARGO	AUXILIAR ADMINISTRATIVO BIENES Y SERVICIOS	\N	t	2026-02-25 22:46:46.195
20	CARGO	AUXILIAR ADMINISTRATIVO GESTION HUMANA	\N	t	2026-02-25 22:46:46.2
21	CARGO	AUXILIAR ADMINISTRATIVO SERVICIOS	\N	t	2026-02-25 22:46:46.204
22	CARGO	COORDINADOR ADMINISTRATIVO	\N	t	2026-02-25 22:46:46.207
23	CARGO	COORDINADOR CONTABLE	\N	t	2026-02-25 22:46:46.212
24	CARGO	COORDINADOR FINANCIERO	\N	t	2026-02-25 22:46:46.218
25	CARGO	COORDINADOR FORTALECIMIENTO GREMIAL	\N	t	2026-02-25 22:46:46.222
26	CARGO	COORDINADOR GRUPO BENEFICIO ECOLOGICO	\N	t	2026-02-25 22:46:46.226
27	CARGO	COORDINADOR PROGRAMA	\N	t	2026-02-25 22:46:46.229
28	CARGO	COORDINADOR SECCIONAL EXTENSION RURAL	\N	t	2026-02-25 22:46:46.232
29	CARGO	DIRECTOR EJECUTIVO	\N	t	2026-02-25 22:46:46.237
30	CARGO	EXTENSIONISTA	\N	t	2026-02-25 22:46:46.24
31	CARGO	EXTENSIONISTA SICA	\N	t	2026-02-25 22:46:46.243
32	CARGO	LIDER DEPARTAMENTAL EXTENSION RURAL	\N	t	2026-02-25 22:46:46.247
33	CARGO	NO APLICA	\N	t	2026-02-25 22:46:46.254
34	CARGO	PASANTE	\N	t	2026-02-25 22:46:46.257
35	CARGO	PROFESIONAL DESARROLLO SOCIAL	\N	t	2026-02-25 22:46:46.262
36	CARGO	PROMOTOR DESARROLLO RURAL	\N	t	2026-02-25 22:46:46.264
37	CARGO	RECEPCION	\N	t	2026-02-25 22:46:46.268
38	CARGO	TESORERO AUXILIAR	\N	t	2026-02-25 22:46:46.272
39	EMPRESA_PROPIETARIA	ALMACAFE	\N	t	2026-02-25 22:46:46.592
40	EMPRESA_PROPIETARIA	FEDERACION	\N	t	2026-02-25 22:46:46.605
41	EMPRESA_PROPIETARIA	BANCOLOMBIA	\N	t	2026-02-25 22:46:46.611
42	EMPRESA_PROPIETARIA	CAFECERT	\N	t	2026-02-25 22:46:46.617
43	EMPRESA_PROPIETARIA	FONDO NACIONAL	\N	t	2026-02-25 22:46:46.622
44	FUENTE_RECURSO	FON1	\N	t	2026-02-25 22:46:46.628
45	FUENTE_RECURSO	FON2	\N	t	2026-02-25 22:46:46.632
46	FUENTE_RECURSO	FEPC	\N	t	2026-02-25 22:46:46.636
47	TIPO_RECURSO	PAC	\N	t	2026-02-25 22:46:46.643
48	TIPO_RECURSO	PROYECTO	\N	t	2026-02-25 22:46:46.652
49	TIPO_RECURSO	RECURSO PROPIO	\N	t	2026-02-25 22:46:46.658
50	TIPO_CONTROL	CONTROLADO	\N	t	2026-02-25 22:46:46.662
51	TIPO_CONTROL	ADMINISTRADO	\N	t	2026-02-25 22:46:46.665
52	ESTADO_OPERATIVO	ALMACENADO	\N	t	2026-02-25 22:46:46.67
53	ESTADO_OPERATIVO	TRÁNSITO	\N	t	2026-02-25 22:46:46.673
54	ESTADO_OPERATIVO	EN OPERACIÓN	\N	t	2026-02-25 22:46:46.677
55	ESTADO_OPERATIVO	BAJA	\N	t	2026-02-25 22:46:46.681
56	ESTADO_OPERATIVO	HURTO	\N	t	2026-02-25 22:46:46.69
57	RAZON_ESTADO	DISPONIBLE	\N	t	2026-02-25 22:46:46.694
58	RAZON_ESTADO	CUSTODIA	\N	t	2026-02-25 22:46:46.699
59	RAZON_ESTADO	ALISTAMIENTO / SOPORTE	\N	t	2026-02-25 22:46:46.702
60	RAZON_ESTADO	RENOVACIÓN	\N	t	2026-02-25 22:46:46.705
61	RAZON_ESTADO	PROCESAR BAJA	\N	t	2026-02-25 22:46:46.71
62	RAZON_ESTADO	DESPACHO	\N	t	2026-02-25 22:46:46.713
63	RAZON_ESTADO	RETORNO	\N	t	2026-02-25 22:46:46.716
64	RAZON_ESTADO	ASIGNACIÓN RESPONSABLE	\N	t	2026-02-25 22:46:46.721
65	RAZON_ESTADO	PRÉSTAMO	\N	t	2026-02-25 22:46:46.728
66	RAZON_ESTADO	HURTO / PERDIDA	\N	t	2026-02-25 22:46:46.732
67	RAZON_ESTADO	DEVUELTO A PROVEEDOR	\N	t	2026-02-25 22:46:46.736
68	RAZON_ESTADO	DONACIÓN	\N	t	2026-02-25 22:46:46.74
69	RAZON_ESTADO	BAJA	\N	t	2026-02-25 22:46:46.743
70	EMPRESA_FUNCIONARIO	ALMACAFE	\N	t	2026-02-25 22:46:46.748
71	EMPRESA_FUNCIONARIO	FEDERACION	\N	t	2026-02-25 22:46:46.751
72	EMPRESA_FUNCIONARIO	TIVIT	\N	t	2026-02-25 22:46:46.754
73	EMPRESA_FUNCIONARIO	SAMTEL	\N	t	2026-02-25 22:46:46.759
74	EMPRESA_FUNCIONARIO	TECNOFILE	\N	t	2026-02-25 22:46:46.766
75	TIPO_PERSONAL	EMPLEADO	\N	t	2026-02-25 22:46:46.769
76	TIPO_PERSONAL	CONTRATISTA	\N	t	2026-02-25 22:46:46.774
77	CARGO	ANALISTA BIENES Y SERVICIOS	\N	t	2026-02-25 22:46:46.779
78	CARGO	ANALISTA COMPRAS	\N	t	2026-02-25 22:46:46.782
79	CARGO	ANALISTA FINANCIERO	\N	t	2026-02-25 22:46:46.787
80	CARGO	ANALISTA GESTIÓN HUMANA	\N	t	2026-02-25 22:46:46.79
81	CARGO	ANALISTA PLANEACIÓN FINANCIERA Y PRESUPUESTO	\N	t	2026-02-25 22:46:46.794
82	CARGO	ANALISTA PROGRAMA DE COMUNICACIONES	\N	t	2026-02-25 22:46:46.798
83	CARGO	ANALISTA PROYECTOS	\N	t	2026-02-25 22:46:46.807
84	CARGO	ANALISTA TIC	\N	t	2026-02-25 22:46:46.811
85	CARGO	AUXILIAR ADMINISTRATIVO	\N	t	2026-02-25 22:46:46.817
86	CARGO	AUXILIAR BIENES Y SERVICIOS	\N	t	2026-02-25 22:46:46.819
87	CARGO	AUXILIAR GESTIÓN HUMANA	\N	t	2026-02-25 22:46:46.824
88	CARGO	AUXILIAR SERVICIOS	\N	t	2026-02-25 22:46:46.828
89	CARGO	COORDINADOR GRUPO BENEFICIO ECOLÓGICO	\N	t	2026-02-25 22:46:46.837
90	CARGO	COORDINADOR SECCIONAL EXTENSIÓN RURAL	\N	t	2026-02-25 22:46:46.844
91	CARGO	LÍDER DEPARTAMENTAL EXTENSIÓN RURAL	\N	t	2026-02-25 22:46:46.854
92	CARGO	RECEPCIÓN	\N	t	2026-02-25 22:46:46.863
93	CARGO	SICA	\N	t	2026-02-25 22:46:46.868
94	TIPO_EQUIPO	EQUIPO ESCRITORIO	\N	t	2026-02-25 22:46:46.872
95	TIPO_EQUIPO	EQUIPO PORTATIL	\N	t	2026-02-25 22:46:46.875
96	TIPO_EQUIPO	EQUIPO TODO EN UNO	\N	t	2026-02-25 22:46:46.879
97	TIPO_EQUIPO	IMPRESORA	\N	t	2026-02-25 22:46:46.882
98	TIPO_EQUIPO	TABLETA	\N	t	2026-02-25 22:46:46.885
99	TIPO_EQUIPO	ESCANER	\N	t	2026-02-25 22:46:46.89
100	TIPO_EQUIPO	MONITOR	\N	t	2026-02-25 22:46:46.897
101	TIPO_EQUIPO	VIDEO BEAM	\N	t	2026-02-25 22:46:46.9
102	TIPO_EQUIPO	TELEFONO IP	\N	t	2026-02-25 22:46:46.904
103	TIPO_EQUIPO	SWITCH	\N	t	2026-02-25 22:46:46.908
104	TIPO_EQUIPO	ROUTER	\N	t	2026-02-25 22:46:46.911
105	TIPO_EQUIPO	PLANTA TELEFONIA IP	\N	t	2026-02-25 22:46:46.915
106	TIPO_EQUIPO	UPS	\N	t	2026-02-25 22:46:46.918
107	TIPO_EQUIPO	SERVIDOR	\N	t	2026-02-25 22:46:46.922
108	TIPO_EQUIPO	CAMARA IP	\N	t	2026-02-25 22:46:46.926
109	TIPO_EQUIPO	BOCINA	\N	t	2026-02-25 22:46:46.936
110	TIPO_EQUIPO	MICROFONO	\N	t	2026-02-25 22:46:46.94
111	TIPO_EQUIPO	CONTROLADORA MICROFONO	\N	t	2026-02-25 22:46:46.945
112	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I3-1115G4 @ 3.00GHZ	\N	t	2026-02-25 22:46:46.949
113	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I5-1135G7 @ 2.40GHZ	\N	t	2026-02-25 22:46:46.952
114	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I5-11400 @ 2.60GHZ	\N	t	2026-02-25 22:46:46.957
115	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I5-11400T @ 1.30GHZ	\N	t	2026-02-25 22:46:46.959
116	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I5-1145G7 @ 2.60GHZ	\N	t	2026-02-25 22:46:46.962
117	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I5-1155G7 @ 2.50GHZ	\N	t	2026-02-25 22:46:46.967
118	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I7-11370H @ 3.30GHZ	\N	t	2026-02-25 22:46:46.973
119	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I7-1165G7 @ 2.80GHZ	\N	t	2026-02-25 22:46:46.977
120	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I7-11700 @ 2.50GHZ	\N	t	2026-02-25 22:46:46.981
121	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I7-11700T @ 1.40GHZ	\N	t	2026-02-25 22:46:46.985
122	PROCESADOR	11TH GEN INTEL(R) CORE(TM) I7-11800H @ 2.30GHZ	\N	t	2026-02-25 22:46:46.988
123	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I5-1235U	\N	t	2026-02-25 22:46:46.992
124	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I5-1240P	\N	t	2026-02-25 22:46:46.996
125	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I5-12450H	\N	t	2026-02-25 22:46:47.007
126	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I5-12500	\N	t	2026-02-25 22:46:47.012
127	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-1250U	\N	t	2026-02-25 22:46:47.016
128	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-1255U	\N	t	2026-02-25 22:46:47.022
129	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-1260P	\N	t	2026-02-25 22:46:47.027
130	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-1260U	\N	t	2026-02-25 22:46:47.032
131	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-1265U	\N	t	2026-02-25 22:46:47.041
132	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-12700	\N	t	2026-02-25 22:46:47.045
133	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-12700H	\N	t	2026-02-25 22:46:47.05
134	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-12700T	\N	t	2026-02-25 22:46:47.053
135	PROCESADOR	12TH GEN INTEL(R) CORE(TM) I7-1280P	\N	t	2026-02-25 22:46:47.055
136	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I5-1335U	\N	t	2026-02-25 22:46:47.06
137	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I5-13400T	\N	t	2026-02-25 22:46:47.063
138	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I5-13420H	\N	t	2026-02-25 22:46:47.066
139	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I5-13500	\N	t	2026-02-25 22:46:47.07
140	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I5-13500T	\N	t	2026-02-25 22:46:47.077
141	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I7-1355U	\N	t	2026-02-25 22:46:47.081
142	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I7-1360P	\N	t	2026-02-25 22:46:47.085
143	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I7-1365U	\N	t	2026-02-25 22:46:47.089
144	PROCESADOR	13TH GEN INTEL(R) CORE(TM) I7-13700	\N	t	2026-02-25 22:46:47.093
145	PROCESADOR	AMD A10-8700P RADEON R6, 10 COMPUTE CORES 4C+6G	\N	t	2026-02-25 22:46:47.098
146	PROCESADOR	AMD A6-9210 RADEON R4, 5 COMPUTE CORES 2C+3G	\N	t	2026-02-25 22:46:47.102
147	PROCESADOR	AMD A9-9425 RADEON R5, 5 COMPUTE CORES 2C+3G	\N	t	2026-02-25 22:46:47.105
148	PROCESADOR	AMD ATHLON(TM) X2 DUAL CORE PROCESSOR 3250E	\N	t	2026-02-25 22:46:47.11
149	PROCESADOR	AMD E1-1500 APU WITH RADEON(TM) HD GRAPHICS	\N	t	2026-02-25 22:46:47.117
150	PROCESADOR	AMD E2-7110 APU WITH AMD RADEON R2 GRAPHICS	\N	t	2026-02-25 22:46:47.121
151	PROCESADOR	AMD RYZEN 3 2200U WITH RADEON VEGA MOBILE GFX	\N	t	2026-02-25 22:46:47.127
152	PROCESADOR	AMD RYZEN 3 3200U WITH RADEON VEGA MOBILE GFX	\N	t	2026-02-25 22:46:47.13
153	PROCESADOR	AMD RYZEN 3 5300U WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.133
154	PROCESADOR	AMD RYZEN 5 3450U WITH RADEON VEGA MOBILE GFX	\N	t	2026-02-25 22:46:47.139
155	PROCESADOR	AMD RYZEN 5 3500U WITH RADEON VEGA MOBILE GFX	\N	t	2026-02-25 22:46:47.142
156	PROCESADOR	AMD RYZEN 5 5500U WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.145
157	PROCESADOR	AMD RYZEN 5 5600H WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.149
158	PROCESADOR	AMD RYZEN 5 7520U WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.158
159	PROCESADOR	AMD RYZEN 5 PRO 7530U WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.161
160	PROCESADOR	AMD RYZEN 7 5700G WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.166
161	PROCESADOR	AMD RYZEN 7 5700U WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.169
162	PROCESADOR	AMD RYZEN 7 7735U WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.172
163	PROCESADOR	AMD RYZEN 7 PRO 5750G WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.176
164	PROCESADOR	AMD RYZEN 7 PRO 7730U WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.179
165	PROCESADOR	AMD RYZEN 7 PRO 7840HS W/ RADEON 780M GRAPHICS	\N	t	2026-02-25 22:46:47.182
166	PROCESADOR	AMD RYZEN 7 PRO 8840U W/ RADEON 780M GRAPHICS	\N	t	2026-02-25 22:46:47.187
167	PROCESADOR	AMD RYZEN 9 5900HX WITH RADEON GRAPHICS	\N	t	2026-02-25 22:46:47.194
168	PROCESADOR	AMD RYZEN THREADRIPPER PRO 3945WX 12-CORES	\N	t	2026-02-25 22:46:47.198
169	PROCESADOR	APPLE M1	\N	t	2026-02-25 22:46:47.202
170	PROCESADOR	APPLE M1 PRO	\N	t	2026-02-25 22:46:47.205
171	PROCESADOR	APPLE M2	\N	t	2026-02-25 22:46:47.21
172	PROCESADOR	APPLE M3	\N	t	2026-02-25 22:46:47.213
173	PROCESADOR	INTEL(R) ATOM(TM) X5-Z8550 CPU @ 1.44GHZ	\N	t	2026-02-25 22:46:47.216
174	PROCESADOR	INTEL(R) CELERON(R) CPU G3900 @ 2.80GHZ	\N	t	2026-02-25 22:46:47.221
175	PROCESADOR	INTEL(R) CELERON(R) CPU N3060 @ 1.60GHZ	\N	t	2026-02-25 22:46:47.228
176	PROCESADOR	INTEL(R) CELERON(R) J4005 CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.233
177	PROCESADOR	INTEL(R) CORE(TM) I3 CPU 540 @ 3.07GHZ	\N	t	2026-02-25 22:46:47.236
178	PROCESADOR	INTEL(R) CORE(TM) I3 CPU M 350 @ 2.27GHZ	\N	t	2026-02-25 22:46:47.239
179	PROCESADOR	INTEL(R) CORE(TM) I3-1005G1 CPU @ 1.20GHZ	\N	t	2026-02-25 22:46:47.244
180	PROCESADOR	INTEL(R) CORE(TM) I3-10105 CPU @ 3.70GHZ	\N	t	2026-02-25 22:46:47.249
181	PROCESADOR	INTEL(R) CORE(TM) I3-2100 CPU @ 3.10GHZ	\N	t	2026-02-25 22:46:47.254
182	PROCESADOR	INTEL(R) CORE(TM) I3-2120 CPU @ 3.30GHZ	\N	t	2026-02-25 22:46:47.263
183	PROCESADOR	INTEL(R) CORE(TM) I3-2310M CPU @ 2.10GHZ	\N	t	2026-02-25 22:46:47.268
184	PROCESADOR	INTEL(R) CORE(TM) I3-2350M CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:47.275
185	PROCESADOR	INTEL(R) CORE(TM) I3-3110M CPU @ 2.40GHZ	\N	t	2026-02-25 22:46:47.279
186	PROCESADOR	INTEL(R) CORE(TM) I3-3217U CPU @ 1.80GHZ	\N	t	2026-02-25 22:46:47.282
187	PROCESADOR	INTEL(R) CORE(TM) I3-3220 CPU @ 3.30GHZ	\N	t	2026-02-25 22:46:47.287
188	PROCESADOR	INTEL(R) CORE(TM) I3-3240T CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.29
189	PROCESADOR	INTEL(R) CORE(TM) I3-3245 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.296
190	PROCESADOR	INTEL(R) CORE(TM) I3-4005U CPU @ 1.70GHZ	\N	t	2026-02-25 22:46:47.303
191	PROCESADOR	INTEL(R) CORE(TM) I3-4030U CPU @ 1.90GHZ	\N	t	2026-02-25 22:46:47.306
192	PROCESADOR	INTEL(R) CORE(TM) I3-4150T CPU @ 3.00GHZ	\N	t	2026-02-25 22:46:47.31
193	PROCESADOR	INTEL(R) CORE(TM) I3-4160 CPU @ 3.60GHZ	\N	t	2026-02-25 22:46:47.313
194	PROCESADOR	INTEL(R) CORE(TM) I3-4170 CPU @ 3.70GHZ	\N	t	2026-02-25 22:46:47.316
195	PROCESADOR	INTEL(R) CORE(TM) I3-5005U CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.321
196	PROCESADOR	INTEL(R) CORE(TM) I3-6006U CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.324
197	PROCESADOR	INTEL(R) CORE(TM) I3-6100 CPU @ 3.70GHZ	\N	t	2026-02-25 22:46:47.327
198	PROCESADOR	INTEL(R) CORE(TM) I3-6100T CPU @ 3.20GHZ	\N	t	2026-02-25 22:46:47.331
199	PROCESADOR	INTEL(R) CORE(TM) I3-6100U CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:47.338
200	PROCESADOR	INTEL(R) CORE(TM) I3-7020U CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:47.341
201	PROCESADOR	INTEL(R) CORE(TM) I3-7100 CPU @ 3.90GHZ	\N	t	2026-02-25 22:46:47.346
202	PROCESADOR	INTEL(R) CORE(TM) I3-8100 CPU @ 3.60GHZ	\N	t	2026-02-25 22:46:47.348
203	PROCESADOR	INTEL(R) CORE(TM) I3-8100T CPU @ 3.10GHZ	\N	t	2026-02-25 22:46:47.351
204	PROCESADOR	INTEL(R) CORE(TM) I5 CPU 650 @ 3.20GHZ	\N	t	2026-02-25 22:46:47.356
205	PROCESADOR	INTEL(R) CORE(TM) I5 CPU M 460 @ 2.53GHZ	\N	t	2026-02-25 22:46:47.359
206	PROCESADOR	INTEL(R) CORE(TM) I5-10210U CPU @ 1.60GHZ	\N	t	2026-02-25 22:46:47.363
207	PROCESADOR	INTEL(R) CORE(TM) I5-10310U CPU @ 1.70GHZ	\N	t	2026-02-25 22:46:47.372
208	PROCESADOR	INTEL(R) CORE(TM) I5-1035G1 CPU @ 1.00GHZ	\N	t	2026-02-25 22:46:47.376
209	PROCESADOR	INTEL(R) CORE(TM) I5-10400 CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.382
210	PROCESADOR	INTEL(R) CORE(TM) I5-10400T CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.386
211	PROCESADOR	INTEL(R) CORE(TM) I5-10500 CPU @ 3.10GHZ	\N	t	2026-02-25 22:46:47.39
212	PROCESADOR	INTEL(R) CORE(TM) I5-10500T CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:47.395
213	PROCESADOR	INTEL(R) CORE(TM) I5-10505 CPU @ 3.20GHZ	\N	t	2026-02-25 22:46:47.398
214	PROCESADOR	INTEL(R) CORE(TM) I5-10600 CPU @ 3.30GHZ	\N	t	2026-02-25 22:46:47.401
215	PROCESADOR	INTEL(R) CORE(TM) I5-2400 CPU @ 3.10GHZ	\N	t	2026-02-25 22:46:47.405
216	PROCESADOR	INTEL(R) CORE(TM) I5-2400S CPU @ 2.50GHZ	\N	t	2026-02-25 22:46:47.414
217	PROCESADOR	INTEL(R) CORE(TM) I5-2410M CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:47.418
218	PROCESADOR	INTEL(R) CORE(TM) I5-2430M CPU @ 2.40GHZ	\N	t	2026-02-25 22:46:47.423
219	PROCESADOR	INTEL(R) CORE(TM) I5-2450M CPU @ 2.50GHZ	\N	t	2026-02-25 22:46:47.426
220	PROCESADOR	INTEL(R) CORE(TM) I5-3210M CPU @ 2.50GHZ	\N	t	2026-02-25 22:46:47.43
221	PROCESADOR	INTEL(R) CORE(TM) I5-3230M CPU @ 2.60GHZ	\N	t	2026-02-25 22:46:47.434
222	PROCESADOR	INTEL(R) CORE(TM) I5-3320M CPU @ 2.60GHZ	\N	t	2026-02-25 22:46:47.442
223	PROCESADOR	INTEL(R) CORE(TM) I5-3337U CPU @ 1.80GHZ	\N	t	2026-02-25 22:46:47.444
224	PROCESADOR	INTEL(R) CORE(TM) I5-3340M CPU @ 2.70GHZ	\N	t	2026-02-25 22:46:47.449
225	PROCESADOR	INTEL(R) CORE(TM) I5-3450S CPU @ 2.80GHZ	\N	t	2026-02-25 22:46:47.452
226	PROCESADOR	INTEL(R) CORE(TM) I5-3470 CPU @ 3.20GHZ	\N	t	2026-02-25 22:46:47.455
227	PROCESADOR	INTEL(R) CORE(TM) I5-3470S CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.459
228	PROCESADOR	INTEL(R) CORE(TM) I5-3470T CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.462
229	PROCESADOR	INTEL(R) CORE(TM) I5-3550 CPU @ 3.30GHZ	\N	t	2026-02-25 22:46:47.467
230	PROCESADOR	INTEL(R) CORE(TM) I5-3570 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.477
231	PROCESADOR	INTEL(R) CORE(TM) I5-4200M CPU @ 2.50GHZ	\N	t	2026-02-25 22:46:47.482
232	PROCESADOR	INTEL(R) CORE(TM) I5-4200U CPU @ 1.60GHZ	\N	t	2026-02-25 22:46:47.485
233	PROCESADOR	INTEL(R) CORE(TM) I5-4210U CPU @ 1.70GHZ	\N	t	2026-02-25 22:46:47.489
234	PROCESADOR	INTEL(R) CORE(TM) I5-4300U CPU @ 1.90GHZ	\N	t	2026-02-25 22:46:47.494
235	PROCESADOR	INTEL(R) CORE(TM) I5-4310U CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.497
236	PROCESADOR	INTEL(R) CORE(TM) I5-4430 CPU @ 3.00GHZ	\N	t	2026-02-25 22:46:47.501
237	PROCESADOR	INTEL(R) CORE(TM) I5-4430S CPU @ 2.70GHZ	\N	t	2026-02-25 22:46:47.507
238	PROCESADOR	INTEL(R) CORE(TM) I5-4460S CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.515
239	PROCESADOR	INTEL(R) CORE(TM) I5-4460T CPU @ 1.90GHZ	\N	t	2026-02-25 22:46:47.519
240	PROCESADOR	INTEL(R) CORE(TM) I5-4570 CPU @ 3.20GHZ	\N	t	2026-02-25 22:46:47.525
241	PROCESADOR	INTEL(R) CORE(TM) I5-4570S CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.528
242	PROCESADOR	INTEL(R) CORE(TM) I5-4590 CPU @ 3.30GHZ	\N	t	2026-02-25 22:46:47.531
243	PROCESADOR	INTEL(R) CORE(TM) I5-4590S CPU @ 3.00GHZ	\N	t	2026-02-25 22:46:47.536
244	PROCESADOR	INTEL(R) CORE(TM) I5-5200U CPU @ 2.20GHZ	\N	t	2026-02-25 22:46:47.538
245	PROCESADOR	INTEL(R) CORE(TM) I5-5300U CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:47.542
246	PROCESADOR	INTEL(R) CORE(TM) I5-6200U CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:47.546
247	PROCESADOR	INTEL(R) CORE(TM) I5-6300U CPU @ 2.40GHZ	\N	t	2026-02-25 22:46:47.553
248	PROCESADOR	INTEL(R) CORE(TM) I5-6400 CPU @ 2.70GHZ	\N	t	2026-02-25 22:46:47.557
249	PROCESADOR	INTEL(R) CORE(TM) I5-6400T CPU @ 2.20GHZ	\N	t	2026-02-25 22:46:47.563
250	PROCESADOR	INTEL(R) CORE(TM) I5-6500 CPU @ 3.20GHZ	\N	t	2026-02-25 22:46:47.566
251	PROCESADOR	INTEL(R) CORE(TM) I5-6500T CPU @ 2.50GHZ	\N	t	2026-02-25 22:46:47.57
252	PROCESADOR	INTEL(R) CORE(TM) I5-6600T CPU @ 2.70GHZ	\N	t	2026-02-25 22:46:47.575
253	PROCESADOR	INTEL(R) CORE(TM) I5-7200U CPU @ 2.50GHZ	\N	t	2026-02-25 22:46:47.578
254	PROCESADOR	INTEL(R) CORE(TM) I5-7300U CPU @ 2.60GHZ	\N	t	2026-02-25 22:46:47.582
255	PROCESADOR	INTEL(R) CORE(TM) I5-7400 CPU @ 3.00GHZ	\N	t	2026-02-25 22:46:47.587
256	PROCESADOR	INTEL(R) CORE(TM) I5-7400T CPU @ 2.40GHZ	\N	t	2026-02-25 22:46:47.596
257	PROCESADOR	INTEL(R) CORE(TM) I5-7500 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.599
258	PROCESADOR	INTEL(R) CORE(TM) I5-7500T CPU @ 2.70GHZ	\N	t	2026-02-25 22:46:47.603
259	PROCESADOR	INTEL(R) CORE(TM) I5-8250U CPU @ 1.60GHZ	\N	t	2026-02-25 22:46:47.606
260	PROCESADOR	INTEL(R) CORE(TM) I5-8257U CPU @ 1.40GHZ	\N	t	2026-02-25 22:46:47.609
261	PROCESADOR	INTEL(R) CORE(TM) I5-8265U CPU @ 1.60GHZ	\N	t	2026-02-25 22:46:47.614
262	PROCESADOR	INTEL(R) CORE(TM) I5-8350U CPU @ 1.70GHZ	\N	t	2026-02-25 22:46:47.617
263	PROCESADOR	INTEL(R) CORE(TM) I5-8365U CPU @ 1.60GHZ	\N	t	2026-02-25 22:46:47.621
264	PROCESADOR	INTEL(R) CORE(TM) I5-8400 CPU @ 2.80GHZ	\N	t	2026-02-25 22:46:47.628
265	PROCESADOR	INTEL(R) CORE(TM) I5-8400T CPU @ 1.70GHZ	\N	t	2026-02-25 22:46:47.632
266	PROCESADOR	INTEL(R) CORE(TM) I5-8500 CPU @ 3.00GHZ	\N	t	2026-02-25 22:46:47.637
267	PROCESADOR	INTEL(R) CORE(TM) I5-8500T CPU @ 2.10GHZ	\N	t	2026-02-25 22:46:47.64
268	PROCESADOR	INTEL(R) CORE(TM) I5-8600 CPU @ 3.10GHZ	\N	t	2026-02-25 22:46:47.644
269	PROCESADOR	INTEL(R) CORE(TM) I5-9400 CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.649
270	PROCESADOR	INTEL(R) CORE(TM) I5-9500 CPU @ 3.00GHZ	\N	t	2026-02-25 22:46:47.654
271	PROCESADOR	INTEL(R) CORE(TM) I5-9500T CPU @ 2.20GHZ	\N	t	2026-02-25 22:46:47.661
272	PROCESADOR	INTEL(R) CORE(TM) I7 CPU Q 740 @ 1.73GHZ	\N	t	2026-02-25 22:46:47.664
273	PROCESADOR	INTEL(R) CORE(TM) I7-10510U CPU @ 1.80GHZ	\N	t	2026-02-25 22:46:47.669
274	PROCESADOR	INTEL(R) CORE(TM) I7-10610U CPU @ 1.80GHZ	\N	t	2026-02-25 22:46:47.672
275	PROCESADOR	INTEL(R) CORE(TM) I7-1065G7 CPU @ 1.30GHZ	\N	t	2026-02-25 22:46:47.675
276	PROCESADOR	INTEL(R) CORE(TM) I7-10700 CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.68
277	PROCESADOR	INTEL(R) CORE(TM) I7-10700K CPU @ 3.80GHZ	\N	t	2026-02-25 22:46:47.683
278	PROCESADOR	INTEL(R) CORE(TM) I7-10700T CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.686
279	PROCESADOR	INTEL(R) CORE(TM) I7-10750H CPU @ 2.60GHZ	\N	t	2026-02-25 22:46:47.691
280	PROCESADOR	INTEL(R) CORE(TM) I7-10810U CPU @ 1.10GHZ	\N	t	2026-02-25 22:46:47.699
281	PROCESADOR	INTEL(R) CORE(TM) I7-14650HX	\N	t	2026-02-25 22:46:47.702
282	PROCESADOR	INTEL(R) CORE(TM) I7-14700T	\N	t	2026-02-25 22:46:47.707
283	PROCESADOR	INTEL(R) CORE(TM) I7-2600 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.71
284	PROCESADOR	INTEL(R) CORE(TM) I7-3630QM CPU @ 2.40GHZ	\N	t	2026-02-25 22:46:47.713
285	PROCESADOR	INTEL(R) CORE(TM) I7-3667U CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.717
286	PROCESADOR	INTEL(R) CORE(TM) I7-3770 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.72
287	PROCESADOR	INTEL(R) CORE(TM) I7-4510U CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.723
288	PROCESADOR	INTEL(R) CORE(TM) I7-4550U CPU @ 1.50GHZ	\N	t	2026-02-25 22:46:47.728
289	PROCESADOR	INTEL(R) CORE(TM) I7-4600U CPU @ 2.10GHZ	\N	t	2026-02-25 22:46:47.735
290	PROCESADOR	INTEL(R) CORE(TM) I7-4702MQ CPU @ 2.20GHZ	\N	t	2026-02-25 22:46:47.738
291	PROCESADOR	INTEL(R) CORE(TM) I7-4765T CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.742
292	PROCESADOR	INTEL(R) CORE(TM) I7-4770 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.746
293	PROCESADOR	INTEL(R) CORE(TM) I7-4770S CPU @ 3.10GHZ	\N	t	2026-02-25 22:46:47.749
294	PROCESADOR	INTEL(R) CORE(TM) I7-4790 CPU @ 3.60GHZ	\N	t	2026-02-25 22:46:47.754
295	PROCESADOR	INTEL(R) CORE(TM) I7-4790S CPU @ 3.20GHZ	\N	t	2026-02-25 22:46:47.757
296	PROCESADOR	INTEL(R) CORE(TM) I7-5500U CPU @ 2.40GHZ	\N	t	2026-02-25 22:46:47.759
297	PROCESADOR	INTEL(R) CORE(TM) I7-5600U CPU @ 2.60GHZ	\N	t	2026-02-25 22:46:47.764
298	PROCESADOR	INTEL(R) CORE(TM) I7-6500U CPU @ 2.50GHZ	\N	t	2026-02-25 22:46:47.771
299	PROCESADOR	INTEL(R) CORE(TM) I7-6600U CPU @ 2.60GHZ	\N	t	2026-02-25 22:46:47.774
300	PROCESADOR	INTEL(R) CORE(TM) I7-6700 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.779
301	PROCESADOR	INTEL(R) CORE(TM) I7-6700T CPU @ 2.80GHZ	\N	t	2026-02-25 22:46:47.782
302	PROCESADOR	INTEL(R) CORE(TM) I7-7500U CPU @ 2.70GHZ	\N	t	2026-02-25 22:46:47.785
303	PROCESADOR	INTEL(R) CORE(TM) I7-7600U CPU @ 2.80GHZ	\N	t	2026-02-25 22:46:47.789
304	PROCESADOR	INTEL(R) CORE(TM) I7-7700 CPU @ 3.60GHZ	\N	t	2026-02-25 22:46:47.792
305	PROCESADOR	INTEL(R) CORE(TM) I7-7700HQ CPU @ 2.80GHZ	\N	t	2026-02-25 22:46:47.795
306	PROCESADOR	INTEL(R) CORE(TM) I7-7700T CPU @ 2.90GHZ	\N	t	2026-02-25 22:46:47.8
307	PROCESADOR	INTEL(R) CORE(TM) I7-8550U CPU @ 1.80GHZ	\N	t	2026-02-25 22:46:47.809
308	PROCESADOR	INTEL(R) CORE(TM) I7-8565U CPU @ 1.80GHZ	\N	t	2026-02-25 22:46:47.814
309	PROCESADOR	INTEL(R) CORE(TM) I7-8650U CPU @ 1.90GHZ	\N	t	2026-02-25 22:46:47.817
310	PROCESADOR	INTEL(R) CORE(TM) I7-8665U CPU @ 1.90GHZ	\N	t	2026-02-25 22:46:47.821
311	PROCESADOR	INTEL(R) CORE(TM) I7-8700 CPU @ 3.20GHZ	\N	t	2026-02-25 22:46:47.826
312	PROCESADOR	INTEL(R) CORE(TM) I7-8700T CPU @ 2.40GHZ	\N	t	2026-02-25 22:46:47.829
313	PROCESADOR	INTEL(R) CORE(TM) I7-9700K CPU @ 3.60GHZ	\N	t	2026-02-25 22:46:47.831
314	PROCESADOR	INTEL(R) CORE(TM) I7-9700T CPU @ 2.00GHZ	\N	t	2026-02-25 22:46:47.836
315	PROCESADOR	INTEL(R) CORE(TM) I7-9750H CPU @ 2.60GHZ	\N	t	2026-02-25 22:46:47.843
316	PROCESADOR	INTEL(R) CORE(TM) I9-9880H CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:47.846
317	PROCESADOR	INTEL(R) CORE(TM) ULTRA 5 125U	\N	t	2026-02-25 22:46:47.851
318	PROCESADOR	INTEL(R) CORE(TM) ULTRA 7 155H	\N	t	2026-02-25 22:46:47.853
319	PROCESADOR	INTEL(R) CORE(TM) ULTRA 7 155U	\N	t	2026-02-25 22:46:47.856
320	PROCESADOR	INTEL(R) CORE(TM) ULTRA 7 165U	\N	t	2026-02-25 22:46:47.861
321	PROCESADOR	INTEL(R) CORE(TM) ULTRA 9 185H	\N	t	2026-02-25 22:46:47.864
322	PROCESADOR	INTEL(R) CORE(TM)2 DUO CPU E7500 @ 2.93GHZ	\N	t	2026-02-25 22:46:47.866
323	PROCESADOR	INTEL(R) CORE(TM)2 DUO CPU E8400 @ 3.00GHZ	\N	t	2026-02-25 22:46:47.871
324	PROCESADOR	INTEL(R) CORE(TM)2 DUO CPU E8600 @ 3.33GHZ	\N	t	2026-02-25 22:46:47.878
325	PROCESADOR	INTEL(R) CORE(TM)2 DUO CPU T6570 @ 2.10GHZ	\N	t	2026-02-25 22:46:47.881
326	PROCESADOR	INTEL(R) CORE(TM)2 QUAD CPU Q8400 @ 2.66GHZ	\N	t	2026-02-25 22:46:47.886
327	PROCESADOR	INTEL(R) XEON(R) BRONZE 3106 CPU @ 1.70GHZ	\N	t	2026-02-25 22:46:47.889
328	PROCESADOR	INTEL(R) XEON(R) CPU E3-1225 V5 @ 3.30GHZ	\N	t	2026-02-25 22:46:47.892
329	PROCESADOR	INTEL(R) XEON(R) CPU E3-1225 V6 @ 3.30GHZ	\N	t	2026-02-25 22:46:47.896
330	PROCESADOR	INTEL(R) XEON(R) CPU E3-1226 V3 @ 3.30GHZ	\N	t	2026-02-25 22:46:47.899
331	PROCESADOR	INTEL(R) XEON(R) CPU E3-1240 V3 @ 3.40GHZ	\N	t	2026-02-25 22:46:47.902
332	PROCESADOR	INTEL(R) XEON(R) CPU E3-1245 V2 @ 3.40GHZ	\N	t	2026-02-25 22:46:47.907
333	PROCESADOR	INTEL(R) XEON(R) CPU E3-1270 V5 @ 3.60GHZ	\N	t	2026-02-25 22:46:47.915
334	PROCESADOR	INTEL(R) XEON(R) CPU E31220 @ 3.10GHZ	\N	t	2026-02-25 22:46:47.919
335	PROCESADOR	INTEL(R) XEON(R) CPU E31225 @ 3.10GHZ	\N	t	2026-02-25 22:46:47.924
336	PROCESADOR	INTEL(R) XEON(R) CPU E5-1620 V3 @ 3.50GHZ	\N	t	2026-02-25 22:46:47.927
337	PROCESADOR	INTEL(R) XEON(R) CPU E5-1620 V4 @ 3.50GHZ	\N	t	2026-02-25 22:46:47.93
338	PROCESADOR	INTEL(R) XEON(R) CPU E5-2407 0 @ 2.20GHZ	\N	t	2026-02-25 22:46:47.935
339	PROCESADOR	INTEL(R) XEON(R) CPU E5-2440 V2 @ 1.90GHZ	\N	t	2026-02-25 22:46:47.938
340	PROCESADOR	INTEL(R) XEON(R) CPU E5-2603 V3 @ 1.60GHZ	\N	t	2026-02-25 22:46:47.941
341	PROCESADOR	INTEL(R) XEON(R) CPU E5-2609 V3 @ 1.90GHZ	\N	t	2026-02-25 22:46:47.945
342	PROCESADOR	INTEL(R) XEON(R) CPU E5-2620 0 @ 2.00GHZ	\N	t	2026-02-25 22:46:47.952
343	PROCESADOR	INTEL(R) XEON(R) CPU E5-2620 V2 @ 2.10GHZ	\N	t	2026-02-25 22:46:47.955
344	PROCESADOR	INTEL(R) XEON(R) CPU E5-2650 0 @ 2.00GHZ	\N	t	2026-02-25 22:46:47.959
345	PROCESADOR	INTEL(R) XEON(R) CPU E5-2650 V4 @ 2.20GHZ	\N	t	2026-02-25 22:46:47.962
346	PROCESADOR	INTEL(R) XEON(R) CPU E5-2665 0 @ 2.40GHZ	\N	t	2026-02-25 22:46:47.965
347	PROCESADOR	INTEL(R) XEON(R) CPU E5-2667 V4 @ 3.20GHZ	\N	t	2026-02-25 22:46:47.969
348	PROCESADOR	INTEL(R) XEON(R) CPU E5-2697 V3 @ 2.60GHZ	\N	t	2026-02-25 22:46:47.972
349	PROCESADOR	INTEL(R) XEON(R) CPU E5504 @ 2.00GHZ	\N	t	2026-02-25 22:46:47.975
350	PROCESADOR	INTEL(R) XEON(R) E-2124G CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.98
351	PROCESADOR	INTEL(R) XEON(R) E-2224 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:47.987
352	PROCESADOR	INTEL(R) XEON(R) E-2224G CPU @ 3.50GHZ	\N	t	2026-02-25 22:46:47.991
353	PROCESADOR	INTEL(R) XEON(R) GOLD 5315Y CPU @ 3.20GHZ	\N	t	2026-02-25 22:46:47.996
354	PROCESADOR	INTEL(R) XEON(R) GOLD 5317 CPU @ 3.00GHZ	\N	t	2026-02-25 22:46:47.999
355	PROCESADOR	INTEL(R) XEON(R) GOLD 6140 CPU @ 2.30GHZ	\N	t	2026-02-25 22:46:48.004
356	PROCESADOR	INTEL(R) XEON(R) SILVER 4112 CPU @ 2.60GHZ	\N	t	2026-02-25 22:46:48.007
357	PROCESADOR	INTEL(R) XEON(R) SILVER 4114 CPU @ 2.20GHZ	\N	t	2026-02-25 22:46:48.01
358	PROCESADOR	INTEL(R) XEON(R) SILVER 4208 CPU @ 2.10GHZ	\N	t	2026-02-25 22:46:48.015
359	PROCESADOR	INTEL(R) XEON(R) SILVER 4210R CPU @ 2.40GHZ	\N	t	2026-02-25 22:46:48.023
360	PROCESADOR	INTEL(R) XEON(R) W-1270 CPU @ 3.40GHZ	\N	t	2026-02-25 22:46:48.026
361	PROCESADOR	PENTIUM(R) DUAL-CORE CPU E5400 @ 2.70GHZ	\N	t	2026-02-25 22:46:48.031
362	PROCESADOR	PENTIUM(R) DUAL-CORE CPU E5500 @ 2.80GHZ	\N	t	2026-02-25 22:46:48.034
363	PROCESADOR	EXYNOS 9810 DE OCHO NÚCLEOS A 2 GHZ + 1,7 GHZ	\N	t	2026-02-25 22:46:48.037
364	PROCESADOR	NO APLICA	\N	t	2026-02-25 22:46:48.041
365	MEMORIA_RAM	512 MB	\N	t	2026-02-25 22:46:48.044
366	MEMORIA_RAM	1GB	\N	t	2026-02-25 22:46:48.047
367	MEMORIA_RAM	2GB	\N	t	2026-02-25 22:46:48.051
368	MEMORIA_RAM	4GB	\N	t	2026-02-25 22:46:48.057
369	MEMORIA_RAM	6GB	\N	t	2026-02-25 22:46:48.06
370	MEMORIA_RAM	8GB	\N	t	2026-02-25 22:46:48.064
371	MEMORIA_RAM	12GB	\N	t	2026-02-25 22:46:48.067
372	MEMORIA_RAM	16GB	\N	t	2026-02-25 22:46:48.07
373	MEMORIA_RAM	20GB	\N	t	2026-02-25 22:46:48.075
374	MEMORIA_RAM	24GB	\N	t	2026-02-25 22:46:48.078
375	MEMORIA_RAM	32GB	\N	t	2026-02-25 22:46:48.082
376	MEMORIA_RAM	NO APLICA	\N	t	2026-02-25 22:46:48.086
377	DISCO_DURO	16GB	\N	t	2026-02-25 22:46:48.094
378	DISCO_DURO	64GB	\N	t	2026-02-25 22:46:48.097
379	DISCO_DURO	120GB	\N	t	2026-02-25 22:46:48.102
380	DISCO_DURO	128GB	\N	t	2026-02-25 22:46:48.107
381	DISCO_DURO	180GB	\N	t	2026-02-25 22:46:48.112
382	DISCO_DURO	240GB	\N	t	2026-02-25 22:46:48.118
383	DISCO_DURO	250GB	\N	t	2026-02-25 22:46:48.123
384	DISCO_DURO	256GB	\N	t	2026-02-25 22:46:48.127
385	DISCO_DURO	300GB	\N	t	2026-02-25 22:46:48.132
386	DISCO_DURO	320GB	\N	t	2026-02-25 22:46:48.141
387	DISCO_DURO	480GB	\N	t	2026-02-25 22:46:48.145
388	DISCO_DURO	500GB	\N	t	2026-02-25 22:46:48.149
389	DISCO_DURO	512GB	\N	t	2026-02-25 22:46:48.152
390	DISCO_DURO	600GB	\N	t	2026-02-25 22:46:48.155
391	DISCO_DURO	720GB	\N	t	2026-02-25 22:46:48.159
392	DISCO_DURO	750GB	\N	t	2026-02-25 22:46:48.162
393	DISCO_DURO	1TB	\N	t	2026-02-25 22:46:48.165
394	DISCO_DURO	1TB + 500GB	\N	t	2026-02-25 22:46:48.17
395	DISCO_DURO	4 TB	\N	t	2026-02-25 22:46:48.177
396	DISCO_DURO	5TB	\N	t	2026-02-25 22:46:48.18
397	DISCO_DURO	SSD 256GB	\N	t	2026-02-25 22:46:48.184
398	DISCO_DURO	NO APLICA	\N	t	2026-02-25 22:46:48.187
399	SISTEMA_OPERATIVO	ANDROID	\N	t	2026-02-25 22:46:48.19
400	SISTEMA_OPERATIVO	IOS	\N	t	2026-02-25 22:46:48.194
401	SISTEMA_OPERATIVO	LINUX	\N	t	2026-02-25 22:46:48.197
402	SISTEMA_OPERATIVO	MACOS BIG SUR	\N	t	2026-02-25 22:46:48.203
403	SISTEMA_OPERATIVO	MACOS CATALINA	\N	t	2026-02-25 22:46:48.216
404	SISTEMA_OPERATIVO	MACOS MONTEREY	\N	t	2026-02-25 22:46:48.224
405	SISTEMA_OPERATIVO	MACOS VENTURA	\N	t	2026-02-25 22:46:48.234
406	SISTEMA_OPERATIVO	MACOS SONOMA	\N	t	2026-02-25 22:46:48.239
407	SISTEMA_OPERATIVO	MACOS SEQUOIA	\N	t	2026-02-25 22:46:48.244
408	SISTEMA_OPERATIVO	MACOS TAHOE	\N	t	2026-02-25 22:46:48.25
409	SISTEMA_OPERATIVO	WINDOWS XP	\N	t	2026-02-25 22:46:48.255
410	SISTEMA_OPERATIVO	WINDOWS VISTA	\N	t	2026-02-25 22:46:48.26
411	SISTEMA_OPERATIVO	WINDOWS 7	\N	t	2026-02-25 22:46:48.265
412	SISTEMA_OPERATIVO	WINDOWS 8	\N	t	2026-02-25 22:46:48.274
413	SISTEMA_OPERATIVO	WINDOWS 8.1	\N	t	2026-02-25 22:46:48.277
414	SISTEMA_OPERATIVO	WINDOWS 10 HOME	\N	t	2026-02-25 22:46:48.282
415	SISTEMA_OPERATIVO	WINDOWS 10 PRO	\N	t	2026-02-25 22:46:48.285
416	SISTEMA_OPERATIVO	WINDOWS 11 HOME	\N	t	2026-02-25 22:46:48.288
417	SISTEMA_OPERATIVO	WINDOWS 11 PRO	\N	t	2026-02-25 22:46:48.293
418	SISTEMA_OPERATIVO	NO APLICA	\N	t	2026-02-25 22:46:48.3
419	MARCA	ACER	\N	t	2026-02-26 17:05:33.706
420	MARCA	APPLE	\N	t	2026-02-26 17:05:33.724
421	MARCA	ASUS	\N	t	2026-02-26 17:05:33.734
422	MARCA	BROTHER	\N	t	2026-02-26 17:05:33.744
423	MARCA	CANON	\N	t	2026-02-26 17:05:33.751
424	MARCA	CISCO	\N	t	2026-02-26 17:05:33.756
425	MARCA	DELL	\N	t	2026-02-26 17:05:33.764
426	MARCA	EPSON	\N	t	2026-02-26 17:05:33.767
427	MARCA	FUJITSU	\N	t	2026-02-26 17:05:33.772
428	MARCA	HP	\N	t	2026-02-26 17:05:33.775
429	MARCA	HUAWEI	\N	t	2026-02-26 17:05:33.778
430	MARCA	IBM	\N	t	2026-02-26 17:05:33.782
431	MARCA	LENOVO	\N	t	2026-02-26 17:05:33.785
432	MARCA	LG	\N	t	2026-02-26 17:05:33.788
433	MARCA	MICROSOFT	\N	t	2026-02-26 17:05:33.793
434	MARCA	MOTOROLA	\N	t	2026-02-26 17:05:33.802
435	MARCA	PANASONIC	\N	t	2026-02-26 17:05:33.805
436	MARCA	RICOH	\N	t	2026-02-26 17:05:33.81
437	MARCA	SAMSUNG	\N	t	2026-02-26 17:05:33.813
438	MARCA	TOSHIBA	\N	t	2026-02-26 17:05:33.816
439	MARCA	XEROX	\N	t	2026-02-26 17:05:33.821
440	MARCA	ZEBRA	\N	t	2026-02-26 17:05:33.823
441	MARCA	OTRO	\N	t	2026-02-26 17:05:33.827
442	MODELO	ELITEBOOK	\N	t	2026-02-26 17:05:33.831
443	MODELO	ENVY	\N	t	2026-02-26 17:05:33.839
444	MODELO	INSPIRON	\N	t	2026-02-26 17:05:33.842
445	MODELO	LATITUDE	\N	t	2026-02-26 17:05:33.848
446	MODELO	LASERJET	\N	t	2026-02-26 17:05:33.851
447	MODELO	MACBOOK AIR	\N	t	2026-02-26 17:05:33.854
448	MODELO	MACBOOK PRO	\N	t	2026-02-26 17:05:33.859
449	MODELO	OPTIPLEX	\N	t	2026-02-26 17:05:33.863
450	MODELO	PAVILION	\N	t	2026-02-26 17:05:33.866
451	MODELO	PRECISION	\N	t	2026-02-26 17:05:33.87
452	MODELO	PROBOOK	\N	t	2026-02-26 17:05:33.877
453	MODELO	SPECTRE	\N	t	2026-02-26 17:05:33.88
454	MODELO	SURFACE	\N	t	2026-02-26 17:05:33.884
455	MODELO	THINKPAD	\N	t	2026-02-26 17:05:33.888
456	MODELO	THINKCENTRE	\N	t	2026-02-26 17:05:33.891
457	MODELO	VOSTRO	\N	t	2026-02-26 17:05:33.896
458	MODELO	XPERIA	\N	t	2026-02-26 17:05:33.899
459	MODELO	ZBOOK	\N	t	2026-02-26 17:05:33.904
460	MODELO	OTRO	\N	t	2026-02-26 17:05:33.914
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias (id, nombre, icono) FROM stdin;
1	BOCINA	speaker
2	CAMARA IP	camera-video
3	CONTROLADORA MICROFONO	microphone
4	EQUIPO ESCRITORIO	computer-desktop
5	EQUIPO PORTATIL	laptop
6	EQUIPO TODO EN UNO	computer-desktop
7	ESCANER	document-magnifying-glass
8	IMPRESORA	printer
9	MICROFONO	microphone
10	MONITOR	tv
11	PLANTA TELEFONIA IP	phone
12	ROUTER	wifi
13	SERVIDOR	server
14	SWITCH	wifi
15	TABLETA	device-tablet
16	TELEFONO IP	phone
17	UPS	bolt
18	VIDEO BEAM	presentation
\.


--
-- Data for Name: documentos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documentos (id, nombre, "nombreArchivo", ruta, tipo, tamano, "activoId", "asignacionId", "hojaVidaId", "ticketId", "trazaTicketId", "creadoEn") FROM stdin;
1	10085545 2602.jpeg	1772141743168-665098880.jpeg	uploads/1772141743168-665098880.jpeg	image/jpeg	97717	1	\N	1	\N	\N	2026-02-26 21:35:43.189
\.


--
-- Data for Name: funcionarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.funcionarios (id, nombre, cedula, "codigoPersonal", cargo, area, email, telefono, activo, shortname, vinculacion, "empresaFuncionario", proyecto, departamento, ciudad, seccional, municipio, ubicacion, piso, "creadoEn") FROM stdin;
1	ASDF	123123	\N	AUXILIAR GESTIÓN HUMANA	TESORERÍA	n.camargo@cafedecolombia.com	123123	t	ASDF	EMPLEADO									2026-02-27 16:48:02.637
\.


--
-- Data for Name: hoja_vida; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hoja_vida (id, "activoId", tipo, descripcion, tecnico, costo, fecha, "proximoMantenimiento", "registradoPor", "casoAranda", estado, diagnostico, "responsableId") FROM stdin;
1	1	ACTUALIZACION	Test event for validation.	\N	\N	2026-02-26 00:00:00	\N	Administrador	\N	PROCESO_GARANTIA	\N	\N
\.


--
-- Data for Name: perfiles_reporte; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.perfiles_reporte (id, nombre, descripcion, "tipoReporte", columnas, "esPredefinido", "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tickets (id, titulo, descripcion, estado, prioridad, tipo, "funcionarioId", "activoId", "asignadoAId", "creadoPorId", "creadoEn", "actualizadoEn", "cerradoEn") FROM stdin;
\.


--
-- Data for Name: trazas_hoja_vida; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trazas_hoja_vida (id, "hojaVidaId", "estadoAnterior", "estadoNuevo", observacion, fecha, "usuarioId") FROM stdin;
1	1	\N	CREADO	Creación del evento	2026-02-26 20:26:38.312	1
2	1	CREADO	PROCESO_GARANTIA	Final verification note	2026-02-26 20:27:22.813	1
3	1	PROCESO_GARANTIA	PROCESO_GARANTIA	[Archivo Adjunto: 10085545 2602.jpeg] - Nota img	2026-02-26 21:35:43.198	1
\.


--
-- Data for Name: trazas_ticket; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trazas_ticket (id, "ticketId", "tipoTraza", comentario, "estadoAnterior", "estadoNuevo", "creadoPorId", "creadoEn") FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nombre, email, password, rol, activo, "creadoEn", "actualizadoEn") FROM stdin;
1	Administrador	admininventario@cafedecolombia.com	$2a$10$3sAa1yy3oVm7xLGgV94RueDBov/zHWVFlRykTTMHHGaNvZtGvNCdK	ADMIN	t	2026-02-25 22:46:46.344	2026-02-25 22:46:46.344
2	Usuario Consulta	invitado@cafedecolombia.com	$2a$10$KrMJ08STD4FvrbIufBUofOr1OSL0CRX0V7mTW9pYxMaQEtYPFYr8m	CONSULTA	t	2026-02-25 22:46:46.415	2026-02-25 22:46:46.415
3	JHONATHAN ARMANDO CAMARGO IZQUIERDO	jhonathan.camargo@cafedecolombia.com	$2a$10$pryF877qSa0m/JlXPYHbCet/YKWEJ9MP6CalBtvRrVwQNUbmk61/a	TECNICO	t	2026-02-27 14:56:36.684	2026-02-27 14:56:36.684
4	Administrador	admin@cafedecolombia.com	$2a$10$tebuw6HQkCp5Rn..8XP0UOlYgA/ky0Orxmu.Za8Hc7gZ7jt6AsyRm	ADMIN	t	2026-03-09 13:39:48.852	2026-03-09 16:48:33.676
\.


--
-- Name: actas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.actas_id_seq', 3, true);


--
-- Name: activos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activos_id_seq', 1, true);


--
-- Name: asignaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asignaciones_id_seq', 2, true);


--
-- Name: catalogos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.catalogos_id_seq', 460, true);


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_id_seq', 18, true);


--
-- Name: documentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.documentos_id_seq', 1, true);


--
-- Name: funcionarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.funcionarios_id_seq', 1, true);


--
-- Name: hoja_vida_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hoja_vida_id_seq', 1, true);


--
-- Name: perfiles_reporte_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.perfiles_reporte_id_seq', 1, false);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tickets_id_seq', 1, false);


--
-- Name: trazas_hoja_vida_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trazas_hoja_vida_id_seq', 3, true);


--
-- Name: trazas_ticket_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trazas_ticket_id_seq', 1, false);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 6, true);


--
-- Name: actas actas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actas
    ADD CONSTRAINT actas_pkey PRIMARY KEY (id);


--
-- Name: activos activos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activos
    ADD CONSTRAINT activos_pkey PRIMARY KEY (id);


--
-- Name: asignaciones asignaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT asignaciones_pkey PRIMARY KEY (id);


--
-- Name: catalogos catalogos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogos
    ADD CONSTRAINT catalogos_pkey PRIMARY KEY (id);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: documentos documentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_pkey PRIMARY KEY (id);


--
-- Name: funcionarios funcionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_pkey PRIMARY KEY (id);


--
-- Name: hoja_vida hoja_vida_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoja_vida
    ADD CONSTRAINT hoja_vida_pkey PRIMARY KEY (id);


--
-- Name: perfiles_reporte perfiles_reporte_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_reporte
    ADD CONSTRAINT perfiles_reporte_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: trazas_hoja_vida trazas_hoja_vida_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trazas_hoja_vida
    ADD CONSTRAINT trazas_hoja_vida_pkey PRIMARY KEY (id);


--
-- Name: trazas_ticket trazas_ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trazas_ticket
    ADD CONSTRAINT trazas_ticket_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: activos_placa_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX activos_placa_key ON public.activos USING btree (placa);


--
-- Name: catalogos_dominio_valor_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX catalogos_dominio_valor_key ON public.catalogos USING btree (dominio, valor);


--
-- Name: categorias_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categorias_nombre_key ON public.categorias USING btree (nombre);


--
-- Name: funcionarios_cedula_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX funcionarios_cedula_key ON public.funcionarios USING btree (cedula);


--
-- Name: funcionarios_codigoPersonal_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "funcionarios_codigoPersonal_key" ON public.funcionarios USING btree ("codigoPersonal");


--
-- Name: perfiles_reporte_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX perfiles_reporte_nombre_key ON public.perfiles_reporte USING btree (nombre);


--
-- Name: usuarios_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);


--
-- Name: actas actas_creadoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actas
    ADD CONSTRAINT "actas_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: actas actas_funcionarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actas
    ADD CONSTRAINT "actas_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES public.funcionarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activos activos_categoriaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activos
    ADD CONSTRAINT "activos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES public.categorias(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asignaciones asignaciones_activoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT "asignaciones_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES public.activos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: asignaciones asignaciones_funcionarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT "asignaciones_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES public.funcionarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: documentos documentos_activoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT "documentos_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES public.activos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: documentos documentos_asignacionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT "documentos_asignacionId_fkey" FOREIGN KEY ("asignacionId") REFERENCES public.asignaciones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: documentos documentos_hojaVidaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT "documentos_hojaVidaId_fkey" FOREIGN KEY ("hojaVidaId") REFERENCES public.hoja_vida(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: documentos documentos_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT "documentos_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.tickets(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: documentos documentos_trazaTicketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT "documentos_trazaTicketId_fkey" FOREIGN KEY ("trazaTicketId") REFERENCES public.trazas_ticket(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: hoja_vida hoja_vida_activoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoja_vida
    ADD CONSTRAINT "hoja_vida_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES public.activos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hoja_vida hoja_vida_responsableId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hoja_vida
    ADD CONSTRAINT "hoja_vida_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tickets tickets_activoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES public.activos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tickets tickets_asignadoAId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_asignadoAId_fkey" FOREIGN KEY ("asignadoAId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tickets tickets_creadoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tickets tickets_funcionarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES public.funcionarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: trazas_hoja_vida trazas_hoja_vida_hojaVidaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trazas_hoja_vida
    ADD CONSTRAINT "trazas_hoja_vida_hojaVidaId_fkey" FOREIGN KEY ("hojaVidaId") REFERENCES public.hoja_vida(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: trazas_hoja_vida trazas_hoja_vida_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trazas_hoja_vida
    ADD CONSTRAINT "trazas_hoja_vida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: trazas_ticket trazas_ticket_creadoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trazas_ticket
    ADD CONSTRAINT "trazas_ticket_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: trazas_ticket trazas_ticket_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trazas_ticket
    ADD CONSTRAINT "trazas_ticket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.tickets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict qEffkiuNUobsCc63aBI8a1TKhJwgmhxb6E6OgcNhVFLglhcra4dFHzPhPiaIOuF

