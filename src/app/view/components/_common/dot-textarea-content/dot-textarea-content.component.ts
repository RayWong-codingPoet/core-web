import { Component, Input, OnInit, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
    selector: 'dot-textarea-content',
    templateUrl: './dot-textarea-content.component.html',
    styleUrls: ['./dot-textarea-content.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotTextareaContentComponent)
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotTextareaContentComponent implements OnInit, ControlValueAccessor {
    @Input()
    code: any = {
        mode: 'text',
        options: {}
    };

    @Input()
    height: string;

    @Input()
    show;

    @Input()
    value = '';

    @Input()
    width: string;

    selectOptions: SelectItem[] = [];
    selected: string;
    styles: any;
    editorOptions = {
        theme: 'vs-light',
        minimap: {
            enabled: false
        },
        cursorBlinking: 'solid',
        overviewRulerBorder: false,
        mouseWheelZoom: false,
        LineNumbersType: 'on'
    };

    private DEFAULT_OPTIONS: SelectItem[] = [
        { label: 'Plain', value: 'plain' },
        { label: 'Code', value: 'code' }
    ];

    constructor() {}

    propagateChange = (_: any) => {};

    ngOnInit() {
        this.selectOptions = this.show
            ? this.show
                  .map((item) => {
                      return this.DEFAULT_OPTIONS.find((option) => option.value === item);
                  })
                  .filter((item) => item) // Remove undefined values in the array
            : this.DEFAULT_OPTIONS;

        this.selected = this.selectOptions[0].value;

        this.propagateChange(this.value);

        this.styles = {
            width: this.width || '100%',
            height: this.height || '21.42rem'
        };
    }

    /**
     * Prevent enter to propagate
     *
     * @param {KeyboardEvent} $event
     * @memberof DotTextareaContentComponent
     */
    onKeyEnter($event: KeyboardEvent): void {
        /*
            This field is use in dot-dialog.component when we hit enter it triggers the "Accept"
            action in the dialog, but for this case we don't want to do that because this fields
            are multilines, which mean that "enter" should do a "next line".
        */
        $event.stopPropagation();
    }

    /**
     * Update the value and form control
     *
     * @param any value
     * @memberof DotTextareaContentComponent
     */
    onModelChange(value: string) {
        this.value = value;
        this.propagateChange(value ? value.replace(/\r/g, '').split('\n').join('\r\n') : value);
    }

    /**
     * Update model with external value
     *
     * @param string value
     * @memberof DotTextareaContentComponent
     */
    writeValue(value: string): void {
        if (value) {
            this.value = value || '';
        }
    }

    /**
     * Set the call callback to update value on model change
     *
     * @param any fn
     * @memberof DotTextareaContentComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
}
