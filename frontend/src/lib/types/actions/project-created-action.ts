import type { BaseAction } from './actions.type';

export interface ProjectCreatedAction extends BaseAction {
    type: 'ProjectCreated';
    by: string;
}
