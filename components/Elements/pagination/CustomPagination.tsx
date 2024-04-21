import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const numOfItemsSelectOptions = [
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 30,
    label: "30",
  },
];

type TCustomPaginationProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
  onChangeNumOfItemsPerPage: (numOfItems: number) => void;
};

export function CustomPagination({
  count,
  page,
  rowsPerPage,
  onChangePage,
  onChangeNumOfItemsPerPage,
}: TCustomPaginationProps) {
  const isPaginationPrevDisabled = !count || page === 1;
  const isPaginationNextDisabled = !count || page === Math.ceil(count / rowsPerPage);

  const isPageInRange = (pageNumber: number) =>
    pageNumber === 1 || pageNumber === count / rowsPerPage || Math.abs(page - pageNumber) < 3;
  const isPageAtEdge = (pageNumber: number) => Math.abs(page - pageNumber) === 3;

  return (
    <div className="flex items-center justify-center gap-5 py-2">
      <Select onValueChange={(value) => onChangeNumOfItemsPerPage(Number(value))} disabled={!count}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Num. of items" />
        </SelectTrigger>
        <SelectContent>
          {numOfItemsSelectOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Pagination className="flex gap-2">
        <PaginationPrevious
          disabled={isPaginationPrevDisabled}
          onClick={() => {
            if (isPaginationPrevDisabled) return;
            onChangePage(page - 1);
          }}
        >
          Previous
        </PaginationPrevious>

        <PaginationContent>
          {Array.from({ length: Math.ceil(count / rowsPerPage) }).map((_, index) => {
            const pageNumber = index + 1;

            if (isPageInRange(pageNumber)) {
              return (
                <PaginationItem key={index} onClick={() => page !== pageNumber && onChangePage(pageNumber)}>
                  <PaginationLink
                    className={
                      page === pageNumber ? "bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800" : ""
                    }
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            if (isPageAtEdge(pageNumber)) {
              return <PaginationEllipsis key={index}>...</PaginationEllipsis>;
            }

            return null;
          })}
        </PaginationContent>

        <PaginationNext
          disabled={isPaginationNextDisabled}
          onClick={() => {
            if (isPaginationNextDisabled) return;
            onChangePage(page + 1);
          }}
        >
          Next
        </PaginationNext>
      </Pagination>
    </div>
  );
}
