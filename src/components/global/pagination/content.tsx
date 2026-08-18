import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

type PaginationUiProps = {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

function getPaginationRange(current: number, total: number, delta = 1) {
  const range: number[] = [];
  const rangeWithDots: (number | "...")[] = [];
  let last: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (last && i - last > 1) {
      rangeWithDots.push("...");
    }

    rangeWithDots.push(i);
    last = i;
  }

  return rangeWithDots;
}

export default function PaginationUi({
  currentPage,
  totalPage,
  onPageChange,
  isLoading = false,
}: PaginationUiProps) {
  if (totalPage <= 1) {
    return null;
  }

  const paginationRange = getPaginationRange(currentPage, totalPage);

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={
              currentPage === 1 || isLoading
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Page numbers */}
        {paginationRange.map((item, idx) => (
          <PaginationItem key={`${item}-${idx}`}>
            {item === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={currentPage === item}
                onClick={() => {
                  if (!isLoading) {
                    onPageChange(item);
                  }
                }}
                className={
                  isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPage) {
                onPageChange(currentPage + 1);
              }
            }}
            className={
              currentPage === totalPage || isLoading
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
