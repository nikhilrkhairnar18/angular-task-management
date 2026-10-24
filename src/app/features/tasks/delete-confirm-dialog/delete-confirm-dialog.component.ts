import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrl: './delete-confirm-dialog.component.css',
})
export class DeleteConfirmDialogComponent {
  readonly taskTitle = input.required<string>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
