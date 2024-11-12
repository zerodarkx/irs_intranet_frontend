import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function rutValidator(control: AbstractControl): ValidationErrors | null {
    const rut = control.value;

    if (!rut || typeof rut !== 'string') {
        return null;  // El campo está vacío, no validamos aún
    }

    // Eliminar puntos y guiones
    let rutLimpio = rut.replace(/[^\dkK]/g, '');

    // Validar el formato básico (al menos un número seguido de un guion y un dígito verificador)
    const rutRegex = /^[0-9]+[kK0-9]$/;
    if (!rutRegex.test(rutLimpio)) {
        return { rutInvalido: true };  // Formato inválido
    }

    // Separar el número del RUT y el dígito verificador
    const rutCuerpo = rutLimpio.slice(0, -1);  // El número del RUT (sin el dígito verificador)
    const digitoVerificador = rutLimpio.slice(-1).toUpperCase();  // El dígito verificador

    // Validar el dígito verificador con el algoritmo del RUT
    if (calcularDigitoVerificador(rutCuerpo) !== digitoVerificador) {
        return { rutInvalido: true };  // El dígito verificador no coincide
    }

    return null;  // Si el RUT es válido, no hay error
}

// Función para calcular el dígito verificador según el algoritmo del RUT
function calcularDigitoVerificador(rutCuerpo: string): string {
    let suma = 0;
    let multiplo = 2;

    // Recorrer el RUT desde el último número hacia el primero
    for (let i = rutCuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(rutCuerpo[i], 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;  // Multiplicadores: 2, 3, 4, 5, 6, 7
    }

    const resto = suma % 11;
    const digito = 11 - resto;

    if (digito === 11) {
        return '0';  // Si el dígito es 11, el verificador es '0'
    } else if (digito === 10) {
        return 'K';  // Si el dígito es 10, el verificador es 'K'
    } else {
        return digito.toString();  // Para cualquier otro caso, retornamos el dígito calculado
    }
}

// FUNCION PARA VALIDAR QUE NO SEA UN CORREO DE LA INSTITUCION
export function validarCorreoInstitucional(control: AbstractControl): ValidationErrors | null {
    const correo: string[] = control.value.split("@");
    if (correo[1]) {
        const dominios = ['irsinversiones.com', 'creditotal.cl', 'anticipatuventa.cl'];
        if (dominios.includes(correo[1].toLowerCase())) return { dominioIncorrecto: true };
    }

    return null;
}

export function soloNumerosFormulario(control: AbstractControl): ValidationErrors | null {
    const valor = (control.value).toString().replaceAll('.', '');

    if (!valor) return null;
    const numeroRegex = /^[0-9,]+$/;

    // Si el valor contiene algo más que números, retornamos un error
    if (!numeroRegex.test(valor)) return { soloNumeros: true };

    return null;  // Si es válido, devolvemos null (sin errores)
}

export function validarFechas(fechaDesdeKey: string, fechaHastaKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const fechaDesde = formGroup.get(fechaDesdeKey)?.value;
        const fechaHasta = formGroup.get(fechaHastaKey)?.value;

        if(!fechaDesde && fechaHasta) return { fechaRangoInvalido: true};
        if (!fechaDesde || !fechaHasta) return null;

        const isInvalid = new Date(fechaDesde) > new Date(fechaHasta);
        return isInvalid ? { fechaRangoInvalido: true } : null;
    }
}