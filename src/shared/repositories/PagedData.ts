export interface PagedData<T> {
    items: T[];
    pageSize: number;
    pageOffset: number;
    count: number;
}