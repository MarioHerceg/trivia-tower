export enum AsyncStatusType {
  INIT = 'init',
  LOADING = 'loading',
  LOADED = 'loaded',
  FAILED = 'failed',
}

interface IAsyncInitStatus {
  type: AsyncStatusType.INIT;
}

interface IAsyncLoadingStatus {
  type: AsyncStatusType.LOADING;
}

interface IAsyncLoadedStatus {
  type: AsyncStatusType.LOADED;
}

interface IAsyncFailedStatus {
  type: AsyncStatusType.FAILED;
  errorMessage: string;
}

export const toAsyncInitStatus = (): IAsyncInitStatus => ({ type: AsyncStatusType.INIT });

export const toAsyncLoadingStatus = (): IAsyncLoadingStatus => ({ type: AsyncStatusType.LOADING });

export const toAsyncLoadedStatus = (): IAsyncLoadedStatus => ({ type: AsyncStatusType.LOADED });

export const toAsyncFailedStatus = (error: Error | string): IAsyncFailedStatus => {
  const errorMessage = error instanceof Error ? error.message : error;
  return {
    type: AsyncStatusType.FAILED,
    errorMessage,
  };
};

export const isAsyncInitStatus = (status: IAsyncStatus): status is IAsyncInitStatus =>
  status.type === AsyncStatusType.INIT;

export const isAsyncLoadingStatus = (status: IAsyncStatus): status is IAsyncLoadingStatus =>
  status.type === AsyncStatusType.LOADING;

export const isAsyncLoadedStatus = (status: IAsyncStatus): status is IAsyncLoadedStatus =>
  status.type === AsyncStatusType.LOADED;

export const isAsyncFailedStatus = (status: IAsyncStatus): status is IAsyncFailedStatus =>
  status.type === AsyncStatusType.FAILED;

export type IAsyncStatus = IAsyncInitStatus | IAsyncLoadingStatus | IAsyncLoadedStatus | IAsyncFailedStatus;
