import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss'],
  standalone: false,
})
export class ErrorStateComponent {
  @Input() message = 'Une erreur est survenue. Veuillez réessayer.';
  @Output() retry = new EventEmitter<void>();
}
