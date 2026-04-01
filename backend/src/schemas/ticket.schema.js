const { z } = require('zod');

// Esquema para creación de tickets (se utiliza coerce para números que llegan como strings en FormData)
const crearTicketSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(200),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA'),
  tipo: z.enum(['INCIDENTE', 'REQUERIMIENTO']).default('REQUERIMIENTO'),
  funcionarioId: z.coerce.number().int().positive(),
  activoId: z.coerce.number().int().positive().optional().nullable(),
  solucionTecnica: z.string().optional().nullable(),
  conclusiones: z.string().optional().nullable()
});

// Esquema para actualización de estados
const actualizarEstadoSchema = z.object({
  nuevoEstado: z.enum(['CREADO', 'ASIGNADO', 'EN_PROCESO', 'ESPERANDO_TERCERO', 'RESUELTO', 'COMPLETADO']),
  comentario: z.string().optional(),
  solucionTecnica: z.string().optional(),
  conclusiones: z.string().optional()
});

// Esquema para asignación de tickets
const asignarTicketSchema = z.object({
  asignadoAId: z.coerce.number().int().positive().nullable().optional(),
  comentario: z.string().optional()
});

// Esquema para comentarios básicos
const agregarComentarioSchema = z.object({
  comentario: z.string().optional()
});

module.exports = {
  crearTicketSchema,
  actualizarEstadoSchema,
  asignarTicketSchema,
  agregarComentarioSchema
};
