import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErrorHttpCustom } from 'src/app/interfaces';
import { PropiedadesService } from 'src/app/services';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-caracteristicas-corretaje',
  templateUrl: './caracteristicas-corretaje.component.html',
  styleUrls: ['./caracteristicas-corretaje.component.css']
})
export class CaracteristicasCorretajeComponent {
  caracteristicas: any[] = []//[{ "suites": 1, "serviceRoom": false, "jacuzzi": false, "livingRooms": 2, "terraceSurface": 3, "orientation": "NorPoniente-Sur", "constructionYear": 4, "floors": 5, "petsAllowed": false, "typeHeating": "Chimenea", "tennisCourt": false, "pool": false, "automaticGate": false, "withGatedCommunity": false, "warehouses": 6, "contactSchedule": "7", "alarm": false, "hasNaturalGas": false, "hasTelephoneLine": false, "onlyFamilies": false, "hasBalcony": false, "bathroomVisit": false, "hasCloset": false, "kitchen": false, "hasDinningRoom": false, "hasStudy": false, "jardinFormado": false, "hasAttic": false, "hasGrill": false, "yard": false, "gameRoom": false, "hasTerrace": false, "walkinCloset": false, "hasInternetAccess": false, "hasAirConditioning": false, "indoorBasketballCourt": false, "hasPaddleCourt": false, "chimney": false, "hasSecurity": true, "gym": false, "withLaundryConnection": false }]


  formCaracteristicas!: FormGroup// = this.fb.group(this.caracteristicas[0]);

  constructor(
    private fb: FormBuilder,
    private sPropiedades: PropiedadesService,
  ) { }

  ngOnInit() {
    this.obtenerCaracteristicas();
  }

  obtenerCaracteristicas() {
    this.sPropiedades.obtenerCaracteristicasPropiedad(this.sPropiedades.id_propiedad!)
      .subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.caracteristicas = resp.data;
            this.formCaracteristicas = this.fb.group(this.caracteristicas[0]);
          }
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }

  // Función que genera las clases dinámicamente
  getButtonClasses(controlName: string, expectedValue: boolean): string {
    return this.formCaracteristicas.get(controlName)?.value === expectedValue
      ? expectedValue ? 'btn-success' : 'btn-danger'
      : 'btn-outline-secondary';
  }

  // Otra función para manejar el cambio de estado de los radio buttons
  setButtonValue(controlName: string, value: boolean) {
    this.formCaracteristicas.get(controlName)?.setValue(value);
  }
}
