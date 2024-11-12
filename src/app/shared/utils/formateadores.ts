export function agregarMayusculas(text: string): string {
    return text
        .split(' ') // Divide el texto en palabras
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza la primera letra
        .join(' '); // Une las palabras de nuevo
}

export function formatearRut(value: string): string {
    let rut = value;

    rut = rut.replace(/\./g, '').replace(/-/g, '');

    if (rut.length > 1) {
        const body = rut.slice(0, -1);
        const dv = rut.slice(-1);

        let formattedRut = '';
        for (let i = body.length; i > 0; i -= 3) {
            const start = Math.max(i - 3, 0);
            formattedRut = `${body.substring(start, i)}.${formattedRut}`;
        }

        formattedRut = formattedRut.endsWith('.') ? formattedRut.slice(0, -1) : formattedRut;
        return `${formattedRut}-${dv}`;
    }

    return rut;
}


export function soloNumeros(valor: string): string {
    return valor.replace(/[^0-9]/g, '');
}

export function formateadorMiles(valor: string | number): string {
    valor = valor.toString()
    if (!valor || valor.includes(' ')) {
        return '0,00';
    }
    if(valor.includes(',')){
        valor = valor.replaceAll('.', '')
        valor = valor.replace(',', '.')
    }

    let [parteEntera, parteDecimal] = parseFloat(valor).toFixed(2).split('.');

    // Formatear parte entera con puntos cada 3 dígitos
    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Unir parte entera y decimal usando coma como separador decimal
    return `${parteEntera},${parteDecimal}`;
}

export function formateadorMilesDesdeBase(valor: string | number): string {
    if (!valor) {
        return '0,00';
    }
    valor = valor.toString()
    let [parteEntera, parteDecimal] = parseFloat(valor.toString()).toFixed(2).split('.');

    // Formatear parte entera con puntos cada 3 dígitos
    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Unir parte entera y decimal usando coma como separador decimal
    return `${parteEntera},${parteDecimal}`;
}

export function dejarNumeroBrutos(valor: string): string {
    if (valor == '0' || typeof(valor) == 'number') return valor;
    valor = valor.replace(/\./g, '');
    valor = valor.replace(',', '.');
    return valor
}