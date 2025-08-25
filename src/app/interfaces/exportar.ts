export interface exportarPdf{
    ok: boolean;
    archivo: archivoBufer;
    nombre_archivo: string;
}

export interface archivoBufer{
    type: string;
    data: number[]
}

export interface ResponseExportarPDF{
    ok: boolean;
    archivo: string;
    nombre_archivo: string;
}