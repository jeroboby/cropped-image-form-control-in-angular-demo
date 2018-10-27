import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnChanges,
  forwardRef,
  Output
} from '@angular/core';
import { NgxCroppieComponent } from 'ngx-croppie';
import { CroppieOptions } from 'croppie';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-image-form-control',
  templateUrl: './custom-image-form-control.component.html',
  styleUrls: ['./custom-image-form-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomImageFormControlComponent),
      multi: true
    }
  ]
})

/* Implementation des interfaces */
export class CustomImageFormControlComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  /*On passe la hauteur de l'image */
  @Input()
  public imgCropToHeight = '400';

  /* On passe la largueur de l'image */
  @Input()
  public imgCropToWidth = '400';

  /* Retourne le type d'image */
  @Input()
  private responseType: 'blob';

  /* L'image rognée */
  public croppieImage;

  /* Option pour l'image rognée */
  public outputoption = { type: 'blob', size: 'original' };

  /* Element du form control */
  @ViewChild('ngxCroppie')
  ngxCroppie: NgxCroppieComponent;

  constructor() {}

  ngOnInit() {
    /* la taille défini pour l'image rognée */
    this.outputoption = { type: this.responseType, size: 'original' };
  }

  ngOnChanges(changes: any) {
    if (this.croppieImage) {
      return;
    }

    if (!changes.imageUrl) {
      return;
    }
    if (!changes.imageUrl.previousValue && changes.imageUrl.currentValue) {
      this.croppieImage = changes.imageUrl.currentValue;
      this.propagateChange(this.croppieImage);
    }
  }

  
   /* Les options selectionées */

  public get croppieOptions(): CroppieOptions {
    const opts: CroppieOptions = {};
    opts.viewport = {
      width: parseInt(this.imgCropToWidth, 10),
      height: parseInt(this.imgCropToHeight, 10)
    };
    opts.boundary = {
      width: parseInt(this.imgCropToWidth, 10) + 50,
      height: parseInt(this.imgCropToWidth, 10) + 50
    };

    opts.enforceBoundary = true;
    return opts;
  }

  /**
   * Les evenements activés à la selection de l'image
   */
  imageUploadEvent(evt: any) {
    if (!evt.target) {
      return;
    }
    if (!evt.target.files) {
      return;
    }

    if (evt.target.files.length !== 1) {
      return;
    }

    const file = evt.target.files[0];
    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/gif' &&
      file.type !== 'image/jpg'
    ) {
      return;
    }

    const fr = new FileReader();
    fr.onloadend = loadEvent => {
      this.croppieImage = fr.result.toString();
    };
    fr.readAsDataURL(file);
  }

  newImageResultFromCroppie(img: string) {
    this.croppieImage = img;
    this.propagateChange(this.croppieImage);
  }

  
  writeValue(value: any) {
    if (value !== undefined) {
      this.croppieImage = value;
      this.propagateChange(this.croppieImage);
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
