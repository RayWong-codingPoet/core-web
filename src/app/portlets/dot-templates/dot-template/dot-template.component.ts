import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dot-template-test',
    templateUrl: './dot-template.component.html',
    styleUrls: ['./dot-template.scss']
})
export class DotTemplateComponent implements OnInit {
    group: FormGroup;
    editor: any;
    constructor(
        private fb: FormBuilder,
        private dotTemplateService: DotTemplatesService,
        private dotRouterService: DotRouterService
    ) {}

    ngOnInit(): void {
        this.group = this.fb.group({
            title: ['', Validators.required],
            friendlyName: '',
            body: ['', Validators.required]
        });
    }

    initEditor(editor) {
        this.editor = editor;
    }

    enterInformation() {
        const selection = this.editor.getSelection();
        const text = 'This is a string';
        const operation = { range: selection, text: text, forceMoveMarkers: true };
        this.editor.executeEdits('source', [operation]);
    }

    onSubmit(event) {
        event.preventDefault();
        this.dotTemplateService
            .create(this.group.value)
            .pipe(take(1))
            .subscribe(() => {
                if (this.group.valid) {
                    this.dotRouterService.goToURL('/c/templates');
                }
            });
    }
}
