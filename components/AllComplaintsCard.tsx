"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ComplaintCard from "@/components/ComplaintCard";
import { Grid3x3, List } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { LoadingSpinner } from "./LoadingComponents";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import CTAButton from "./CTAButton";
import debounce from "lodash/debounce";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ComplaintsWithHasMore } from "@/types/types";
import { Category } from "@/app/generated/prisma";

const AllComplaintsCard = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isRefetching } = useInfiniteQuery({
    queryKey: ['allComplaints'],
    queryFn: async ({ pageParam }) => {
      const res = await api.get<ComplaintsWithHasMore>(
        `/api/allComplaints?page=${pageParam}&limit=9&search=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}&status=${statusFilter}&category=${categoryFilter}`
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    retry: false,
    refetchOnWindowFocus: false
  });

  const debouncedSearch = useMemo(() => (
    debounce(() => {
      refetch();
    }, 500)
  ), []);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    if (sortBy || statusFilter || categoryFilter) {
      refetch();
    }
  }, [sortBy, statusFilter, categoryFilter]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch();
    }
  }, [searchTerm]);

  const complaints = data?.pages.flatMap((page) => page.complaints) || [];
  const totalCount = data?.pages[0]?.filteredOrNotFilteredCount || 0;

  const getCategoryLabel = (category: string) => {
    const words = category.split('_').map(word => {
      if (word === 'NE') return 'në';
      return word.charAt(0) + word.slice(1).toLowerCase();
    });
    return words.join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link className="text-indigo-600 font-semibold hover:text-xl transition-all ease-in-out flex flex-row gap-1 text-lg w-fit" href={'/shto-ankese'}>
              Shtoni Ankesë <FaArrowRight className="rotate-[-35deg]" />
            </Link>
            <p className="text-muted-foreground">
              Lista e të gjitha ankesave në platformën tonë
            </p>
          </div>

          {/* View Toggle */}
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "grid" | "table")}
            className="hidden md:block"
          >
            <TabsList>
              <TabsTrigger value="grid">
                <Grid3x3 className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table">
                <List className="h-4 w-4 mr-2" />
                Tabelë
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search and Filter Controls - Always visible */}
        <div className="flex flex-row flex-wrap justify-between">
          <div className="flex-1 max-w-[700px]">
            <Input
              placeholder="Kërko ankesa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:col-span-2"
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <div>
              <Select defaultValue="ALL" value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtro sipas statusit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"ALL"}>Të gjitha</SelectItem>
                  <SelectItem value="PENDING">Në pritje</SelectItem>
                  <SelectItem value="RESOLVED">Zgjidhur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtro sipas kategorisë" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Të gjitha</SelectItem>
                  {Object.keys(Category).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sort Controls - Always visible */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rendit sipas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Më të rejat</SelectItem>
              <SelectItem value="oldest">Më të vjetrat</SelectItem>
              <SelectItem value="upvotes-asc">Votat (Pak)</SelectItem>
              <SelectItem value="upvotes-desc">Votat (Shumë)</SelectItem>
              <SelectItem value="latest-edited">Se fundmi e ndryshuar</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile view toggle */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3x3 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Loading State */}
        {(isLoading || isRefetching) && (
          <div className="py-8 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="mx-auto flex flex-col items-center right-0 left-0 my-8">
            <div className="flex flex-row gap-1">
              <div>
                <h3 className="text-gray-600 font-normal mb-3">Dicka shkoi gabim. Provoni perseri!</h3>
              </div>
              <div className="pt-2 rotate-[50deg]">
                <FaChevronDown size={22} color='#4f46e5'/>
              </div>
            </div>
            <CTAButton onClick={() => refetch()} text='Provo perseri'/>
          </div>
        )}

        {/* Empty Data State */}
        {!isLoading && !isError && complaints.length === 0 && (
          <div className="mx-auto flex flex-col items-center right-0 left-0 my-8">
            <div className="flex flex-row gap-1">
              <div>
                <h3 className="text-gray-600 font-normal mb-3">Nuk u gjet asnjë ankesë</h3>
              </div>
              <div className="pt-2 rotate-[50deg]">
                <FaChevronDown size={22} color='#4f46e5'/>
              </div>
            </div>
            <CTAButton 
              onClick={() => {
                setSearchTerm("");
                setSortBy("newest");
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
                refetch();
              }} 
              text='Filtro të gjitha ankesat'
            />
          </div>
        )}

        {/* Results Count - Only shown when we have data */}
        {!isLoading && !isError && complaints.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {totalCount} ankesa{totalCount !== 1 ? " të gjetura" : " e gjetur"}
          </div>
        )}

        {/* Complaints List - Only shown when we have data */}
        {!isLoading && !isError && complaints.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {complaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} {...complaint} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titulli</TableHead>
                      <TableHead>Kompania</TableHead>
                      <TableHead>Kategoria</TableHead>
                      <TableHead>Statusi</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Vota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id} className="hover:bg-gray-50 cursor-pointer">
                        <TableCell className="font-medium">
                          <Link href={`/ankesat/${complaint.id}`} className="hover:underline">
                            {complaint.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/kompanite/${complaint.company.id}`} className="hover:underline">
                            {complaint.company.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryLabel(complaint.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={complaint.status === 'ACCEPTED' ? "default" : complaint.resolvedStatus === 'RESOLVED' ? "secondary" : 'outline'}
                          >
                            {complaint.resolvedStatus === 'RESOLVED' ? 'Zgjidhur' : 
                              complaint.status === 'ACCEPTED' ? 'Pranuar' : 'Në pritje'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(complaint.createdAt).toLocaleDateString("sq-AL", {day: "2-digit", month: "short", year: "2-digit"})}</TableCell>
                        <TableCell className="text-right">
                          {complaint.upVotes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="mt-8 mx-auto flex items-center justify-between">
                <CTAButton
                  onClick={() => fetchNextPage()}
                  classNames="mx-auto"
                  isLoading={isFetchingNextPage}
                  text='Me shume'
                  primary
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(AllComplaintsCard);