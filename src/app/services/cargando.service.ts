import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargandoService {

  private peticionesActivas = 0;
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  show(): void {
    this.peticionesActivas++;
    if (!this._isLoading.value) {
      setTimeout(() => this._isLoading.next(true), 0);
    }
  }

  hide(): void {
    if (this.peticionesActivas > 0) {
      this.peticionesActivas--;
    }
    if (this.peticionesActivas === 0) {
      setTimeout(() => this._isLoading.next(false), 0);
    }
    
  }
}
