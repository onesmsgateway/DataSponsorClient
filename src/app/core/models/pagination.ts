export class Pagination {
    pageIndex: number;
    pageSize;
    totalRow: number;
    totalPage: number;

    constructor() {
        this.pageIndex = 1;
        this.pageSize = 20;
        this.totalRow = 0;
        this.totalPage = 0;
    }
}