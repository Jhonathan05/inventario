const { z } = require('zod');

const validateData = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body); // zod actualiza y coerce los datos
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Errores de validación',
                details: error.errors
            });
        }
        res.status(500).json({ error: 'Error interno al validar' });
    }
};

module.exports = { validateData };
