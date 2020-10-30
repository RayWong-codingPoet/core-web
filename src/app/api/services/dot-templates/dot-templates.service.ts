import { Injectable } from '@angular/core';
import { CoreWebService, DotRequestOptionsArgs } from 'dotcms-js';
import { Observable } from 'rxjs';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { catchError, map, pluck, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { DotTemplateAdvancedProps } from '@shared/models/dot-templates/dot-template-advanced.model';

/**
 * Provide util methods to handle templates in the system.
 * @export
 * @class DotTemplatesService
 */
@Injectable()
export class DotTemplatesService {
    constructor(
        private coreWebService: CoreWebService,
        private httpErrorManagerService: DotHttpErrorManagerService
    ) {}

    /**
     * Return a list of templates.
     * @returns Observable<DotTemplate[]>
     * @memberof DotTemplatesService
     */
    get(): Observable<DotTemplate[]> {
        const url = '/api/v1/templates';
        return this.request<DotTemplate[]>({ url });
    }

    /**
     * Creates a template
     * @returns Observable<DotTemplate>
     * @memberof DotTemplatesService
     */
    create(values: DotTemplateAdvancedProps): Observable<DotTemplate> {
        const url = '/api/v1/templates';
        return this.request<DotTemplate>({ method: 'POST', url, body: JSON.stringify(values) });
    }

    private request<T>(options: DotRequestOptionsArgs): Observable<T> {
        const response$ = this.coreWebService.requestView<T>(options);
        return response$.pipe(
            pluck('entity'),
            catchError((error: HttpErrorResponse) => {
                return this.httpErrorManagerService.handle(error).pipe(
                    take(1),
                    map(() => null)
                );
            })
        );
    }
}
