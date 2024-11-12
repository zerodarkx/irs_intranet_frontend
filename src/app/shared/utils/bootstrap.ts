import { Modal } from "bootstrap";

let modal: Modal;

export function abrirModal(id: string):void{
    const modalElement = document.getElementById(id);
    modal = new Modal(modalElement!);
    modal.show()
}

export function cerrarModal(): void{
    modal.hide()
}