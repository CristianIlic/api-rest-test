const z = require('zod')

const pokemonSchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }),
    skill: z.string(),
    type: z.array(z.enum(["leaf", "fire", "water", "ghost", "dragon"]))
})

function validatePokemon (object) {
    return pokemonSchema.safeParse(object)
}

function validatePartialPokemon (object) {
    return pokemonSchema.partial().safeParse(object)
}

module.exports = {
    validatePokemon,
    validatePartialPokemon
}