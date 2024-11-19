import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio-mantendor',
  templateUrl: './inicio-mantendor.component.html',
  styleUrls: ['./inicio-mantendor.component.css']
})
export class InicioMantendorComponent {

  rutasMantenedroes = [
    { name: 'Usuarios', ruta: 'usuario' },
    { name: 'Tipo Perfiles', ruta: 'tipoPerfiles' },
    { name: 'Tipo Propiedad', ruta: 'tipoPropiedad' },
    { name: 'Tipo Imagen', ruta: 'tipoImagen' },
    { name: 'Tipo Documento', ruta: 'tipoDocumento' },
    { name: 'Tipo Canal Contacto', ruta: 'tipoCanalContacto' },
    { name: 'Lineas de Negocio', ruta: 'lineaNegocio' },
    { name: 'Canales de Simulacion', ruta: 'canalSimulacion' },
    { name: 'Estado de Cliente', ruta: 'estadoCliente' },
  ]

}
