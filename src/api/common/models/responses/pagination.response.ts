export class PaginationResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    currentPageRecords: number;
    data: T[];

    constructor(
        data: T[],
        totalRecords: number,
        pageNumber: number,
        pageSize: number,
    ) {
        this.data = data;
        this.totalRecords = totalRecords;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalPages = Math.ceil(totalRecords / pageSize);
        this.currentPageRecords = data.length;
    }
}
